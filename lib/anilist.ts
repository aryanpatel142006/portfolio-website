/**
 * AniList helper — server-only (imported exclusively by the route handler at
 * app/api/anilist). No auth, no API key: AniList's public GraphQL endpoint
 * exposes profile stats + lists for any public username.
 *
 * One request returns lifetime stats and the currently-watching list. A private
 * or missing profile (or any failure) resolves to null, so the section hides
 * gracefully instead of looking broken.
 */

const ENDPOINT = "https://graphql.anilist.co";

export type AnimeStats = {
  stats: { count: number; episodesWatched: number; minutesWatched: number };
  watching: {
    title: string;
    progress: number;
    episodes: number | null;
    cover: string | null;
    url: string | null;
  }[];
};

const QUERY = `
query ($name: String) {
  User(name: $name) {
    statistics { anime { count episodesWatched minutesWatched } }
  }
  MediaListCollection(userName: $name, type: ANIME, status: CURRENT) {
    lists { entries {
      progress
      media { title { english romaji } episodes coverImage { medium } siteUrl }
    } }
  }
}`;

type RawEntry = {
  progress?: number;
  media?: {
    title?: { english?: string | null; romaji?: string | null };
    episodes?: number | null;
    coverImage?: { medium?: string | null };
    siteUrl?: string | null;
  };
};

type RawResponse = {
  data?: {
    User?: {
      statistics?: {
        anime?: { count?: number; episodesWatched?: number; minutesWatched?: number };
      } | null;
    } | null;
    MediaListCollection?: { lists?: { entries?: RawEntry[] }[] } | null;
  };
};

/** Fetch lifetime anime stats + currently-watching list for a public profile. */
export async function getAnimeStats(username: string): Promise<AnimeStats | null> {
  const name = username.trim();
  if (!name) return null;

  let json: RawResponse | null = null;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { name } }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    json = (await res.json()) as RawResponse;
  } catch {
    return null;
  }

  const anime = json?.data?.User?.statistics?.anime;
  if (!anime) return null;

  const entries = (json?.data?.MediaListCollection?.lists ?? []).flatMap(
    (l) => l.entries ?? [],
  );
  const watching = entries
    .map((e) => {
      const media = e.media;
      const title = media?.title?.english || media?.title?.romaji || "";
      if (!title) return null;
      return {
        title,
        progress: e.progress ?? 0,
        episodes: media?.episodes ?? null,
        cover: media?.coverImage?.medium ?? null,
        url: media?.siteUrl ?? null,
      };
    })
    .filter((w): w is NonNullable<typeof w> => w !== null)
    // Most-progressed first, so the shelf leads with what they're deepest into.
    .sort((a, b) => b.progress - a.progress);

  return {
    stats: {
      count: anime.count ?? 0,
      episodesWatched: anime.episodesWatched ?? 0,
      minutesWatched: anime.minutesWatched ?? 0,
    },
    watching,
  };
}

// ── "i could've done X" comparison line ──────────────────────────────────────

type Comparison = { hours: number; line: string };

// Ordered by threshold. pickComparison filters to entries whose hours ≤ actual.
const MILESTONES: Comparison[] = [
  { hours: 40, line: "could've learned to solve a rubik's cube blindfolded" },
  { hours: 100, line: "could've gotten conversational in spanish" },
  { hours: 250, line: "could've run 10 marathons (with training)" },
  { hours: 500, line: "could've gotten a private pilot license" },
  { hours: 1000, line: "could've built this website ~200 times" },
  { hours: 2000, line: "could've walked across the US" },
];

/**
 * Build the playful "that's N hours — i could've X instead lol" line. Picks
 * among milestones whose threshold fits the hours watched, rotating the choice
 * by day-of-year so it varies across visits. A custom list (from content.ts)
 * takes precedence over the built-in table.
 */
export function pickComparison(
  minutes: number,
  custom?: Comparison[],
): { hours: number; line: string } | null {
  const hours = Math.round(minutes / 60);
  if (hours <= 0) return null;

  const table = custom && custom.length > 0 ? custom : MILESTONES;
  const eligible = table
    .filter((m) => hours >= m.hours)
    .sort((a, b) => a.hours - b.hours);
  if (eligible.length === 0) return null;

  // Rotate daily among the eligible milestones.
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const pick = eligible[dayOfYear % eligible.length];

  return { hours, line: pick.line };
}
