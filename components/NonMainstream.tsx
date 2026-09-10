"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { playPreview, stopPreview, subscribe } from "@/lib/preview-player";
import { OFFDUTY_COIN_EVENT } from "@/lib/offduty";
import { offDuty, type SongEntry, type SongLang } from "@/lib/content";
import { prefetchTracks, type Track } from "@/lib/tracks-client";

// Derive a readable "Title / Artist" from a raw content entry, used as the
// graceful fallback when the Spotify API can't resolve (or isn't configured).
const HAND = 7; // cards on the table at once

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LANG_LABEL: Record<SongLang, string> = {
  en: "english",
  hi: "hindi",
  gu: "gujarati",
  pa: "punjabi",
  jp: "japanese",
};

function fallbackFromEntry(entry: SongEntry): { title: string; artist: string; lang?: SongLang } {
  const s = (typeof entry === "string" ? entry : entry.src).trim();
  const lang = typeof entry === "string" ? undefined : entry.lang;
  if (/open\.spotify\.com|spotify:track:/.test(s)) {
    return { title: "spotify track", artist: "", lang };
  }
  const parts = s.split(/\s+[—–-]\s+/);
  if (parts.length >= 2) {
    return { title: parts[0].trim(), artist: parts.slice(1).join(" — ").trim(), lang };
  }
  return { title: s, artist: "", lang };
}

function Art({
  src,
  title,
  progress,
}: {
  src: string | null;
  title: string;
  progress: number;
}) {
  // the ring around the art is the clip's progress; at rest it's a hairline
  return (
    <span
      className="art relative h-12 w-12 shrink-0 rounded-full p-[3px]"
      style={{ ["--p" as string]: progress }}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={48}
          height={48}
          className="vinyl h-full w-full rounded-full object-cover"
          unoptimized
        />
      ) : (
        <span
          aria-hidden
          className="vinyl flex h-full w-full items-center justify-center rounded-full bg-accent/[0.06] text-accent"
          title={title}
        >
          ♪
        </span>
      )}
    </span>
  );
}

/** Three bouncing bars: the "previewing" cue while a clip plays. */
function Eq() {
  return (
    <span aria-hidden className="eq">
      <i />
      <i />
      <i />
    </span>
  );
}

function Card({ track }: { track: Track }) {
  const preview = track.previewUrl;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const hold = useRef(0);

  // mirror the shared player: spin + ring only while OUR clip is the one on
  useEffect(() => {
    if (!preview) return;
    return subscribe((s) => {
      const mine = s.url === preview;
      setPlaying(mine && s.playing);
      setProgress(mine ? s.progress : 0);
    });
  }, [preview]);

  // leaving off-duty (unmount) silences whatever was previewing
  useEffect(() => {
    return () => {
      if (preview) stopPreview(preview);
    };
  }, [preview]);

  // hover-to-preview on a mouse: a short hold so a pointer sweeping down the
  // list doesn't fire every clip in turn
  const onEnter = (e: React.PointerEvent) => {
    if (!preview || e.pointerType !== "mouse") return;
    window.clearTimeout(hold.current);
    hold.current = window.setTimeout(() => void playPreview(preview), 220);
  };
  const onLeave = () => {
    window.clearTimeout(hold.current);
    if (preview) stopPreview(preview);
  };
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!preview) return;
    if (playing) stopPreview(preview);
    else void playPreview(preview);
  };

  const inner = (
    <>
      <Art src={track.albumArt} title={track.title} progress={progress} />
      <div className="flex min-w-0 flex-col leading-snug">
        <span className="truncate font-serif text-[16px] text-foreground">
          {track.title}
        </span>
        {track.artist && (
          <span className="truncate font-serif text-[13px] italic text-muted">
            {track.artist}
          </span>
        )}
      </div>
      {track.lang && (
        <span className="lang-chip ml-1 shrink-0 self-center" aria-label={`sung in ${LANG_LABEL[track.lang]}`}>
          {LANG_LABEL[track.lang]}
        </span>
      )}
      {playing ? (
        <span
          aria-hidden
          className="ml-auto inline-flex shrink-0 items-center gap-2 self-center font-mono text-[11px] text-neon-2"
        >
          <Eq /> previewing
        </span>
      ) : (
        track.url && (
          <span
            aria-hidden
            className="ml-auto shrink-0 self-center font-mono text-[11px] text-accent transition-transform duration-300 group-hover:translate-x-0.5"
          >
            ↗ play
          </span>
        )
      )}
    </>
  );

  const cls =
    "flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:bg-accent/[0.08]";

  return (
    <div
      className={`group relative ${playing ? "is-playing" : ""}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {track.url ? (
        <a href={track.url} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
      {preview && (
        // sits over the album art; on touch it's the only way to preview,
        // on a mouse it pauses/resumes what hovering started
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={
            playing ? `Pause preview of ${track.title}` : `Play a 30-second preview of ${track.title}`
          }
          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-foreground"
        >
          <span aria-hidden className="art-cue">
            {playing ? "❚❚" : "▶"}
          </span>
        </button>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <span className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-card-hover" />
      <div className="flex flex-col gap-1.5">
        <span className="h-3 w-32 animate-pulse rounded bg-card-hover" />
        <span className="h-2.5 w-20 animate-pulse rounded bg-card-hover" />
      </div>
    </div>
  );
}

export default function NonMainstream() {
  const entries = offDuty.nonMainstream;
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [loading, setLoading] = useState(true);
  // display order; every inserted coin deals a new one (never the same twice)
  // The shelf is a deck: only HAND cards show at once, dealt from a shuffled
  // order. A coin moves the cards on the table to the bottom of the deck and
  // deals the next hand, so repeats only come back once everything else has
  // had a turn. The section mounts client-side only, so a random initial
  // order never fights server markup.
  const [order, setOrder] = useState<number[]>(() =>
    shuffle(Array.from({ length: entries.length }, (_, i) => i)),
  );
  // language filter; "all" deals from the whole deck
  const [lang, setLang] = useState<SongLang | "all">("all");

  useEffect(() => {
    const onCoin = () => {
      setOrder((prev) => {
        // deal from the top of the deck; the cards just shown go to the
        // bottom, so nothing repeats until everything else has had a turn
        const shown = prev.slice(0, HAND);
        const deck = prev.slice(HAND);
        return [...deck, ...shuffle(shown)];
      });
    };
    window.addEventListener(OFFDUTY_COIN_EVENT, onCoin);
    return () => window.removeEventListener(OFFDUTY_COIN_EVENT, onCoin);
  }, []);

  useEffect(() => {
    let alive = true;
    // Reads the shared prefetch kicked off at page load — usually already
    // resolved by the time this shelf mounts, so cards appear instantly.
    prefetchTracks()
      .then((t) => {
        if (alive) setTracks(t);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (entries.length === 0) return null;

  // Prefer resolved API cards; fall back to text cards from the raw content
  // list so the shelf never looks broken (no creds, offline, etc.).
  const resolved = tracks && tracks.length > 0;
  const cards: Track[] = resolved
    ? tracks
    : entries.map((e) => ({ ...fallbackFromEntry(e), albumArt: null, url: null, previewUrl: null }));
  // languages actually present, in shelf order
  const langs = [...new Set(cards.map((c) => c.lang).filter((l): l is SongLang => !!l))];
  // the deck after the language filter, and the hand on the table
  const filtered = order.filter(
    (i) => i < cards.length && (lang === "all" || cards[i].lang === lang),
  );
  const inDeck = filtered.length;
  const hand = filtered.slice(0, HAND);

  return (
    <div className="mb-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] uppercase tracking-wider text-muted">
          non-mainstream songs
          <span className="normal-case tracking-normal text-muted/70">
            · in no particular order
          </span>
        </p>
        {langs.length > 1 && (
          <div
            role="group"
            aria-label="Filter songs by language"
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider"
          >
            {(["all", ...langs] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2 py-0.5 transition-colors ${
                  lang === l
                    ? "bg-accent text-accent-contrast"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {l === "all" ? "all" : LANG_LABEL[l]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {loading
          ? Array.from({ length: HAND }, (_, i) => <Skeleton key={i} />)
          : hand.map((i) => (
              <motion.div
                key={`${cards[i].title}-${i}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              >
                <Card track={cards[i]} />
              </motion.div>
            ))}
      </div>
      {!loading && inDeck > hand.length && (
        <p className="mt-3 font-mono text-[10px] tracking-wider text-muted">
          {hand.length} of {inDeck} on the table · insert a coin to deal the next hand
        </p>
      )}
    </div>
  );
}
