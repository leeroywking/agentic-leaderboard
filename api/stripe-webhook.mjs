import { readRaw, ok, bad, applyCors } from './_lib/http.mjs';
import { store, keys } from './_lib/store.mjs';
import { verifyWebhook } from './_lib/stripe.mjs';
import { apiKey } from './_lib/ids.mjs';
import { sendEmail, templates } from './_lib/email.mjs';
import { features } from './_lib/env.mjs';

// Vercel by default parses JSON bodies; Stripe signature verification
// needs the raw body. Export the config to opt out of body parsing.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleCheckoutCompleted(session) {
  const submissionId = session.client_reference_id || session.metadata?.submission_id;
  if (!submissionId) return { skipped: 'no_submission_id' };

  const raw = await store.get(keys.submission(submissionId));
  if (!raw) return { skipped: 'submission_not_found', submissionId };

  const submission = typeof raw === 'string' ? JSON.parse(raw) : raw;
  submission.payment_status = 'paid';
  submission.status = submission.kind === 'relying_party_request' ? 'provisioning' : 'under_review';
  submission.stripe_session_id = session.id;
  submission.stripe_customer_id = session.customer;
  submission.paid_at = new Date().toISOString();

  // For relying-party pilots and standard tiers, issue an API key
  // immediately on checkout completion. Subject submissions wait for
  // manual review before a passport goes live.
  if (submission.kind === 'relying_party_request') {
    const tier = submission.tier;
    const token = apiKey(tier);
    const record = {
      token,
      tier,
      email: submission.email,
      company: submission.company,
      submission_id: submissionId,
      stripe_customer_id: session.customer,
      created_at: new Date().toISOString(),
      revoked: false,
    };
    await store.set(keys.apiKey(token), JSON.stringify(record));
    await store.set(keys.apiKeysByEmail(submission.email), token);
    submission.api_key = token;
    await sendEmail({
      to: submission.email,
      ...templates.pilotActivated({ company: submission.company, apiKey: token }),
    });
  } else {
    await sendEmail({
      to: submission.email,
      subject: `Payment received — ${submission.name} in review`,
      text: `Your ${submission.tier} certification fee has been received. The identity binding and evidence review typically completes within 72 hours; we'll email the outcome. Submission id: ${submissionId}.`,
    });
  }

  await store.set(keys.submission(submissionId), JSON.stringify(submission));
  return { processed: true, submissionId, kind: submission.kind };
}

export default async function handler(req, res) {
  applyCors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return bad(res, 405, 'method_not_allowed');
  }
  if (!features.stripe) {
    return bad(res, 503, 'stripe_not_configured');
  }

  const raw = await readRaw(req);
  const signature = req.headers['stripe-signature'];
  if (!signature) return bad(res, 400, 'missing_signature');

  let event;
  try {
    event = verifyWebhook(raw, signature);
  } catch (err) {
    return bad(res, 400, 'invalid_signature', { detail: err.message });
  }

  let result = { event: event.type };
  try {
    if (event.type === 'checkout.session.completed') {
      result = { ...result, ...(await handleCheckoutCompleted(event.data.object)) };
    } else {
      result.skipped = 'unhandled_event_type';
    }
  } catch (err) {
    console.error('webhook_handler_error', err);
    return bad(res, 500, 'handler_error', { detail: err.message });
  }

  return ok(res, result);
}
