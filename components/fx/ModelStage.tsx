"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_MODEL, STAGE_MODELS } from "@/lib/models";
import { reducedMotion } from "@/lib/fx";

/** A turntable for one 3D object in the off-duty world. The viewer library
    loads only after this mounts (i.e. after the unlock), the GLB streams
    lazily, and a row of names swaps the object. The object faces front;
    the visitor can drag it about 75° either way, and a second after they
    let go it eases back to its pose. Zoom is off so the wheel scrolls. */
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

  // ease back to the front pose a moment after the visitor lets go. Keyed on
  // pointer release rather than camera-change: the viewer's inertia keeps
  // emitting camera-change for seconds as it slows, which would keep
  // postponing the return.
  useEffect(() => {
    const mv = mvRef.current as (HTMLElement & { cameraOrbit: string }) | null;
    if (!mv) return;
    let t = 0;
    const arm = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        mv.cameraOrbit = model.orbit;
      }, reducedMotion() ? 0 : 1100);
    };
    const disarm = () => window.clearTimeout(t);
    mv.addEventListener("pointerdown", disarm);
    mv.addEventListener("pointerup", arm);
    mv.addEventListener("pointercancel", arm);
    mv.addEventListener("pointerleave", arm);
    return () => {
      mv.removeEventListener("pointerdown", disarm);
      mv.removeEventListener("pointerup", arm);
      mv.removeEventListener("pointercancel", arm);
      mv.removeEventListener("pointerleave", arm);
      window.clearTimeout(t);
    };
  }, [ready, model.orbit]);

  return (
    <figure className="model-stage-wrap">
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
            min-camera-orbit="-75deg 60deg auto"
            max-camera-orbit="75deg 100deg auto"
            interpolation-decay={reducedMotion() ? 0 : 700}
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
      <figcaption className="mt-2.5 font-mono text-[11px] leading-snug text-muted">
        {model.blurb} · <span className="uppercase tracking-[0.12em]">drag to turn</span>
      </figcaption>
      {STAGE_MODELS.length > 1 && (
      <div
        role="group"
        aria-label="Pick the object on the turntable"
        className="mt-2.5 flex flex-wrap gap-1.5"
      >
        {STAGE_MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setId(m.id)}
            aria-pressed={m.id === id}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] lowercase tracking-wider transition-colors ${
              m.id === id
                ? "border-accent bg-accent text-accent-contrast"
                : "border-border text-muted hover:border-accent/50 hover:text-foreground"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>
      )}
    </figure>
  );
}
