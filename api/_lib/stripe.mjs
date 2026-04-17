import Stripe from 'stripe';
import { env, features, requireStripePrice } from './env.mjs';

let client = null;
function stripe() {
  if (!features.stripe) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  if (!client) {
    client = new Stripe(env.stripe.secret, {
      apiVersion: '2024-06-20',
    });
  }
  return client;
}

const tierMeta = {
  verified: { mode: 'subscription', amountLabel: '$149/year' },
  certified: { mode: 'payment', amountLabel: '$499 first year' },
  pilot: { mode: 'subscription', amountLabel: '$299/month' },
  standard: { mode: 'subscription', amountLabel: '$999/month' },
};

export function tierSupportsCheckout(tier) {
  return Boolean(tierMeta[tier]);
}

export async function createCheckoutSession({
  tier,
  submissionId,
  email,
  metadata = {},
}) {
  const meta = tierMeta[tier];
  if (!meta) throw new Error(`Unknown tier: ${tier}`);
  const price = requireStripePrice(tier);
  const successUrl = `${env.siteUrl}/submit-success.html?id=${encodeURIComponent(submissionId)}`;
  const cancelUrl = `${env.siteUrl}/submit-cancel.html?id=${encodeURIComponent(submissionId)}`;
  const session = await stripe().checkout.sessions.create({
    mode: meta.mode,
    customer_email: email,
    client_reference_id: submissionId,
    line_items: [{ price, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    metadata: {
      submission_id: submissionId,
      tier,
      ...metadata,
    },
    subscription_data:
      meta.mode === 'subscription'
        ? { metadata: { submission_id: submissionId, tier } }
        : undefined,
  });
  return { url: session.url, id: session.id, amountLabel: meta.amountLabel };
}

export function verifyWebhook(rawBody, signature) {
  if (!features.stripe) throw new Error('STRIPE_SECRET_KEY not configured');
  if (!env.stripe.webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }
  return stripe().webhooks.constructEvent(
    rawBody,
    signature,
    env.stripe.webhookSecret,
  );
}
