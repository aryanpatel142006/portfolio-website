"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { offDuty } from "@/lib/content";
import {
  KONAMI_SEQUENCE,
  OFFDUTY_ANCHOR_LABEL,
  OFFDUTY_STORAGE_KEY,
  OFFDUTY_UNLOCK_EVENT,
  unlockOffDuty,
} from "@/lib/offduty";
import SectionHeading from "./SectionHeading";

const kindGlyph: Record<string, string> = {
  book: "📖",
  music: "🎵",
  show: "📺",
  film: "🎬",
  podcast: "🎙️",
};

// External store: the persisted unlock flag. SSR + first client render read
// `false` (getServerSnapshot) so there's no hydration mismatch; the real value
// arrives after commit.
function subscribe(onChange: () => void) {
  window.addEventListener(OFFDUTY_UNLOCK_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(OFFDUTY_UNLOCK_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
function getSnapshot() {
  return window.localStorage.getItem(OFFDUTY_STORAGE_KEY) === "1";
}

export default function OffDuty() {
  const unlocked = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // A live unlock (this session) should reveal + scroll; a restored one shouldn't.
  useEffect(() => {
    const onUnlock = () => setJustUnlocked(true);
    window.addEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
    return () => window.removeEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
  }, []);

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
          className="group flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/[0.05]"
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
      className={justUnlocked ? "fade-up" : undefined}
    >
      <hr className="divider mb-12 mt-4" />
      <SectionHeading>off duty</SectionHeading>
      <p className="-mt-3 mb-7 max-w-md text-sm leading-relaxed text-muted-strong">
        {offDuty.intro}
      </p>

      {/* now */}
      {offDuty.now.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            now
          </p>
          <div className="flex flex-col gap-2">
            {offDuty.now.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span className="w-28 shrink-0 font-mono text-[11px] text-accent">
                  {item.label}
                </span>
                <span className="text-[13px] text-muted-strong">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* hobbies */}
      {offDuty.hobbies.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            when i&rsquo;m not coding
          </p>
          <div className="flex flex-wrap gap-2">
            {offDuty.hobbies.map((h) => (
              <span
                key={h}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] text-muted-strong transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.08] hover:text-foreground"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* bookshelf / media diet */}
      {offDuty.media.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            in rotation
          </p>
          <div className="flex flex-col gap-2">
            {offDuty.media.map((m) => (
              <div
                key={m.kind + m.title}
                className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span aria-hidden className="text-base leading-none">
                  {kindGlyph[m.kind] ?? "•"}
                </span>
                <div className="flex flex-col leading-snug">
                  <span className="text-[13px] text-foreground">
                    {m.title}
                    {m.creator && (
                      <span className="text-muted"> · {m.creator}</span>
                    )}
                  </span>
                  {m.take && (
                    <span className="mt-0.5 text-[12px] italic text-muted">
                      {m.take}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* cat corner */}
      {offDuty.catPhotos.length > 0 && (
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            cat corner
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {offDuty.catPhotos.map((photo, i) => (
              <figure
                key={photo.src + i}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]"
              >
                <Image
                  src={photo.src}
                  alt={photo.caption ?? ""}
                  fill
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                {photo.caption && (
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 font-mono text-[10px] text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
