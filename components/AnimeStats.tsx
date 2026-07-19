"use client";

import { useEffect, useState } from "react";

type AnimeData = {
  enabled: boolean;
  stats?: { count: number; episodesWatched: number; minutesWatched: number };
  watchingCount?: number;
  comparison?: { hours: number; line: string } | null;
};

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
    <div className="flex flex-1 flex-col gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.08]">
      <span className="font-serif text-2xl text-foreground">{value}</span>
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
          className="flex flex-1 flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
        >
          <span className="h-6 w-16 animate-pulse rounded bg-white/[0.06]" />
          <span className="h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />
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

  const { stats, watchingCount, comparison } = data;

  return (
    <div className="mb-8">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
        anime
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
          that&rsquo;s {nf.format(comparison.hours)} hours — i {comparison.line}{" "}
          instead lol
        </p>
      )}
    </div>
  );
}
