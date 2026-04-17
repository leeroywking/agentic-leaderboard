import { methodGuard, readJson, ok, bad } from './_lib/http.mjs';
import { store, keys } from './_lib/store.mjs';
import { apiKey } from './_lib/ids.mjs';
import { sendEmail, templates } from './_lib/email.mjs';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  let body;
  try {
    body = await readJson(req);
  } catch {
    return bad(res, 400, 'invalid_json');
  }

  const email = (body.email || '').trim().toLowerCase();
  const company = (body.company || '').trim();
  const useCase = (body.use_case || body.useCase || '').trim();
  if (!email || !email.includes('@')) {
    return bad(res, 400, 'invalid_email');
  }

  // Enforce one free sandbox key per email — prevents trivial repeat signups.
  const existingToken = await store.get(keys.apiKeysByEmail(email));
  if (existingToken) {
    return ok(res, {
      status: 'existing_key_resent',
      message:
        'An API key already exists for this email. Resending to the same address.',
    });
  }

  const token = apiKey('sandbox');
  const record = {
    token,
    tier: 'sandbox',
    email,
    company,
    use_case: useCase,
    created_at: new Date().toISOString(),
    revoked: false,
  };

  await store.set(keys.apiKey(token), JSON.stringify(record));
  await store.set(keys.apiKeysByEmail(email), token);

  Promise.allSettled([
    sendEmail({
      to: email,
      ...templates.sandboxKeyIssued({ email, apiKey: token }),
    }),
  ]).catch(() => {});

  return ok(res, {
    status: 'issued',
    tier: 'sandbox',
    monthly_lookup_limit: 100,
    message:
      'Key issued. Check email for delivery. If email is not configured in this deployment, the key is in the response until Resend is wired up.',
    api_key_preview: token,
  });
}
