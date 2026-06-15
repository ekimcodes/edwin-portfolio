# Edwin Kim — Portfolio

Minimalist monospace personal portfolio. Each visitor is assigned a persistent
random `Adjective Animal` identity, their (city-level) location is stored, a live
visitor count is shown, and every visitor appears in a public visitor log.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Upstash Redis** (`@upstash/redis`) for visitor identities, presence, and the log
- **JetBrains Mono** typeface
- Deployed on **Vercel** (uses Vercel's geo headers for location)

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in real Upstash values
npm run dev                  # http://localhost:3000
```

Geolocation only resolves on Vercel (via `x-vercel-ip-*` headers); locally it
shows `localhost`.

## Environment variables

| Var | Source |
|-----|--------|
| `UPSTASH_REDIS_REST_URL`   | Upstash console / Vercel integration |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash console / Vercel integration |

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
npm test        # vitest unit tests
```

## Customizing content

Edit `src/components/Portfolio.tsx`:

- **currently** — `Emanate · Founding Engineer` (links to app.emanate.ai)
- **projects** — replace the two placeholder rows with real projects
- **previously** — `Google · CALI · MyFitnessPal · UC Berkeley`
- **footer links** — replace the three `href="#"` placeholders with your real
  github / email (`mailto:`) / linkedin URLs

Word lists for visitor names live in `src/lib/names.ts`.

## How visitor identity works

1. On load, the client calls `GET /api/visitor`.
2. If a `visitor_id` cookie exists and maps to a Redis record, the same identity
   is returned (returning visitors keep their name).
3. Otherwise a new `nanoid` + random `{adjective, animal}` is generated, geo is
   read from Vercel headers, the record is persisted, the cookie is set, and the
   visitor is added to `visitors:log`.
4. `POST /api/presence` heartbeats every 15s; the live count is everyone active
   in the last 30s.

## Data model (Redis)

| Key | Type | Purpose |
|-----|------|---------|
| `visitor:<id>` | Hash | visitor record |
| `visitors:log` | Sorted Set | log, scored by first-seen ms |
| `presence` | Sorted Set | live presence, scored by last heartbeat ms |
