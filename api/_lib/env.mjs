// Env-var contract for the backend. Each configured() check lets the
// endpoint gracefully degrade when a provider isn't wired up yet, so the
// prototype is deployable with partial configuration.

export const env = {
  siteUrl: process.env.PUBLIC_SITE_URL || 'https://agenticleaderboard.org',
  adminToken: process.env.ADMIN_TOKEN || null,

  stripe: {
    secret: process.env.STRIPE_SECRET_KEY || null,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || null,
    priceVerified: process.env.STRIPE_PRICE_VERIFIED || null,
    priceCertified: process.env.STRIPE_PRICE_CERTIFIED || null,
    pricePilot: process.env.STRIPE_PRICE_PILOT || null,
    priceStandard: process.env.STRIPE_PRICE_STANDARD || null,
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY || null,
    from: process.env.RESEND_FROM || 'Agentic Leaderboard <hello@agenticleaderboard.org>',
    reviewInbox: process.env.RESEND_REVIEW_INBOX || 'hello@agenticleaderboard.org',
  },

  upstash: {
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || null,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || null,
  },

  github: {
    token: process.env.GITHUB_TOKEN || null,
    reviewRepo: process.env.GITHUB_REVIEW_REPO || null,
  },
};

export const features = {
  stripe: Boolean(env.stripe.secret),
  email: Boolean(env.resend.apiKey),
  persistence: Boolean(env.upstash.url && env.upstash.token),
  github: Boolean(env.github.token && env.github.reviewRepo),
  admin: Boolean(env.adminToken),
};

export function requireStripePrice(tier) {
  const key = {
    verified: 'priceVerified',
    certified: 'priceCertified',
    pilot: 'pricePilot',
    standard: 'priceStandard',
  }[tier];
  const value = key ? env.stripe[key] : null;
  if (!value) throw new Error(`Missing Stripe price id for tier: ${tier}`);
  return value;
}
