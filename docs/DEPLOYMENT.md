# Deployment

Multi-page Vite static frontend + Vercel serverless functions under `/api`.

## Build locally

```
npm install
npm run build
```

The build chain runs:

1. `npm run generate:badges` — writes per-agent SVG badges to `public/badge/`.
2. `vite build` — compiles 24 HTML entry points and page bundles to `dist/`.
3. `scripts/prerender.mjs` — uses Vite SSR + jsdom to render each page's
   `#app` content in Node and inject it into the built HTML so crawlers see
   the real content.

After the three steps `dist/` is a portable static site and `api/` is a
portable serverless surface — both deployable to Vercel in one command.

## Deploy on Vercel

Prerequisite: `agenticleaderboard.org` registered (or any domain) and a
Vercel account connected to the GitHub repo.

```
vercel          # first time, links the project
vercel --prod   # deploy to production
```

Vercel reads `vercel.json` for build command, output directory, and
security headers. The `/api/*.mjs` files auto-register as serverless
functions — no config needed.

Add the custom domain in the project dashboard, let Vercel provision TLS,
and point the registrar's DNS at Vercel (CNAME for subdomains, A record
for apex).

## Configure providers

The backend degrades gracefully if any provider is missing. You can bring
them up one at a time and each added env var enables the next surface.

### Stripe

1. Create a Stripe account. Switch to test mode first.
2. Create four Products/Prices:
   - Verified agent — $149 / year recurring
   - Certified agent — $499 one-time (first year)
   - Pilot partner — $299 / month recurring
   - Standard — $999 / month recurring
3. Copy the `price_...` id for each into the env vars.
4. Add the webhook endpoint:
   `https://<your-domain>/api/stripe-webhook`
   Subscribe to `checkout.session.completed` (and later, subscription
   events once you need renewal logic).
5. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

Once `STRIPE_SECRET_KEY` + the four price ids are set, both the agent
submission form and the pilot/standard signup form route through Stripe
Checkout.

### Resend (email)

1. Create a Resend account. Verify the sending domain (SPF + DKIM).
2. Issue an API key scoped to sending from that domain.
3. Set `RESEND_API_KEY` and `RESEND_FROM`.
4. Confirmation emails and admin review notifications start flowing
   immediately.

Without Resend configured, emails are logged to the serverless function
console. The flows still work; the human just has to check console logs
until the API key is added.

### Upstash Redis (persistence)

1. Install the Upstash Redis integration from the Vercel Marketplace
   (free tier: 10K requests/day).
2. Link it to the project — Vercel injects `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` automatically.

Without Upstash, storage falls back to an in-memory Map per serverless
invocation. That is not durable: submissions written during one request
are gone by the next. Wire up Upstash before taking real customers.

### Admin token

Generate a long random string (e.g. `openssl rand -hex 32`) and set
`ADMIN_TOKEN`. The `/admin.html` page prompts for this token and uses
it to authenticate `/api/admin/*` calls.

### GitHub review queue (optional)

If you want every subject submission to produce a GitHub issue in a
private review repo:

1. Create a private repo, e.g. `agentic-leaderboard-review`.
2. Create a fine-grained PAT with `Issues: Read and write` on that repo.
3. Set `GITHUB_TOKEN` and `GITHUB_REVIEW_REPO=owner/repo`.

Without this, submissions still land in Upstash and are visible on
`/admin.html`; the GitHub mirror is purely for human-reviewable
auditability.

## Env var checklist

See `.env.example` for the complete list.

| Provider | Vars | Effect if missing |
|---|---|---|
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | Submission forms return `stripe_configured: false`, reviewer follows up by email |
| Resend | `RESEND_API_KEY`, `RESEND_FROM` | Emails logged to serverless console |
| Upstash | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | In-memory ephemeral storage |
| GitHub | `GITHUB_TOKEN`, `GITHUB_REVIEW_REPO` | No review issue created |
| Admin | `ADMIN_TOKEN` | `/admin.html` and `/api/admin/*` return 401 |

## Go-live checklist

Pre-launch:

- [ ] Domain registered and DNS pointed at Vercel.
- [ ] Vercel project deployed; `vercel.json` headers present.
- [ ] Stripe in test mode: create Products, capture price ids, test
      checkout end-to-end with `4242 4242 4242 4242`.
- [ ] Stripe webhook pointed at `/api/stripe-webhook`, signing secret
      set, test a payment and confirm submission transitions to
      `under_review` / `provisioning`.
- [ ] Resend domain verified; send a test email from the dashboard.
- [ ] Upstash provisioned; write a key via `/api/sandbox-key`, see it
      persist across two deploys.
- [ ] `ADMIN_TOKEN` set; `/admin.html` loads the queue.
- [ ] `mailto:` links on `/about.html`, `/legal.html`, and email
      templates resolve to mailboxes that actually receive mail.

Flip to live:

- [ ] Swap Stripe to live keys and live price ids.
- [ ] Swap Stripe webhook to the production endpoint (separate signing
      secret).
- [ ] Announce pricing in `changelog.html`.
- [ ] Send the first email in `docs/RELYING_PARTY_OUTREACH.md`.

## Health checks

```
for page in / agents.html leaderboard.html for-agents.html \
  for-relying-parties.html pricing.html how-it-works.html \
  evidence.html badges.html proof.html faq.html about.html \
  legal.html changelog.html roadmap.html try.html \
  submit-success.html submit-cancel.html admin.html \
  agent-xbot-ai.html agent-founderai-bot.html \
  agent-dragontrade.html agent-skoal-reviewer.html \
  agent-lexa-legal.html; do
  code=$(curl -s -o /dev/null -w "%{http_code}" https://agenticleaderboard.org/$page)
  echo "$code  /$page"
done
```

API smoke test:

```
curl -X POST https://agenticleaderboard.org/api/sandbox-key \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","company":"test"}'
# -> { "status": "issued", "tier": "sandbox", "api_key_preview": "alb_sbx_..." }

curl https://agenticleaderboard.org/api/v1/agents/skoal-reviewer \
  -H 'Authorization: Bearer alb_sbx_...'
# -> { "slug": "skoal-reviewer", "composite": { ... }, "axes": { ... } }
```
