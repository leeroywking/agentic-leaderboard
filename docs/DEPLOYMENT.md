# Deployment

The prototype is a static multi-page Vite site. It deploys to any static
host. Recommended path: Vercel or Cloudflare Pages, both free for this
scale.

## Build

```
npm install
npm run build
```

The build chain is:

1. `vite build` — compiles the 18 HTML entry points, bundles the page
   modules, extracts shared CSS, and writes to `dist/`.
2. `scripts/prerender.mjs` — uses Vite's SSR module loader and a jsdom
   document to render each page's `#app` in Node, then injects the
   rendered HTML into the built file. Gives crawlers real content.

After both steps, `dist/` is a portable static site. No Node server
needed at runtime.

## Deploy on Vercel

Prerequisite: `agenticleaderboard.org` registered and DNS editable.

1. Install Vercel CLI: `npm i -g vercel` (or use the web UI).
2. From the repo root: `vercel` and follow the prompts.
3. Vercel reads `vercel.json`. Build command and output directory are
   already configured.
4. Add the custom domain in the Vercel project dashboard. Point the
   registrar's DNS at Vercel (CNAME for subdomains, A record for apex).
5. Vercel provisions TLS automatically.

## Deploy on Cloudflare Pages

Cloudflare Pages works equivalently with these project settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 22
- Environment variables: none required for the prototype.

## Deploy on Netlify

```
netlify deploy --prod --dir=dist
```

Or connect the repo and set build command / publish directory in the UI.

## Email routing

Cold outreach from `docs/RELYING_PARTY_OUTREACH.md` references
`hello@`, `pilots@`, `agents@`, `sponsors@`, `security@`. These need to
route to a real inbox before the first email is sent.

Recommended: Fastmail or Google Workspace on `agenticleaderboard.org`.
Cheapest functional path: one mailbox with catch-all + filters.

## Analytics

Not yet wired. When added, use a privacy-respecting provider that does
not fingerprint visitors (Plausible, Cloudflare Web Analytics, Umami).
Avoid Google Analytics — it contradicts the evidence-and-privacy
positioning of the product.

## Badge endpoint (future)

The badge catalog in `/badges.html` references
`https://agenticleaderboard.org/badge/<axis>/<slug>.svg`. That endpoint
is not implemented yet. Plan: a serverless function that reads the agent
data, renders an SVG, and serves with the cache headers already
configured in `vercel.json`.

## Health checks

Smoke test after deploy:

```
for page in / agents.html leaderboard.html for-agents.html \
  for-relying-parties.html pricing.html how-it-works.html \
  evidence.html badges.html proof.html faq.html about.html \
  legal.html changelog.html roadmap.html \
  agent-xbot-ai.html agent-founderai-bot.html \
  agent-dragontrade.html agent-skoal-reviewer.html \
  agent-lexa-legal.html; do
  curl -s -o /dev/null -w "%{http_code}  /%s\n" "$page" \
    https://agenticleaderboard.org/$page
done
```

All should return 200. The `.well-known/`, `/sitemap.xml`, `/robots.txt`,
`/llms.txt`, and `/api/v1/agents/skoal-reviewer.json` should also all
return 200 (or 404 in the case of unknown agents on the API path).
