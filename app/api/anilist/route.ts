import { offDuty } from "@/lib/content";
import { comparisonLines, getAnimeStats, pickComparison } from "@/lib/anilist";

// Stats change slowly — cache the resolved payload for an hour.
export const revalidate = 3600;

const PLACEHOLDER = "your-username";

export async function GET() {
  const { username, showStats, comparisons, snapshot } = offDuty.anilist;
  const name = username.trim();

  if (!showStats || !name || name === PLACEHOLDER) {
    return Response.json({ enabled: false });
  }

  const data = await getAnimeStats(name);
  if (data) {
    return Response.json({
      enabled: true,
      live: true,
      stats: data.stats,
      watchingCount: data.watching.length,
      comparison: pickComparison(data.stats.minutesWatched, comparisons),
      comparisons: comparisonLines(data.stats.minutesWatched, comparisons).lines,
    });
  }

  // Live call failed (API down, rate-limited, profile private): fall back to
  // the last-known numbers from content.ts, flagged so the UI can say so.
  if (snapshot) {
    const { syncedAt, watchingCount, ...stats } = snapshot;
    return Response.json({
      enabled: true,
      live: false,
      syncedAt,
      stats,
      watchingCount,
      comparison: pickComparison(stats.minutesWatched, comparisons),
      comparisons: comparisonLines(stats.minutesWatched, comparisons).lines,
    });
  }

  return Response.json({ enabled: false });
}
