# AniList-powered "NOW / anime" upgrade for the off-duty section

## Context

The off-duty section's static `now` list currently has a `«swap me»` "watching" placeholder. This makes it live: animes watched, episode counts, total watch time, and a playful "i could've done X in this much time lol" line — all pulled from the AniList profile automatically. (MyAnimeList was the fallback option, but AniList's API is strictly better here: free GraphQL endpoint at `https://graphql.anilist.co`, **no auth needed for public profile stats**, ~90 req/min limit. MAL needs a client ID + OAuth. → Use AniList.)

Defaults chosen (all knobs live in `lib/content.ts`):
- **Scope**: lifetime stats strip + "currently watching" list with episode progress.
- **Fun line**: built-in milestone comparisons auto-picked by hours, with an optional user-override list in `content.ts`.
- **Username**: placeholder `username: "your-username"` in `content.ts` (section gracefully hides until filled in).

## Architecture (mirrors the Spotify feature)

AniList → server route handler (caches, hides origin) → client component inside `OffDuty.tsx`.

### New: `lib/anilist.ts` (server-only)
- `getAnimeStats(username)` — POST to `https://graphql.anilist.co` with:
  ```graphql
  query ($name: String) {
    User(name: $name) {
      statistics { anime { count episodesWatched minutesWatched meanScore } }
    }
    MediaListCollection(userName: $name, type: ANIME, status: CURRENT) {
      lists { entries {
        progress
        media { title { english romaji } episodes coverImage { medium } siteUrl }
      } }
    }
  }
  ```
  One request returns everything. Returns `{ stats: { count, episodesWatched, minutesWatched }, watching: [{ title, progress, episodes, cover, url }] }` or `null` on failure/private profile.
- `pickComparison(minutes, custom?)` — converts minutes → hours, filters the milestone table to entries whose `hours` threshold fits, rotates the pick by day-of-year so it changes across visits. Built-in milestones table lives here; `custom` (from content.ts) takes precedence when provided.

### New: `app/api/anilist/route.ts`
- `GET`; `export const revalidate = 3600` (stats don't need to be fresher than hourly). Returns `{ enabled: false }` when username is placeholder/empty or `showStats` is off.

### New: `components/AnimeStats.tsx` (client)
- Fetches `/api/anilist` on mount; renders inside the off-duty world (inherits warm amber tokens):
  - **Stats strip** — three mono-labeled figures in the existing card style (`border-white/[0.08] bg-white/[0.03]`, hover lift): `animes finished`, `episodes`, `time watched` (rendered as `Xd Yh`).
  - **Fun line** — serif italic beneath the strip: e.g. "that's 1,000 hours — i could've gotten a private pilot license instead lol".
  - **currently watching** — compact rows: cover thumb (via `next/image`), title, `ep 12/24` with a thin amber progress bar.
- Skeleton shimmer while loading; renders `null` if API returns `enabled: false` or errors (section never looks broken).

```
┌────────────┬────────────┬────────────┐
│ animes     │ episodes   │ time       │
│ finished   │ watched    │ watched    │
│    87      │   1,204    │  25d 4h    │
└────────────┴────────────┴────────────┘
 "that's 604 hours — i could've gotten a
  private pilot license instead lol"

 currently watching
┌──────────────────────────────────────┐
│ ▣ cover  One Piece      ep 1042/1122 │
│          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  93%       │
└──────────────────────────────────────┘
```

### Edit: `lib/content.ts`
- In `offDuty`, add:
  ```ts
  anilist: {
    username: "your-username",   // ← fill in; empty/placeholder hides the section
    showStats: true,             // toggle, same pattern as spotify.showNowPlaying
    comparisons: [] as { hours: number; line: string }[], // optional custom jokes
  },
  ```
- Remove the `{ label: "watching", ... }` entry from `now` (superseded by live data).

### Edit: `components/OffDuty.tsx`
- Render `<AnimeStats />` after the `now` block (before hobbies), matching existing section header style (`font-mono text-[11px] uppercase tracking-wider text-muted`).

### Edit: `next.config.ts`
- Add `s4.anilist.co` (AniList cover CDN) to `images.remotePatterns`.

## Built-in comparison milestones (sample)
| hours ≥ | line |
|---|---|
| 40 | could've learned to solve a rubik's cube blindfolded |
| 100 | could've gotten conversational in spanish |
| 250 | could've run 10 marathons (with training) |
| 500 | could've gotten a private pilot license |
| 1000 | could've built this website ~200 times |
| 2000 | could've walked across the US |

Picks among thresholds ≤ actual hours, rotated daily if several fit.

## No new dependencies, no API keys, no env vars.

## Verification
- `npm run dev`, unlock off-duty (↓↓): with a real username set, stats strip + watching list render; with placeholder, section hidden.
- Check progress bars & comparison line against the AniList profile page numbers.
- `npm run build` passes.
