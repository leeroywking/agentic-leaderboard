// Thin storage layer. Primary backend is Upstash Redis (works on Vercel
// via the Upstash integration, and anywhere else via REST). Falls back to
// an in-memory Map when Upstash isn't configured — useful for local dev
// and for keeping the endpoints non-crashing when env vars are missing.
//
// The in-memory fallback is ephemeral per serverless invocation, so any
// writes made in fallback mode do not persist across requests in a real
// deploy. That's by design: the logs/console messages will scream for
// Upstash to be wired up before taking real customers.

import { Redis } from '@upstash/redis';
import { env, features } from './env.mjs';

let redis = null;
if (features.persistence) {
  redis = new Redis({ url: env.upstash.url, token: env.upstash.token });
}

const memory = new Map();
const memorySets = new Map();

export const store = {
  mode: features.persistence ? 'upstash' : 'memory',

  async get(key) {
    if (redis) return redis.get(key);
    return memory.get(key) ?? null;
  },

  async set(key, value, { ex } = {}) {
    if (redis) {
      if (ex) return redis.set(key, value, { ex });
      return redis.set(key, value);
    }
    memory.set(key, value);
    return 'OK';
  },

  async incr(key) {
    if (redis) return redis.incr(key);
    const next = (memory.get(key) ?? 0) + 1;
    memory.set(key, next);
    return next;
  },

  async sadd(key, value) {
    if (redis) return redis.sadd(key, value);
    const set = memorySets.get(key) ?? new Set();
    const existed = set.has(value);
    set.add(value);
    memorySets.set(key, set);
    return existed ? 0 : 1;
  },

  async smembers(key) {
    if (redis) return redis.smembers(key);
    const set = memorySets.get(key);
    return set ? [...set] : [];
  },

  async del(key) {
    if (redis) return redis.del(key);
    memory.delete(key);
    memorySets.delete(key);
    return 1;
  },
};

// Key naming conventions. Keep these in one place so the admin page and
// the webhook handler never drift.

export const keys = {
  submission: (id) => `submission:${id}`,
  submissions: 'submissions:index',
  apiKey: (token) => `apikey:${token}`,
  apiKeysByEmail: (email) => `apikey:email:${email.toLowerCase()}`,
  usage: (token, period) => `usage:${token}:${period}`,
};
