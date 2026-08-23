"use client";

import { useEffect, useRef, useState } from "react";
import { offDuty } from "@/lib/content";
import NonMainstream from "@/components/NonMainstream";
import AnimeStats from "@/components/AnimeStats";
import { prefetchTracks } from "@/lib/tracks-client";
import {
  KONAMI_SEQUENCE,
  OFFDUTY_ANCHOR_LABEL,
  OFFDUTY_RELOCK_EVENT,
  OFFDUTY_UNLOCK_EVENT,
  relockOffDuty,
  unlockOffDuty,
} from "@/lib/offduty";

export default function OffDuty() {
  // Session-only reveal — no persistence, so a reload returns to the teaser
  // and the easter egg can be found again.
  const [unlocked, setUnlocked] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Warm the song-shelf cache the moment the page loads — long before the user
  // unlocks off-duty — so the cards are already resolved when the shelf mounts.
  useEffect(() => {
    prefetchTracks();
  }, []);

  // Reveal on any unlock trigger; collapse on relock.
  useEffect(() => {
    const onUnlock = () => {
      setUnlocked(true);
      setJustUnlocked(true);
    };
    const onRelock = () => {
      setUnlocked(false);
      setJustUnlocked(false);
    };
    window.addEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
    window.addEventListener(OFFDUTY_RELOCK_EVENT, onRelock);
    return () => {
      window.removeEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
      window.removeEventListener(OFFDUTY_RELOCK_EVENT, onRelock);
    };
  }, []);

  // "Back to work mode" — collapse the warm world and glide back to the teaser.
  function backToWork() {
    const anchor = sectionRef.current;
    relockOffDuty();
    // After the teaser re-renders in place, ease the viewport back to it.
    requestAnimationFrame(() => {
      anchor?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // Konami code listener — ↑↑↓↓←→←→ B A
  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[i];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        i += 1;
        if (i === KONAMI_SEQUENCE.length) {
          i = 0;
          unlockOffDuty();
        }
      } else {
        // Allow a wrong key to be the start of a fresh attempt.
        i = e.key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll to the section the moment it's freshly revealed.
  useEffect(() => {
    if (justUnlocked && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [justUnlocked]);

  // Locked: show a friendly invitation to reveal the off-duty side.
  if (!unlocked) {
    return (
      <div className="mt-16 flex justify-center">
        <button
          type="button"
          onClick={() => unlockOffDuty()}
          className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card px-6 py-5 text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/[0.05]"
        >
          <span className="text-[13px] text-muted-strong transition-colors group-hover:text-foreground">
            wanna know me when i&rsquo;m not geeking out over code?
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
            the off-duty me
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label={OFFDUTY_ANCHOR_LABEL}
      className={`offduty-world relative ${justUnlocked ? "warm-in" : ""}`}
    >
      <hr className="divider mb-12 mt-4" />

      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="kicker mb-2">
            <span className="text-accent">07</span>
            <span aria-hidden> / </span>
            off the clock
          </p>
          <h2 className="display text-3xl italic text-foreground sm:text-4xl">
            the off-duty me
          </h2>
        </div>
        <button
          type="button"
          onClick={backToWork}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 font-mono text-[11px] text-muted transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-accent/40 hover:text-foreground"
        >
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-0.5">
            &larr;
          </span>
          back to work mode
        </button>
      </div>

      <p className="mb-9 max-w-md font-serif text-[17px] italic leading-relaxed text-muted-strong">
        {offDuty.intro}
      </p>

      {/* anime — live AniList stats + currently watching */}
      <AnimeStats />

      {/* hobbies */}
      {offDuty.hobbies.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            things i like when i&rsquo;m not coding
          </p>
          <div className="flex flex-wrap gap-2">
            {offDuty.hobbies.map((h) => (
              <span
                key={h}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] text-muted-strong transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.08] hover:text-foreground"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* non-mainstream songs — Spotify-powered shelf */}
      <NonMainstream />
    </section>
  );
}
