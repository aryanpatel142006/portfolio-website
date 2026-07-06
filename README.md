# Personal Portfolio

A minimalist single-page portfolio built with **Next.js (App Router) + TypeScript + Tailwind CSS**, featuring a real AI "query me" chatbot powered by the **Vercel AI Gateway**.

## Edit your content

**Everything on the site is driven by one file:** [`lib/content.ts`](./lib/content.ts).
Open it and replace the placeholder values — name, tagline, status badges, socials, awards,
experiences, projects, and the `bio` paragraph the chatbot answers from. Drop images in
`/public` and reference them by path (e.g. `photo: "/pfp.jpg"`).

## Run locally

```bash
npm install
cp .env.example .env.local   # then paste your AI_GATEWAY_API_KEY
npm run dev                  # http://localhost:3000
```

The chatbot needs `AI_GATEWAY_API_KEY` (from https://vercel.com/ai-gateway). The rest of the
site renders without it. Change the model with `CHAT_MODEL` (any Gateway model string).

## Deploy to Vercel

```bash
npm i -g vercel
vercel                       # link + preview deploy
vercel env add AI_GATEWAY_API_KEY   # add the key to the project
vercel --prod                # production deploy
```

## Structure

- `app/layout.tsx` — fonts (serif / sans / mono), metadata, background
- `app/page.tsx` — assembles the sections
- `app/api/chat/route.ts` — AI streaming endpoint (grounded in `lib/content.ts`)
- `components/` — Hero, AwardsMarquee, QueryMe, Experiences, Projects, Footer, icons
- `lib/content.ts` — **your data**
