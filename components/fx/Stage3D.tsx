"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { StageModel } from "@/lib/models";

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
function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
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

export default function Stage3D({ model }: { model: StageModel }) {
  const pal = usePalette();
  const [thetaStr, phiStr] = model.orbit.split(" ");
  const front = (parseFloat(thetaStr) * Math.PI) / 180;
  const polar = (parseFloat(phiStr) * Math.PI) / 180;

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 30, position: [0, 0.9, DIST], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Environment files="/models/studio.hdr" environmentIntensity={0.9} />
        <Model src={model.src} />
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
      <ContactShadows position={[0, -0.96, 0]} opacity={0.55} scale={7} blur={2.6} far={3} />
      <Rig front={front} polar={polar} />
      <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
        <N8AO aoRadius={0.45} intensity={2.2} distanceFalloff={0.7} quality="performance" />
        <Bloom intensity={0.6} luminanceThreshold={0.72} luminanceSmoothing={0.25} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.25} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
