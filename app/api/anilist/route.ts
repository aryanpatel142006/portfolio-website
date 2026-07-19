import { offDuty } from "@/lib/content";
import { getAnimeStats, pickComparison } from "@/lib/anilist";

// Stats change slowly — cache the resolved payload for an hour.
export const revalidate = 3600;

const PLACEHOLDER = "your-username";

export async function GET() {
  const { username, showStats, comparisons } = offDuty.anilist;
  const name = username.trim();

  if (!showStats || !name || name === PLACEHOLDER) {
    return Response.json({ enabled: false });
  }

  const data = await getAnimeStats(name);
  if (!data) return Response.json({ enabled: false });

  const comparison = pickComparison(data.stats.minutesWatched, comparisons);
  return Response.json({
    enabled: true,
    stats: data.stats,
    watchingCount: data.watching.length,
    comparison,
  });
}
