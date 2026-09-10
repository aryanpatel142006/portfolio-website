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

/** How a hand is built: fixed seats per language, then one wildcard from
    whatever is left (that is the only seat Punjabi, Tamil or Urdu can take,
    so none of them ever crowds a hand). A language with too few songs for
    its seats gives the spare seats to the wildcard pool. */
const QUOTA: { lang: SongLang; n: number }[] = [
  { lang: "hi", n: 2 },
  { lang: "gu", n: 2 },
  { lang: "jp", n: 1 },
  { lang: "en", n: 1 },
];

/** Small seeded PRNG (mulberry32) so a visit's deck order is fixed for the
    session and every hand is a pure function of (cards, seed, deal). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleWith<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  const r = rng(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** `n` cards from a deck starting at deal×n, wrapping, so each language
    cycles through all of its songs before any repeat. */
function take(deck: number[], n: number, deal: number): number[] {
  if (deck.length === 0 || n <= 0) return [];
  const out: number[] = [];
  const start = (deal * n) % deck.length;
  for (let k = 0; k < Math.min(n, deck.length); k++) out.push(deck[(start + k) % deck.length]);
  return out;
}

/** Build hand number `deal`. With a language filter, seven straight from
    that language's deck; otherwise the quota, then wildcards to fill. */
function dealHand(cards: Track[], seed: number, deal: number, lang: SongLang | "all"): number[] {
  const byLang = new Map<SongLang, number[]>();
  cards.forEach((c, i) => {
    if (!c.lang) return;
    byLang.set(c.lang, [...(byLang.get(c.lang) ?? []), i]);
  });
  const deckOf = (l: SongLang) => shuffleWith(byLang.get(l) ?? [], seed + l.charCodeAt(0) * 7919 + l.charCodeAt(1));

  if (lang !== "all") return take(deckOf(lang), HAND, deal);

  const hand: number[] = [];
  for (const q of QUOTA) hand.push(...take(deckOf(q.lang), q.n, deal));
  // wildcard seats: everything not already on the table, in a fixed shuffled
  // order, advancing one per deal so the wildcard also cycles
  const rest = shuffleWith(cards.map((_, i) => i), seed + 104729).filter((i) => !hand.includes(i));
  const need = HAND - hand.length;
  for (let k = 0; k < need && rest.length > 0; k++) hand.push(rest[(deal + k) % rest.length]);
  // present the hand in a mixed order rather than grouped by language
  return shuffleWith(hand, seed + deal * 31);
}

const LANG_LABEL: Record<SongLang, string> = {
  en: "english",
  hi: "hindi",
  gu: "gujarati",
  pa: "punjabi",
  ta: "tamil",
  ur: "urdu",
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
  // Only HAND cards show at once. The seed fixes this session's deck order;
  // each coin advances `deal`, and the hand is computed from the two (see
  // dealHand). The section mounts client-side only, so the random seed never
  // fights server markup.
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31));
  const [deal, setDeal] = useState(0);
  // language filter; "all" uses the quota deal
  const [lang, setLang] = useState<SongLang | "all">("all");

  useEffect(() => {
    const onCoin = () => setDeal((d) => d + 1);
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
  // the hand on the table, and how many songs the current view could deal from
  const hand = dealHand(cards, seed, deal, lang);
  const inDeck = lang === "all" ? cards.length : cards.filter((c) => c.lang === lang).length;

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
          insert a coin to deal the next hand
        </p>
      )}
    </div>
  );
}
