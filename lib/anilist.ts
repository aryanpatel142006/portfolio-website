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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // identify ourselves — AniList filters anonymous server clients
        "User-Agent": "aryan.is-a.dev portfolio (+https://aryan.is-a.dev)",
      },
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
  // tens of hours
  { hours: 20, line: "could've watched every star wars film, twice" },
  { hours: 24, line: "could've learned the entire periodic table, symbols and all" },
  { hours: 30, line: "could've read the whole harry potter series aloud" },
  { hours: 40, line: "could've learned to solve a rubik's cube blindfolded" },
  { hours: 40, line: "could've gotten a food handler's license and a forklift license" },
  { hours: 50, line: "could've learned to juggle five balls" },
  { hours: 60, line: "could've flown from new jersey to tokyo and back, three times" },
  { hours: 70, line: "could've sat through every lord of the rings extended cut, six times" },
  { hours: 80, line: "could've read war and peace, twice, slowly" },
  // hundreds
  { hours: 100, line: "could've gotten conversational in spanish" },
  { hours: 100, line: "could've learned every capital city on earth" },
  { hours: 120, line: "could've become a certified scuba diver, with the advanced course" },
  { hours: 150, line: "could've knitted a sweater for everyone in my group chat" },
  { hours: 160, line: "could've worked a full month at a real job. oh wait" },
  { hours: 200, line: "could've gotten a motorcycle license and ridden to florida" },
  { hours: 200, line: "could've learned to play every song on abbey road on guitar" },
  { hours: 250, line: "could've run 10 marathons (with training)" },
  { hours: 250, line: "could've read the entire wikipedia article on anime. it's long" },
  { hours: 300, line: "could've hiked the appalachian trail. the whole thing" },
  { hours: 300, line: "could've memorized pi to a thousand digits and had time left over" },
  { hours: 350, line: "could've learned enough japanese to skip the subtitles" },
  { hours: 400, line: "could've gotten an amateur radio license and called the iss" },
  { hours: 400, line: "could've baked ten thousand cookies. i checked the math" },
  { hours: 450, line: "could've watched the sun rise every day for over a year" },
  { hours: 500, line: "could've gotten a private pilot license" },
  { hours: 500, line: "could've learned to draw well enough to make my own anime" },
  { hours: 550, line: "could've done a full semester of college classes, twice" },
  { hours: 600, line: "could've learned to sail and crossed the atlantic" },
  { hours: 600, line: "could've trained for and finished an ironman" },
  { hours: 700, line: "could've built a cabin from scratch. a small one" },
  { hours: 750, line: "could've become fluent in gujarati folk lyrics. all of them" },
  { hours: 800, line: "could've watched every mcu movie fifteen times, which nobody should" },
  { hours: 800, line: "could've learned to speak python fluently. oh wait, i did" },
  { hours: 900, line: "could've driven from new jersey to california twelve times" },
  { hours: 1000, line: "could've built this website ~200 times" },
  { hours: 1000, line: "could've earned a black belt in judo" },
  { hours: 1000, line: "could've learned to play the piano properly, not just the intro" },
  { hours: 1100, line: "could've written three novels and regretted all of them" },
  { hours: 1200, line: "could've listened to every song ever released in a year. roughly" },
  { hours: 1200, line: "could've become a certified sommelier and still not liked wine" },
  { hours: 1300, line: "could've restored a vintage car with no prior experience" },
  // thousands
  { hours: 1500, line: "could've gotten a commercial pilot license and flown myself to japan" },
  { hours: 1500, line: "could've learned mandarin to a working level" },
  { hours: 1800, line: "could've completed an entire coding bootcamp, twice" },
  { hours: 2000, line: "could've walked across the US" },
  { hours: 2000, line: "could've trained for the olympics. results not guaranteed" },
  { hours: 2500, line: "could've earned a master's degree. a real one" },
  { hours: 3000, line: "could've become a licensed electrician" },
  { hours: 4000, line: "could've done the 10,000-hour rule, almost halfway" },
  { hours: 5000, line: "could've circumnavigated the globe on foot, if oceans allowed" },
];

/** Every milestone line the hours qualify for, shortest first. The client
    deals a new one each time a coin drops. */
export function comparisonLines(
  minutes: number,
  custom?: Comparison[],
): { hours: number; lines: string[] } {
  const hours = Math.round(minutes / 60);
  const table = custom && custom.length > 0 ? custom : MILESTONES;
  const lines = table
    .filter((m) => hours >= m.hours)
    .sort((a, b) => a.hours - b.hours)
    .map((m) => m.line);
  return { hours, lines };
}

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
