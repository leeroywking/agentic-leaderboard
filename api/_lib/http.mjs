// Tiny helpers for Vercel-style Node handlers: CORS, JSON parsing, JSON
// responses, method guards. Endpoint files stay readable without re-
// implementing the same plumbing each time.

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export function bad(res, status, message, extra = {}) {
  json(res, status, { error: message, ...extra });
}

export function ok(res, body) {
  json(res, 200, body);
}

export function applyCors(res, { origin = '*' } = {}) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function methodGuard(req, res, allowed) {
  applyCors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return false;
  }
  if (!allowed.includes(req.method)) {
    res.setHeader('Allow', allowed.join(', '));
    bad(res, 405, 'Method not allowed');
    return false;
  }
  return true;
}

export async function readJson(req) {
  if (req.body) {
    // Vercel auto-parses JSON bodies when Content-Type is set.
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export async function readRaw(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const bearer = header.match(/^Bearer\s+(.+)$/i);
  if (bearer) return bearer[1].trim();
  const url = new URL(req.url, 'http://x');
  return url.searchParams.get('key') || null;
}
