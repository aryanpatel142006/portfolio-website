"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { offDuty } from "@/lib/content";
import NonMainstream from "@/components/NonMainstream";
import AnimeStats from "@/components/AnimeStats";
import NightSky from "@/components/fx/NightSky";
import { playCoin } from "@/lib/coin-sound";
import { prefetchTracks } from "@/lib/tracks-client";
import {
  KONAMI_SEQUENCE,
  OFFDUTY_ANCHOR_LABEL,
  OFFDUTY_RELOCK_EVENT,
  OFFDUTY_TEASER_ID,
  OFFDUTY_UNLOCK_EVENT,
  OFFDUTY_COIN_EVENT,
  FX_SPARKS_EVENT,
  relockOffDuty,
  unlockOffDuty,
  type UnlockDetail,
  type UnlockVia,
} from "@/lib/offduty";

export default function OffDuty() {
  // Session-only reveal — no persistence, so a reload returns to the teaser
  // and the easter egg can be found again.
  const [unlocked, setUnlocked] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // "you just did X" note for unlocks that can happen by accident
  const [toastVia, setToastVia] = useState<UnlockVia | null>(null);
  // arcade credits: each coin reshuffles the shelf and replays the counters
  const [credits, setCredits] = useState(0);
  const [coinDrop, setCoinDrop] = useState(0); // bumps to replay the drop animation

  function insertCoin(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setCredits((c) => c + 1);
    setCoinDrop((k) => k + 1);
    playCoin();
    window.dispatchEvent(new CustomEvent(OFFDUTY_COIN_EVENT));
    window.dispatchEvent(
      new CustomEvent(FX_SPARKS_EVENT, {
        detail: { x: r.left + 12, y: r.top + r.height / 2, count: 60 },
      }),
    );
  }
  // the section's own "back to work mode" button; when it scrolls out of
  // view a floating twin takes over so the exit is always one click away
  const headRef = useRef<HTMLDivElement>(null);
  const [headVisible, setHeadVisible] = useState(true);

  useEffect(() => {
    const el = headRef.current;
    if (!unlocked || !el) return;
    const io = new IntersectionObserver(([e]) => setHeadVisible(e.isIntersecting), {
      rootMargin: "-56px 0px 0px 0px", // the sticky header's height
    });
    io.observe(el);
    return () => io.disconnect();
  }, [unlocked]);

  // Warm the song-shelf cache the moment the page loads — long before the user
  // unlocks off-duty — so the cards are already resolved when the shelf mounts.
  useEffect(() => {
    prefetchTracks();
  }, []);

  // Reveal on any unlock trigger; collapse on relock.
  useEffect(() => {
    const onUnlock = (e: Event) => {
      setUnlocked(true);
      setJustUnlocked(true);
      const via = (e as CustomEvent<UnlockDetail>).detail?.via;
      setToastVia(via === "keys" || via === "photo" ? via : null);
    };
    const onRelock = () => {
      setUnlocked(false);
      setJustUnlocked(false);
      setToastVia(null);
      setCredits(0);
    };
    window.addEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
    window.addEventListener(OFFDUTY_RELOCK_EVENT, onRelock);
    return () => {
      window.removeEventListener(OFFDUTY_UNLOCK_EVENT, onUnlock);
      window.removeEventListener(OFFDUTY_RELOCK_EVENT, onRelock);
    };
  }, []);

  // "Back to work mode" — the daytime theme sweeps back out of the button,
  // the world collapses, and the viewport lands on the teaser (all inside
  // the view transition; see relockOffDuty).
  function backToWork(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    relockOffDuty({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  // the toast retires itself after a while
  useEffect(() => {
    if (!toastVia) return;
    const id = window.setTimeout(() => setToastVia(null), 12_000);
    return () => window.clearTimeout(id);
  }, [toastVia]);

  // Escape is always a way out of the night (unless the palette has it)
  useEffect(() => {
    if (!unlocked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.querySelector('[aria-label="Command palette"]')) return;
      relockOffDuty();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlocked]);

  // Konami code listener — ↑↑↓↓←→←→ B A
  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI_SEQUENCE[i];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        i += 1;
        if (i === KONAMI_SEQUENCE.length) {
          i = 0;
          unlockOffDuty(undefined, "keys");
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
      <div id={OFFDUTY_TEASER_ID} className="mt-16 flex justify-center scroll-mt-24">
        <button
          type="button"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            unlockOffDuty({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
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
      <NightSky />
      <hr className="divider mb-12 mt-4" />

      <div ref={headRef} className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="kicker mb-2">
            <span className="text-accent">appendix</span>
            <span aria-hidden> / </span>
            off the clock
          </p>
          <h2
            data-text="the off-duty me"
            className={`display neon-text text-3xl italic sm:text-4xl ${justUnlocked ? "glitch" : ""}`}
          >
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

      {/* the coin slot: a real button. each coin reshuffles the song shelf,
          replays the score counters, throws sparks and goes "bling" */}
      <button
        type="button"
        onClick={insertCoin}
        aria-label={`Insert coin: reshuffle the song shelf. Credits: ${credits}`}
        className="coin-slot group mb-6 inline-flex items-center gap-3 font-arcade text-[9px] uppercase tracking-[0.18em] text-neon-2"
      >
        <span className="coin-well" aria-hidden>
          <span key={coinDrop} className={coinDrop ? "coin coin-fall" : "coin"} />
        </span>
        <span>
          {credits === 0 ? (
            <>
              <span className="coin-blink">▶</span> player 1 · insert coin
            </>
          ) : (
            <>
              credits {String(credits).padStart(2, "0")} · shelf reshuffled
            </>
          )}
        </span>
        <span
          aria-hidden
          className="text-[8px] text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          {credits === 0 ? "click" : "again?"}
        </span>
      </button>

      <p className="mb-9 max-w-md font-serif text-[17px] italic leading-relaxed text-muted-strong">
        {offDuty.intro}
      </p>

      {/* "you found it" note for the two routes that can fire by accident */}
      {toastVia &&
        typeof document !== "undefined" &&
        createPortal(
          <div role="status" aria-live="polite" className="secret-toast">
            <p className="font-arcade text-[9px] uppercase tracking-[0.18em] text-neon-2">
              secret found
            </p>
            <p className="mt-1.5 text-[13px] leading-snug text-foreground">
              {toastVia === "keys" ? (
                <>
                  Pressing <kbd>↓</kbd> <kbd>↓</kbd> opened the off-duty side of this site.
                </>
              ) : (
                <>
                  Tapping the photo five times opened the off-duty side of this site.
                </>
              )}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={backToWork}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/10 px-3 py-1.5 font-mono text-[11px] text-foreground transition-colors hover:bg-accent hover:text-accent-contrast"
              >
                &larr; back to work mode
              </button>
              <button
                type="button"
                onClick={() => setToastVia(null)}
                className="font-mono text-[11px] text-muted transition-colors hover:text-foreground"
              >
                stay a while
              </button>
              <span className="hidden font-mono text-[10px] text-muted sm:inline">
                <kbd>esc</kbd> also exits
              </span>
            </div>
          </div>,
          document.body,
        )}

      {/* floating exit, only while the section's own button is off-screen */}
      {!headVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <button
            type="button"
            onClick={backToWork}
            className="back-float group inline-flex items-center gap-2 rounded-full border border-accent/60 bg-surface/90 px-4 py-2.5 font-mono text-[11px] text-foreground shadow-[0_0_28px_-8px_var(--accent)] backdrop-blur-md transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_-6px_var(--accent)]"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-0.5">
              &larr;
            </span>
            back to work mode
          </button>,
          document.body,
        )}

      {/* anime — live AniList stats + currently watching */}
      <AnimeStats />

      {/* hobbies */}
      {offDuty.hobbies.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            things i like when i&rsquo;m not coding
          </p>
          <div className="flex flex-wrap gap-2">
            {offDuty.hobbies.map((h, i) => (
              <span
                key={h}
                className={`rounded-lg border border-accent/50 bg-accent/[0.06] px-3 py-1.5 text-[12px] text-foreground shadow-[0_0_18px_-6px_var(--accent)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_0_30px_-6px_var(--accent)] ${
                  i % 3 === 1 ? "neon-flicker" : ""
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* non-mainstream songs — Spotify-powered shelf */}
      <NonMainstream />

      {/* closing epigraph — the easter egg's mic drop */}
      <p className="mt-10 max-w-md font-serif text-[15px] italic leading-relaxed text-muted">
        &ldquo;in order to be irreplaceable, one must always be
        different.&rdquo;
        <span className="ml-2 whitespace-nowrap font-mono text-[10px] uppercase not-italic tracking-[0.12em]">
          &mdash; coco chanel
        </span>
      </p>
    </section>
  );
}
