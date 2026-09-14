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
    lazily. Left alone, the object swings side to side through about 40°
    either way of its front, like a slow pendulum, so it moves without ever
    showing its back. Drag it and it spins freely with momentum; a moment
    after you let go it eases back into the swing. Zoom is off so the wheel
    scrolls. Each coin swaps the object for one of the other two. */
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

  // idle: sway around the front pose; after a drag: wait, then glide home.
  // The target is set every frame with a slow interpolation, so the glide
  // and the sway are the same motion at different amplitudes.
  useEffect(() => {
    const mv = mvRef.current as MV | null;
    if (!mv) return;
    const [thetaStr, phiStr, radiusStr] = model.orbit.split(" ");
    const front = (parseFloat(thetaStr) * Math.PI) / 180;
    const still = reducedMotion();
    let base = front; // front, plus whole turns so the way home is the short way
    let idle = true;
    let raf = 0;
    let timer = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      if (idle) {
        const sway = still ? 0 : Math.sin((now - t0) / 1250) * 0.7; // ±40°, ~8s per full swing
        mv.cameraOrbit = `${(((base + sway) * 180) / Math.PI).toFixed(2)}deg ${phiStr} ${radiusStr}`;
      }
      raf = requestAnimationFrame(loop);
    };
    const down = () => {
      idle = false;
      window.clearTimeout(timer);
    };
    const up = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const cur = mv.getCameraOrbit().theta;
        base = front + Math.round((cur - front) / TAU) * TAU;
        idle = true;
      }, still ? 0 : 900);
    };
    mv.addEventListener("pointerdown", down);
    mv.addEventListener("pointerup", up);
    mv.addEventListener("pointercancel", up);
    mv.addEventListener("pointerleave", up);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      mv.removeEventListener("pointerdown", down);
      mv.removeEventListener("pointerup", up);
      mv.removeEventListener("pointercancel", up);
      mv.removeEventListener("pointerleave", up);
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
            interpolation-decay={reducedMotion() ? 0 : 450}
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
