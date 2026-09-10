"use client";

import { useEffect, useState } from "react";
import { DEFAULT_MODEL, STAGE_MODELS } from "@/lib/models";
import { reducedMotion } from "@/lib/fx";

/** A turntable for one 3D object in the off-duty world. The viewer library
    loads only after this mounts (i.e. after the unlock), the GLB streams
    lazily, and a row of names swaps the object. Drag to spin, no scroll
    hijack (zoom is off). Auto-rotation respects reduced motion. */
export default function ModelStage() {
  const [ready, setReady] = useState(false);
  const [id, setId] = useState(DEFAULT_MODEL);
  // this only mounts after the unlock (client-side), so the media query can
  // be read in the initializer instead of an effect
  const [spin] = useState(() => typeof window === "undefined" || !reducedMotion());
  const model = STAGE_MODELS.find((m) => m.id === id) ?? STAGE_MODELS[0];

  useEffect(() => {
    let alive = true;
    import("@google/model-viewer").then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <figure className="model-stage-wrap">
      <div className="model-stage">
        {ready ? (
          <model-viewer
            key={model.id}
            src={model.src}
            alt={`${model.name}: ${model.blurb}`}
            camera-controls
            disable-zoom
            disable-pan
            touch-action="pan-y"
            auto-rotate={spin || undefined}
            auto-rotate-delay={0}
            rotation-per-second="18deg"
            camera-orbit={model.orbit}
            exposure={1.05}
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
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <span className="font-mono text-[11px] text-muted-strong">
          {model.name}
          <span className="text-muted"> · {model.blurb}</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          drag to spin
        </span>
      </figcaption>
      <div
        role="group"
        aria-label="Pick the object on the turntable"
        className="mt-3 flex flex-wrap gap-1.5"
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
    </figure>
  );
}
