"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { playPreview, stopPreview, subscribe } from "@/lib/preview-player";
import { offDuty } from "@/lib/content";
import { prefetchTracks, type Track } from "@/lib/tracks-client";

// Derive a readable "Title / Artist" from a raw content entry, used as the
// graceful fallback when the Spotify API can't resolve (or isn't configured).
function fallbackFromEntry(entry: string): { title: string; artist: string } {
  const s = entry.trim();
  if (/open\.spotify\.com|spotify:track:/.test(s)) {
    return { title: "spotify track", artist: "" };
  }
  const parts = s.split(/\s+[—–-]\s+/);
  if (parts.length >= 2) {
    return { title: parts[0].trim(), artist: parts.slice(1).join(" — ").trim() };
  }
  return { title: s, artist: "" };
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

  return (
    <div className="mb-8">
      <p className="mb-3 flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        non-mainstream songs
        <span className="normal-case tracking-normal text-muted/70">
          · in no particular order
        </span>
      </p>
      <div className="flex flex-col gap-2">
        {loading
          ? entries.map((_, i) => <Skeleton key={i} />)
          : cards.map((t, i) => <Card key={`${t.title}-${i}`} track={t} />)}
      </div>
    </div>
  );
}
