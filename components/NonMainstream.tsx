"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

function Art({ src, title }: { src: string | null; title: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 shrink-0 rounded-md object-cover"
        unoptimized
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-accent/[0.06] text-accent"
      title={title}
    >
      ♪
    </span>
  );
}

function Card({ track }: { track: Track }) {
  const inner = (
    <>
      <Art src={track.albumArt} title={track.title} />
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
      {track.url && (
        <span
          aria-hidden
          className="ml-auto shrink-0 self-center font-mono text-[11px] text-accent transition-transform duration-300 group-hover:translate-x-0.5"
        >
          ↗ play
        </span>
      )}
    </>
  );

  const cls =
    "group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.08]";

  if (track.url) {
    return (
      <a href={track.url} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
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
    : entries.map((e) => ({ ...fallbackFromEntry(e), albumArt: null, url: null }));

  return (
    <div className="mb-8">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
        non-mainstream songs
      </p>
      <div className="flex flex-col gap-2">
        {loading
          ? entries.map((_, i) => <Skeleton key={i} />)
          : cards.map((t, i) => <Card key={`${t.title}-${i}`} track={t} />)}
      </div>
    </div>
  );
}
