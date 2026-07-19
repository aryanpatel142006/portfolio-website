/**
 * Music helpers — server-only (imported exclusively by the route handler at
 * app/api/spotify/tracks). No secrets, no auth.
 *
 * Song cards (getTracks) are resolved through no-auth sources — Spotify's own
 * embed page + iTunes Search — because Spotify's Web API 403s for dev apps owned
 * by free (non-Premium) accounts, even on public endpoints. No token needed.
 */

export type Track = {
  title: string;
  artist: string;
  albumArt: string | null;
  url: string | null;
};

// ── parsing ────────────────────────────────────────────────────────────────

/** Extract a track ID from any Spotify URL/URI. Returns null → treat as search. */
export function parseTrackId(input: string): string | null {
  const s = input.trim();
  // spotify:track:ID
  const uri = s.match(/^spotify:track:([A-Za-z0-9]+)$/);
  if (uri) return uri[1];
  // https://open.spotify.com/track/ID?...  (also intl-xx/track/ID)
  const url = s.match(/open\.spotify\.com\/(?:[a-z-]+\/)?track\/([A-Za-z0-9]+)/);
  if (url) return url[1];
  return null;
}

// ── public data (no-auth resolvers) ──────────────────────────────────────────
//
// Spotify's Web API 403s for dev apps owned by free (non-Premium) accounts —
// even on public /v1/tracks. So song cards are resolved without auth instead:
// Spotify's own embed page (open.spotify.com/embed/track/ID) ships full track
// metadata — title, artists, album art — in an inline __NEXT_DATA__ blob, with
// no token and no rate limit. Plain "Song — Artist" names fall back to the
// iTunes Search API. Both keep a Spotify link so cards deep-link to Spotify.

const ITUNES = "https://itunes.apple.com/search";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type EmbedArtist = { name?: string };
type EmbedImage = { url?: string; maxWidth?: number };
type EmbedEntity = {
  title?: string;
  subtitle?: string;
  artists?: EmbedArtist[];
  visualIdentity?: { image?: EmbedImage[] };
};

/** Pick the largest album-art URL from the embed's image set. */
function bestImage(images: EmbedImage[] | undefined): string | null {
  if (!images?.length) return null;
  const withUrl = images.filter((i) => i.url);
  if (!withUrl.length) return null;
  return withUrl.reduce((a, b) => ((b.maxWidth ?? 0) > (a.maxWidth ?? 0) ? b : a)).url ?? null;
}

/** Resolve a Spotify track URL/URI to a card via its embed page (no auth). */
async function resolveByUrl(input: string): Promise<Track | null> {
  const id = parseTrackId(input);
  if (!id) return null;
  const spotifyUrl = `https://open.spotify.com/track/${id}`;

  let html: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://open.spotify.com/embed/track/${id}`, {
      cache: "no-store",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (res.ok) {
      html = await res.text();
      break;
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(400 * 2 ** attempt);
      continue;
    }
    return null;
  }
  if (!html) return null;

  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) return null;

  let entity: EmbedEntity | undefined;
  try {
    const data = JSON.parse(match[1]);
    entity = data?.props?.pageProps?.state?.data?.entity as EmbedEntity | undefined;
  } catch {
    return null;
  }
  if (!entity?.title) return null;

  const artist =
    (entity.artists ?? []).map((a) => a.name).filter(Boolean).join(", ") ||
    entity.subtitle ||
    "";
  return {
    title: entity.title,
    artist,
    albumArt: bestImage(entity.visualIdentity?.image),
    url: spotifyUrl,
  };
}

type ITunesResult = {
  trackName?: string;
  artistName?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
};

/** Resolve a plain "Song — Artist" name to a card via the iTunes Search API. */
async function resolveByName(query: string): Promise<Track | null> {
  // Normalize a "Song — Artist" style string into a flat search term.
  const term = query.replace(/\s+[—–-]\s+/g, " ").trim();
  const res = await fetch(
    `${ITUNES}?term=${encodeURIComponent(term)}&entity=song&limit=1`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { results?: ITunesResult[] };
  const r = json.results?.[0];
  if (!r?.trackName) return null;
  return {
    title: r.trackName,
    artist: r.artistName ?? "",
    // Bump the 100px thumbnail up to a crisp 300px cover.
    albumArt: r.artworkUrl100?.replace(/100x100bb\.jpg$/, "300x300bb.jpg") ?? null,
    url: r.trackViewUrl ?? null,
  };
}

/**
 * Resolve the content list into rich track cards, preserving list order.
 * Spotify links go through the embed page; plain names through iTunes Search.
 * Entries that can't be resolved are dropped (the caller falls back to a text
 * card). URL entries are resolved in small batches with a short gap to stay
 * polite; order is preserved by resolving against the original indices.
 */
export async function getTracks(list: string[]): Promise<Track[]> {
  const results = new Array<Track | null>(list.length).fill(null);
  const BATCH = 4;

  for (let i = 0; i < list.length; i += BATCH) {
    const slice = list.slice(i, i + BATCH);
    const resolved = await Promise.all(
      slice.map((entry) =>
        parseTrackId(entry) ? resolveByUrl(entry) : resolveByName(entry),
      ),
    );
    resolved.forEach((t, j) => (results[i + j] = t));
    if (i + BATCH < list.length) await sleep(300);
  }

  return results.filter((t): t is Track => t !== null);
}
