/**
 * Client-side prefetch cache for the non-mainstream song shelf.
 *
 * The shelf lives inside the off-duty section, which only mounts once unlocked —
 * so a naive fetch-on-mount doesn't start until the user clicks in, and they
 * watch skeletons resolve. Instead we kick the fetch off at page load (from the
 * always-mounted OffDuty component) and memoize the in-flight promise here, so
 * by the time the section is revealed the cards are already in hand.
 */

export type Track = {
  title: string;
  artist: string;
  albumArt: string | null;
  url: string | null;
};

let tracksPromise: Promise<Track[]> | null = null;

/** Start (once) and return the tracks fetch. Safe to call repeatedly. */
export function prefetchTracks(): Promise<Track[]> {
  if (!tracksPromise) {
    tracksPromise = fetch("/api/spotify/tracks")
      .then((r) => (r.ok ? r.json() : { tracks: [] }))
      .then((data: { tracks?: Track[] }) => data.tracks ?? [])
      .catch(() => {
        // Let a failed attempt be retried on the next call instead of caching [].
        tracksPromise = null;
        return [];
      });
  }
  return tracksPromise;
}
