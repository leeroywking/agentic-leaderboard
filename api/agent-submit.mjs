import { methodGuard, readJson, ok, bad } from './_lib/http.mjs';
import { store, keys } from './_lib/store.mjs';
import { submissionId, slugify } from './_lib/ids.mjs';
import { features } from './_lib/env.mjs';
import { createCheckoutSession, tierSupportsCheckout } from './_lib/stripe.mjs';
import { createReviewIssue } from './_lib/github.mjs';
import { sendEmail, templates } from './_lib/email.mjs';

const requiredFields = ['name', 'handle', 'owner', 'email', 'repo', 'tier'];

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  let body;
  try {
    body = await readJson(req);
  } catch {
    return bad(res, 400, 'invalid_json');
  }

  for (const field of requiredFields) {
    if (!body[field] || typeof body[field] !== 'string') {
      return bad(res, 400, `missing_or_invalid_field:${field}`);
    }
  }

  const tier = body.tier;
  if (!['verified', 'certified'].includes(tier)) {
    return bad(res, 400, 'invalid_tier', {
      allowed: ['verified', 'certified'],
    });
  }

  const repoMatch = body.repo.match(
    /(?:github\.com\/)?([^/\s]+)\/([^/\s?#]+?)(?:\.git)?(?:[/?#].*)?$/,
  );
  if (!repoMatch) {
    return bad(res, 400, 'invalid_repo_format', {
      hint: 'use owner/repo or a github.com URL',
    });
  }

  const id = submissionId();
  const submission = {
    id,
    kind: 'agent_submission',
    tier,
    slug: slugify(body.handle || body.name),
    name: body.name.trim().slice(0, 120),
    handle: body.handle.trim().slice(0, 60),
    owner: body.owner.trim().slice(0, 80),
    email: body.email.trim().toLowerCase().slice(0, 200),
    repo: `${repoMatch[1]}/${repoMatch[2]}`,
    systems: typeof body.systems === 'string'
      ? body.systems.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(body.systems)
        ? body.systems.slice(0, 24)
        : [],
    declared_autonomy: body.declared_autonomy || 'supervised',
    notes: (body.notes || '').slice(0, 2000),
    status: 'pending_payment',
    payment_status: 'pending',
    created_at: new Date().toISOString(),
  };

  await store.set(keys.submission(id), JSON.stringify(submission));
  await store.sadd(keys.submissions, id);

  let checkoutUrl = null;
  let amountLabel = null;

  if (features.stripe && tierSupportsCheckout(tier)) {
    try {
      const session = await createCheckoutSession({
        tier,
        submissionId: id,
        email: submission.email,
        metadata: {
          name: submission.name,
          slug: submission.slug,
        },
      });
      checkoutUrl = session.url;
      amountLabel = session.amountLabel;
    } catch (err) {
      console.error('stripe_session_error', err);
    }
  }

  // Fire-and-forget notifications so the user doesn't wait on Resend.
  Promise.allSettled([
    sendEmail({
      to: submission.email,
      ...templates.agentSubmitted({
        name: submission.name,
        submissionId: id,
        tier,
        amountLabel: amountLabel || (tier === 'certified' ? '$499 first year' : '$149/year'),
      }),
    }),
    createReviewIssue({ submission }),
  ]).catch(() => {});

  return ok(res, {
    submission_id: id,
    status: submission.status,
    checkout_url: checkoutUrl,
    stripe_configured: features.stripe,
    message: checkoutUrl
      ? 'Redirecting to Stripe Checkout.'
      : 'Submission received. A reviewer will follow up by email.',
  });
}
