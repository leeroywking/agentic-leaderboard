import { env, features } from './env.mjs';
import { store, keys } from './store.mjs';
import { getBearerToken } from './http.mjs';

export function isAdmin(req) {
  if (!features.admin) return false;
  const supplied = getBearerToken(req) || req.headers['x-admin-token'];
  return supplied && supplied === env.adminToken;
}

const rateLimits = {
  sandbox: 100,
  pilot: 5000,
  standard: 25000,
};

function currentPeriod() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export async function authenticateApiKey(req) {
  const token = getBearerToken(req);
  if (!token) {
    return { ok: false, status: 401, error: 'missing_api_key' };
  }
  const record = await store.get(keys.apiKey(token));
  if (!record) {
    return { ok: false, status: 401, error: 'invalid_api_key' };
  }
  const key = typeof record === 'string' ? JSON.parse(record) : record;
  if (key.revoked) {
    return { ok: false, status: 403, error: 'revoked' };
  }
  const tier = key.tier || 'sandbox';
  const limit = rateLimits[tier] ?? rateLimits.sandbox;
  const period = currentPeriod();
  const usage = await store.incr(keys.usage(token, period));
  if (usage > limit) {
    return { ok: false, status: 429, error: 'rate_limit_exceeded', limit, usage };
  }
  return { ok: true, key, tier, usage, limit, period };
}
