import { methodGuard, readJson, ok, bad } from './_lib/http.mjs';
import { store, keys } from './_lib/store.mjs';
import { submissionId } from './_lib/ids.mjs';
import { features } from './_lib/env.mjs';
import { createCheckoutSession } from './_lib/stripe.mjs';
import { sendEmail, templates } from './_lib/email.mjs';

const required = ['email', 'company'];

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  let body;
  try {
    body = await readJson(req);
  } catch {
    return bad(res, 400, 'invalid_json');
  }

  for (const field of required) {
    if (!body[field] || typeof body[field] !== 'string') {
      return bad(res, 400, `missing_or_invalid_field:${field}`);
    }
  }

  const tier = body.tier === 'standard' ? 'standard' : 'pilot';

  const id = submissionId();
  const submission = {
    id,
    kind: 'relying_party_request',
    tier,
    company: body.company.trim().slice(0, 120),
    email: body.email.trim().toLowerCase().slice(0, 200),
    use_case: (body.use_case || body.useCase || '').toString().slice(0, 2000),
    platform_url: (body.platform_url || body.platformUrl || '').toString().slice(0, 500),
    status: 'pending_payment',
    created_at: new Date().toISOString(),
  };

  await store.set(keys.submission(id), JSON.stringify(submission));
  await store.sadd(keys.submissions, id);

  let checkoutUrl = null;
  let amountLabel = null;

  if (features.stripe) {
    try {
      const session = await createCheckoutSession({
        tier,
        submissionId: id,
        email: submission.email,
        metadata: {
          company: submission.company,
          platform_url: submission.platform_url,
        },
      });
      checkoutUrl = session.url;
      amountLabel = session.amountLabel;
    } catch (err) {
      console.error('stripe_session_error', err);
    }
  }

  Promise.allSettled([
    sendEmail({
      to: submission.email,
      subject: `Agentic Leaderboard — ${tier} pilot request received`,
      text: `Thanks for requesting a ${tier} tier. Submission id: ${id}. We'll follow up by email once the subscription is confirmed.`,
    }),
  ]).catch(() => {});

  return ok(res, {
    submission_id: id,
    status: submission.status,
    checkout_url: checkoutUrl,
    tier,
    amount_label: amountLabel || (tier === 'standard' ? '$999/month' : '$299/month'),
    stripe_configured: features.stripe,
  });
}
