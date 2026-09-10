"use client";

import { useEffect, useState } from "react";
import CountUp from "./fx/CountUp";

type AnimeData = {
  enabled: boolean;
  live?: boolean; // false → served from the content.ts snapshot
  syncedAt?: string; // ISO date of that snapshot
  stats?: { count: number; episodesWatched: number; minutesWatched: number };
  watchingCount?: number;
  comparison?: { hours: number; line: string } | null;
};

// "2026-09-09" → "Sep 2026" (month-level is honest enough for a fallback)
function formatSynced(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Minutes → a compact "Xd Yh" (days + hours), dropping a zero leading unit.
function formatWatchTime(minutes: number): string {
  const totalHours = Math.floor(minutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days === 0) return `${hours}h`;
  return `${days}d ${hours}h`;
}

const nf = new Intl.NumberFormat("en-US");

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="arcade-card flex flex-1 flex-col gap-2 rounded-lg border border-border px-4 py-3 transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_0_36px_-12px_var(--accent)]">
      <CountUp
        value={value}
        className="font-arcade text-[17px] leading-tight text-neon-3 sm:text-[19px]"
      />
      <span className="font-mono text-[10px] uppercase leading-tight tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

function StripSkeleton() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3"
        >
          <span className="h-6 w-16 animate-pulse rounded bg-card-hover" />
          <span className="h-2.5 w-20 animate-pulse rounded bg-card-hover" />
        </div>
      ))}
    </div>
  );
}

export default function AnimeStats() {
  const [data, setData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/anilist")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d: AnimeData) => {
        if (alive) setData(d);
      })
      .catch(() => {
        if (alive) setData({ enabled: false });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
          anime
        </p>
        <StripSkeleton />
      </div>
    );
  }

  // Hide entirely when disabled, private, or errored — never look broken.
  if (!data?.enabled || !data.stats) return null;

  const { stats, watchingCount, comparison, live, syncedAt } = data;

  return (
    <div className="mb-8">
      <p className="mb-3 flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        anime
        {live === false && syncedAt && (
          <span className="normal-case tracking-normal text-muted/70">
            · last synced {formatSynced(syncedAt)}
          </span>
        )}
      </p>

      <div className="flex flex-wrap gap-2">
        <Figure label="animes finished" value={nf.format(stats.count)} />
        <Figure label="episodes watched" value={nf.format(stats.episodesWatched)} />
        <Figure label="time watched" value={formatWatchTime(stats.minutesWatched)} />
        {watchingCount != null && watchingCount > 0 && (
          <Figure label="currently watching" value={nf.format(watchingCount)} />
        )}
      </div>

      {comparison && (
        <p className="mt-3 max-w-md font-serif text-[15px] italic leading-relaxed text-muted-strong">
          that&rsquo;s {nf.format(comparison.hours)} hours. i {comparison.line}{" "}
          instead lol
        </p>
      )}
    </div>
  );
}
