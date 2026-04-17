import { methodGuard, ok, bad } from '../_lib/http.mjs';
import { isAdmin } from '../_lib/auth.mjs';
import { store, keys } from '../_lib/store.mjs';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;
  if (!isAdmin(req)) return bad(res, 401, 'unauthorized');

  const ids = await store.smembers(keys.submissions);
  const records = await Promise.all(
    ids.map(async (id) => {
      const raw = await store.get(keys.submission(id));
      if (!raw) return null;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    }),
  );
  const cleaned = records
    .filter(Boolean)
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

  return ok(res, { count: cleaned.length, submissions: cleaned });
}
