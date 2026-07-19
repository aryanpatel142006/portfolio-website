# Replace "in rotation" with Spotify-powered "Non-Mainstream Songs" + "Now Listening"

## What changes

1. **Remove** the `in rotation` media block (anime/album/game) from the off-duty section.
2. **Add "non-mainstream songs"** — custom song cards (album art, title, artist, ↗ play link) rendered from a simple list in `lib/content.ts` where you paste Spotify links **or** plain `"song — artist"` names.
3. **Add "now listening"** — a live currently-playing widget (animated equalizer, album art) with a boolean toggle in `lib/content.ts`. When nothing is playing it falls back to your **last played** track.

## Spotify auth (two flows, both server-side only)

- **Track metadata** (song cards): Client Credentials flow — just `SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET` in `.env.local`.
- **Currently playing / recently played**: requires a user-scoped **refresh token** (`user-read-currently-playing`, `user-read-recently-played`). A tiny one-time helper script (`assets-src/spotify-auth.mjs`) authorizes your account and prints `SPOTIFY_REFRESH_TOKEN` for `.env.local`.
- Secrets never reach the client; the browser only talks to our own API routes.

## Files

### New: `lib/spotify.ts`
- Token management: client-credentials grant + refresh-token grant (cached in module scope until expiry).
- `parseTrackId(input)` — extracts track ID from any Spotify URL/URI, else returns null (→ treat as search query).
- `getTracks(list)` — resolves the content list via `/v1/tracks` (IDs batched) + `/v1/search` (names) → `{ title, artist, albumArt, url }[]`.
- `getNowPlaying()` — `/v1/me/player/currently-playing`, falls back to `/v1/me/player/recently-played?limit=1` → `{ isPlaying, title, artist, albumArt, url }`.

### New: `app/api/spotify/tracks/route.ts`
- `GET` returns resolved song-card data for the content list. `export const revalidate = 86400` (song metadata rarely changes). Returns `[]` gracefully if env vars are missing.

### New: `app/api/spotify/now-playing/route.ts`
- `GET`, fully dynamic (no caching). Returns now-playing or last-played payload; `{ enabled: false }` if the content toggle is off or env vars missing (widget renders nothing).

### New: `components/NonMainstream.tsx` (client)
- Fetches `/api/spotify/tracks` on mount; renders the card list: album art thumb, title, artist, ↗ opens the track on Spotify. Warm amber hover (`hover:border-accent/40`, `-translate-y-0.5`) matching existing off-duty cards. Skeleton shimmer while loading; if the API returns nothing, falls back to plain text cards from the content list (site never looks broken).

```
┌──────────────────────────────────────┐
│ ▣ album   Song Title                 │
│   art     Artist Name        ↗ play  │
└──────────────────────────────────────┘
```

### New: `components/NowPlaying.tsx` (client)
- Polls `/api/spotify/now-playing` every ~30s. Shows: album art, animated 3-bar equalizer (CSS keyframes, respects `prefers-reduced-motion`), `now playing` vs `last played` label, track + artist linking to Spotify. Renders `null` when disabled.

### Edit: `lib/content.ts`
- Delete `MediaItem` type + `media` array.
- Add:
  ```ts
  export type SongEntry = string;
  // in offDuty:
  nonMainstream: [
    "https://open.spotify.com/track/…",       // paste links
    "Song Name — Artist",                      // or just names
  ] as SongEntry[],
  spotify: { showNowPlaying: true },           // ← the toggle
  ```

### Edit: `components/OffDuty.tsx`
- Remove the `in rotation` block + `kindGlyph` map.
- Add `<NowPlaying />` (top of the unlocked section, near the heading) and `<NonMainstream />` (where "in rotation" was, header: `non-mainstream songs`).

### Edit: `next.config.ts`
- Add `i.scdn.co` (Spotify album art CDN) to `images.remotePatterns`.

### New: `.env.local` entries (documented in a comment block in `lib/content.ts` next to the toggle)
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`.

## Notes
- Next 16: route handlers follow the bundled docs conventions (verified `route.md` — plain `GET` exports, `revalidate` segment config still valid).
- Everything degrades gracefully: no env vars → song names render as text cards, now-playing widget hides. Toggle off → widget hidden regardless.

## Verification
- `npm run dev`, unlock off-duty (↓↓), confirm cards + widget render; toggle `showNowPlaying: false` and confirm widget disappears; `npm run build` passes.
