# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js version warning

This repo runs **Next.js 16.2.10** — newer than your training data, with breaking changes to APIs, conventions, and file structure. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed deprecation notices. The same caution applies to the **Vercel AI SDK v7** (`ai` package): the chat route uses v7 streaming APIs (`toUIMessageStream`, `createUIMessageStreamResponse`) that differ from older SDK versions — follow the existing code's patterns rather than remembered ones.

## Commands

```bash
npm run dev     # dev server (Turbopack) at http://localhost:3000
npm run build   # production build
npm run lint    # eslint
```

There is no test suite. Env setup: `cp .env.example .env.local` and fill in keys (see below); the site renders fully without them — API-backed features just disable gracefully.

## Architecture

A minimalist single-page portfolio (App Router + TypeScript + Tailwind CSS v4 via PostCSS). `app/page.tsx` assembles section components; `app/layout.tsx` owns fonts (serif/sans/mono CSS variables), metadata, and always-mounted chrome (`BackgroundFrame`, `ScrollProgress`, `CommandPalette`).

**`lib/content.ts` is the single source of truth for all site data** — name, bio, badges, socials, experiences, projects, awards, and off-duty config. Components and the chatbot's system prompt all read from it; content changes go there, not into components.

### API routes (all in `app/api/`)

- **`chat/route.ts`** — the "query me" chatbot. Streams via the AI SDK with a **Vercel AI Gateway model string** (default in code, overridable with `CHAT_MODEL`). The system prompt is built at request time from `lib/content.ts`, so the bot only knows what's in that file. Needs `AI_GATEWAY_API_KEY`.
- **`spotify/tracks/route.ts`** (`revalidate: 86400`) — song cards for the off-duty shelf. `lib/spotify.ts` deliberately uses **no-auth resolvers** (Spotify's embed-page `__NEXT_DATA__` blob, iTunes Search fallback) because Spotify's Web API 403s for dev apps on free accounts — don't "fix" it by switching to the authenticated Web API. Spotify env vars only power the live now-listening widget (refresh token minted via `node assets-src/spotify-auth.mjs`).
- **`anilist/route.ts`** (`revalidate: 3600`) — anime stats from AniList's public GraphQL API, no auth. Returns `{ enabled: false }` on any failure/placeholder username so the section hides instead of breaking.

### The hidden "off-duty" section

`OffDuty` is always mounted but locked; unlock triggers (⌘K command, tapping the photo, Konami code) communicate through window CustomEvents defined in `lib/offduty.ts`. Unlock state is deliberately session-only (no persistence) — it's an easter egg. `lib/tracks-client.ts` prefetches the song cards at page load and memoizes the in-flight promise so the shelf is ready before the section is ever revealed; keep that pattern if touching the data flow.

### Remote images

`next/image` remote hosts are allow-listed in `next.config.ts` (`img.logo.dev`, `i.scdn.co`, `**.mzstatic.com`, `s4.anilist.co`). Any new external image source needs a `remotePatterns` entry there.
