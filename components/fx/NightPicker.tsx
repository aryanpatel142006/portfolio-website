"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_NIGHT, NIGHT_PALETTES } from "@/lib/night-palettes";
import { setNight } from "@/lib/offduty";

/* html[data-night] is the single source of truth; this mirrors it. */
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-night"] });
  return () => mo.disconnect();
}

/** A row of swatches that re-pigments the whole night world on click.
    The choice is remembered in localStorage so the visitor's next unlock
    opens on the same night. */
export default function NightPicker() {
  const current = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.night ?? DEFAULT_NIGHT,
    () => DEFAULT_NIGHT,
  );
  const active = NIGHT_PALETTES.find((p) => p.id === current) ?? NIGHT_PALETTES[0];

  return (
    <div className="night-picker" role="group" aria-label="Pick the night's palette">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        night
      </span>
      <div className="flex items-center gap-1.5">
        {NIGHT_PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setNight(p.id)}
            aria-pressed={p.id === current}
            aria-label={`${p.name}: ${p.blurb}`}
            title={`${p.name} · ${p.blurb}`}
            className={`swatch ${p.id === current ? "is-active" : ""}`}
            style={{
              ["--s1" as string]: p.swatch[0],
              ["--s2" as string]: p.swatch[1],
              ["--s3" as string]: p.swatch[2],
            }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-muted-strong">{active.name}</span>
    </div>
  );
}
