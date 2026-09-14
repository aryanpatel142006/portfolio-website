"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_MODEL, STAGE_MODELS } from "@/lib/models";
import { reducedMotion } from "@/lib/fx";
import { OFFDUTY_COIN_EVENT } from "@/lib/offduty";

type MV = HTMLElement & {
  cameraOrbit: string;
  getCameraOrbit: () => { theta: number; phi: number; radius: number };
};

const TAU = Math.PI * 2;

/** A turntable for one 3D object in the off-duty world. The viewer library
    loads only after this mounts (i.e. after the unlock) and the GLB streams
    lazily. Left alone, the object swings slowly side to side about its
    front, never showing its back. Drag it and it is entirely yours, momentum
    included; once it has stopped moving it eases back to the front over a
    few seconds and the swing picks up again from rest. Zoom is off so the
    wheel scrolls. Each coin swaps the object for one of the others. */
export default function ModelStage() {
  const [ready, setReady] = useState(false);
  const [id, setId] = useState(DEFAULT_MODEL);
  const model = STAGE_MODELS.find((m) => m.id === id) ?? STAGE_MODELS[0];
  const mvRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let alive = true;
    import("@google/model-viewer").then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // a coin deals a different object onto the turntable
  useEffect(() => {
    const onCoin = () =>
      setId((cur) => {
        const others = STAGE_MODELS.filter((m) => m.id !== cur);
        return others[Math.floor(Math.random() * others.length)]?.id ?? cur;
      });
    window.addEventListener(OFFDUTY_COIN_EVENT, onCoin);
    return () => window.removeEventListener(OFFDUTY_COIN_EVENT, onCoin);
  }, []);

  // Four phases. idle: a slow pendulum swing about the front pose. drag: the
  // visitor has it, hands off. coast: they let go and the viewer's own
  // momentum is still spinning it; we wait until the camera has been quiet
  // for a moment. return: we ease it from wherever it stopped back to the
  // front over a few seconds, then the swing resumes from rest.
  useEffect(() => {
    const mv = mvRef.current as MV | null;
    if (!mv) return;
    const [thetaStr, phiStr, radiusStr] = model.orbit.split(" ");
    const front = (parseFloat(thetaStr) * Math.PI) / 180;
    const still = reducedMotion();
    let phase: "idle" | "drag" | "coast" | "return" = "idle";
    let base = front; // front plus whole turns, so the way home is the short way
    let t0 = performance.now(); // swing clock; restarts at rest after a return
    let ret = { from: front, start: 0 };
    let raf = 0;
    let quiet = 0;
    const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    const setTheta = (theta: number) => {
      mv.cameraOrbit = `${((theta * 180) / Math.PI).toFixed(2)}deg ${phiStr} ${radiusStr}`;
    };
    const loop = (now: number) => {
      if (phase === "idle") {
        // ±40° at the target; the interpolation trims that to roughly ±30°
        // on screen. sin(t / 2300) is a full swing every ~14s.
        setTheta(base + (still ? 0 : Math.sin((now - t0) / 2300) * 0.7));
      } else if (phase === "return") {
        const k = still ? 1 : Math.min(1, (now - ret.start) / 2800);
        setTheta(ret.from + (base - ret.from) * ease(k));
        if (k >= 1) {
          phase = "idle";
          t0 = now; // sway starts from rest, no jump
        }
      }
      raf = requestAnimationFrame(loop);
    };
    const beginReturn = () => {
      const cur = mv.getCameraOrbit().theta;
      base = front + Math.round((cur - front) / TAU) * TAU;
      ret = { from: cur, start: performance.now() };
      phase = "return";
    };
    const armQuiet = () => {
      window.clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        if (phase === "coast") beginReturn();
      }, 650);
    };
    const down = () => {
      phase = "drag";
      window.clearTimeout(quiet);
    };
    const up = () => {
      if (phase !== "drag") return;
      phase = "coast";
      armQuiet();
    };
    // while coasting, every camera move from momentum pushes the quiet timer
    const onCamera = (e: Event) => {
      if (phase !== "coast") return;
      if ((e as CustomEvent<{ source?: string }>).detail?.source !== "user-interaction") return;
      armQuiet();
    };
    mv.addEventListener("pointerdown", down);
    mv.addEventListener("pointerup", up);
    mv.addEventListener("pointercancel", up);
    mv.addEventListener("pointerleave", up);
    mv.addEventListener("camera-change", onCamera);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(quiet);
      mv.removeEventListener("pointerdown", down);
      mv.removeEventListener("pointerup", up);
      mv.removeEventListener("pointercancel", up);
      mv.removeEventListener("pointerleave", up);
      mv.removeEventListener("camera-change", onCamera);
    };
  }, [ready, model.orbit]);

  return (
    <div className="model-stage-wrap">
      <div className="model-stage">
        {ready ? (
          <model-viewer
            key={model.id}
            ref={mvRef}
            src={model.src}
            alt={`${model.name}: ${model.blurb}`}
            camera-controls
            disable-zoom
            disable-pan
            touch-action="pan-y"
            camera-orbit={model.orbit}
            interpolation-decay={reducedMotion() ? 0 : 220}
            exposure={model.exposure}
            shadow-intensity={0.7}
            shadow-softness={0.9}
            environment-image="neutral"
            interaction-prompt="none"
            loading="eager"
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[11px] text-muted">
            loading the turntable…
          </div>
        )}
        <span aria-hidden className="model-stage-floor" />
      </div>
    </div>
  );
}
