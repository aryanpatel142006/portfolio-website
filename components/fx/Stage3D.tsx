"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Lightformer, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { StageModel } from "@/lib/models";
import StageBoot from "./StageBoot";

/* ─────────────────────────────────────────────────────────────────────────
   A Three.js stage for one object: HDR studio light, a key light with
   shadows, two rim lights in the night's own neon, contact shadow, then
   bloom, ambient occlusion, ACES tone mapping and a vignette on top. That
   post stack is what the plain viewer could not do and why the object read
   flat. Motion: a slow swing at rest; free drag with momentum; a moment
   after the visitor lets go it eases back to the front and the swing
   resumes from rest.
   ───────────────────────────────────────────────────────────────────── */

const TAU = Math.PI * 2;
const DIST = 5.0;

/** Live palette from the CSS tokens, re-read when the night changes. */
function usePalette() {
  const read = () => {
    const cs = getComputedStyle(document.documentElement);
    return {
      accent: cs.getPropertyValue("--accent").trim() || "#ff3d9a",
      neon2: cs.getPropertyValue("--neon-2").trim() || "#33e6ff",
      surface: cs.getPropertyValue("--surface").trim() || "#120a1f",
    };
  };
  const [pal, setPal] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setPal(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-night", "data-theme"] });
    return () => mo.disconnect();
  }, []);
  return pal;
}

/** The GLB, centered and scaled to a ~2.3 unit box, shadows on. */
function Model({ src, onReady }: { src: string; onReady: () => void }) {
  const { scene } = useGLTF(src);
  const { gl, scene: root, camera } = useThree();
  // this renders only once the GLB has resolved (Suspense); the object then
  // gets its shaders compiled off the main thread where the driver allows
  // (KHR_parallel_shader_compile) and only THEN counts as ready, so the
  // reveal never lands on a half-built frame. The loader's own progress
  // counters are unreliable with Draco, so they only decorate the overlay.
  useEffect(() => {
    let alive = true;
    gl.compileAsync(root, camera)
      .catch(() => {})
      .finally(() => {
        if (alive) onReady();
      });
    return () => {
      alive = false;
    };
  }, [gl, root, camera, onReady]);
  const prepared = useMemo(() => {
    const root = scene.clone(true);
    // Sketchfab exports often ship a huge ground/shadow plane; hide it and
    // fit the camera to the object itself
    const box = new THREE.Box3();
    root.updateMatrixWorld(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (/ground|floor|plane|shadow|backdrop/i.test(mesh.name) || /ground|floor|shadow/i.test((mesh.material as THREE.Material)?.name ?? "")) {
        mesh.visible = false;
        return;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      box.expandByObject(mesh);
    });
    const size = box.getSize(new THREE.Vector3());
    const scale = 2.05 / Math.max(size.x, size.y, size.z || 1);
    root.scale.setScalar(scale);
    return root;
  }, [scene]);
  return (
    <Center top position={[0, -0.95, 0]}>
      <primitive object={prepared} />
    </Center>
  );
}

/** The turntable's brain: idle swing, drag, coast, return. */
function Rig({ front, polar }: { front: number; polar: number }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const phase = useRef<"idle" | "drag" | "coast" | "return">("idle");
  const base = useRef(front);
  const t0 = useRef(0);
  const ret = useRef({ from: front, start: 0 });
  const quiet = useRef(0);
  const lastAz = useRef(front);
  const stillFrames = useRef(0);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.setAzimuthalAngle(front);
    c.setPolarAngle(polar);
    c.update();
    const beginReturn = () => {
      const cur = c.getAzimuthalAngle();
      base.current = front + Math.round((cur - front) / TAU) * TAU;
      ret.current = { from: cur, start: performance.now() };
      phase.current = "return";
    };
    const onStart = () => {
      phase.current = "drag";
      window.clearTimeout(quiet.current);
    };
    const onEnd = () => {
      phase.current = "coast";
      stillFrames.current = 0;
      // safety net: whatever happens, head home within two seconds
      window.clearTimeout(quiet.current);
      quiet.current = window.setTimeout(() => {
        if (phase.current === "coast") beginReturn();
      }, 2000);
    };
    c.addEventListener("start", onStart);
    c.addEventListener("end", onEnd);
    // exposed to useFrame through the ref
    (c as unknown as { __beginReturn: () => void }).__beginReturn = beginReturn;
    return () => {
      c.removeEventListener("start", onStart);
      c.removeEventListener("end", onEnd);
      window.clearTimeout(quiet.current);
    };
  }, [front, polar]);

  useFrame(() => {
    const c = controls.current;
    if (!c) return;
    const now = performance.now();
    if (phase.current === "coast") {
      // the controls' damping tails off for seconds; call it stopped once the
      // object has barely moved for a third of a second
      const az = c.getAzimuthalAngle();
      stillFrames.current = Math.abs(az - lastAz.current) < 0.0025 ? stillFrames.current + 1 : 0;
      lastAz.current = az;
      if (stillFrames.current > 20) {
        window.clearTimeout(quiet.current);
        (c as unknown as { __beginReturn: () => void }).__beginReturn();
      }
    } else if (phase.current === "idle") {
      if (!t0.current) t0.current = now;
      c.setAzimuthalAngle(base.current + Math.sin((now - t0.current) / 2300) * 0.7);
      c.update();
    } else if (phase.current === "return") {
      const k = Math.min(1, (now - ret.current.start) / 2800);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      c.setAzimuthalAngle(ret.current.from + (base.current - ret.current.from) * e);
      c.update();
      if (k >= 1) {
        phase.current = "idle";
        t0.current = now; // the swing starts from rest, no jump
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.9}
      minPolarAngle={polar}
      maxPolarAngle={polar}
      target={[0, 0, 0]}
    />
  );
}

/** Watches the first seconds after the reveal: a machine that cannot hold
    ~40fps with the full stack gets the lighter one (no ambient occlusion,
    1x pixels) once, for the rest of the session. */
function Governor({ active, onSlow }: { active: boolean; onSlow: () => void }) {
  const setDpr = useThree((s) => s.setDpr);
  const samples = useRef<number[]>([]);
  const elapsed = useRef(0);
  const done = useRef(false);
  useFrame((_, delta) => {
    if (!active || done.current) return;
    samples.current.push(delta * 1000);
    elapsed.current += delta * 1000;
    // judge after ~1.5s of wall time (a struggling machine produces few
    // frames in that window, so the count alone would wait far too long)
    if (elapsed.current < 1500 || samples.current.length < 12) return;
    done.current = true;
    const sorted = [...samples.current].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    if (median > 25) {
      setDpr(1);
      onSlow();
    }
  });
  return null;
}

/** Only render frames while the stage is on screen; the swing costs nothing
    when the visitor is reading the songs below. */
function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

/** "booting turntable… 62%" over the stage until the object and its
    textures are in; shows again briefly on every coin swap. */
function Loading() {
  const { progress } = useProgress();
  return <StageBoot progress={progress} />;
}

/** A studio built from light panels instead of a downloaded HDR: a big soft
    key overhead, a cool fill, a warm kicker, a floor bounce. Rendered once
    into a 256px environment map, so it costs no bytes and little GPU. */
function Studio() {
  return (
    <Environment resolution={256} environmentIntensity={0.9}>
      <Lightformer form="rect" intensity={6} position={[0, 4, 2]} rotation={[-Math.PI / 2, 0, 0]} scale={[6, 4, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#dfe9ff" position={[-5, 2, 1]} rotation={[0, Math.PI / 2.4, 0]} scale={[4, 3, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffe6c8" position={[5, 1.5, -1]} rotation={[0, -Math.PI / 2.4, 0]} scale={[3, 3, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#8f8fb0" position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
    </Environment>
  );
}

export default function Stage3D({ model }: { model: StageModel }) {
  const pal = usePalette();
  const wrap = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(wrap);
  const [thetaStr, phiStr] = model.orbit.split(" ");
  const front = (parseFloat(thetaStr) * Math.PI) / 180;
  const polar = (parseFloat(phiStr) * Math.PI) / 180;
  // phones and small-core machines skip ambient occlusion and render at 1x
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const [light] = useState(
    () =>
      typeof window !== "undefined" &&
      (matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency ?? 8) < 6),
  );

  return (
    <div
      ref={wrap}
      className={`stage-reveal relative h-full w-full ${ready ? "is-ready" : ""}`}
      data-quality={light || slow ? "light" : "full"}
    >
    <Canvas
      shadows
      dpr={light ? 1 : [1, 1.5]}
      frameloop={onScreen ? "always" : "never"}
      camera={{ fov: 30, position: [0, 0.9, DIST], near: 0.1, far: 50 }}
      gl={{ antialias: !light, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Studio />
        <Model src={model.src} onReady={() => setReady(true)} />
        {/* the camera orbits and the object stays put, so the contact shadow
            is rendered once per object instead of on every frame */}
        <ContactShadows frames={1} position={[0, -0.96, 0]} opacity={0.55} scale={7} blur={2.6} far={3} />
      </Suspense>
      {/* key, fill, and two rim lights in the night's neon */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3.5, 5, 4]}
        intensity={3 * model.exposure}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-3.2, 2.2, -2.4]} color={pal.accent} intensity={18} distance={12} />
      <pointLight position={[3.4, 0.8, -3]} color={pal.neon2} intensity={14} distance={12} />
      <Rig front={front} polar={polar} />
      <Governor active={ready} onSlow={() => setSlow(true)} />
      <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
        {light || slow ? <></> : <N8AO aoRadius={0.45} intensity={2.2} distanceFalloff={0.7} quality="performance" />}
        <Bloom intensity={0.6} luminanceThreshold={0.72} luminanceSmoothing={0.25} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.25} darkness={0.6} />
      </EffectComposer>
    </Canvas>
    {!ready && <Loading />}
    </div>
  );
}
