// Smoke test for the serverless handlers. Imports each endpoint module,
// invokes it with a mock Node req/res, and reports status + response body.
// Verifies that with no env vars set, every endpoint returns a sane
// (non-crashing) response.

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { Readable } from 'node:stream';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function mockReq({ method = 'GET', url = '/', headers = {}, body = null } = {}) {
  const req = Readable.from(body ? [Buffer.from(JSON.stringify(body))] : []);
  req.method = method;
  req.url = url;
  req.headers = {
    host: 'localhost',
    ...headers,
    ...(body ? { 'content-type': 'application/json' } : {}),
  };
  if (body) req.body = body;
  req.query = Object.fromEntries(new URL(url, 'http://x').searchParams);
  return req;
}

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body = '') {
      this.body = body;
    },
  };
  return res;
}

async function run(label, modulePath, reqOpts) {
  const module = await import(pathToFileURL(resolve(rootDir, modulePath)).href);
  const handler = module.default;
  const req = mockReq(reqOpts);
  const res = mockRes();
  try {
    await handler(req, res);
  } catch (err) {
    console.log(`  ${label}  threw: ${err.message}`);
    return { label, status: 'threw', error: err.message };
  }
  const body = res.body ? safeParse(res.body) : null;
  console.log(`  ${label}  ${res.statusCode}  ${summary(body)}`);
  return { label, status: res.statusCode, body };
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function summary(body) {
  if (!body) return '';
  if (typeof body === 'string') return body.slice(0, 80);
  if (body.error) return `error=${body.error}`;
  const keys = Object.keys(body).slice(0, 4);
  return keys.map((k) => `${k}=${JSON.stringify(body[k]).slice(0, 40)}`).join(' ');
}

async function main() {
  console.log('API handler smoke test (no env vars set — graceful-degrade mode)\n');

  await run('agent-submit bad body', 'api/agent-submit.mjs', {
    method: 'POST',
    url: '/api/agent-submit',
    body: {},
  });

  await run('agent-submit valid', 'api/agent-submit.mjs', {
    method: 'POST',
    url: '/api/agent-submit',
    body: {
      name: 'Smoke Bot',
      handle: '@smoke',
      owner: 'smoke-labs',
      email: 'smoke@example.com',
      repo: 'smoke-labs/smoke',
      tier: 'verified',
    },
  });

  await run('sandbox-key missing email', 'api/sandbox-key.mjs', {
    method: 'POST',
    url: '/api/sandbox-key',
    body: {},
  });

  await run('sandbox-key valid', 'api/sandbox-key.mjs', {
    method: 'POST',
    url: '/api/sandbox-key',
    body: { email: 'smoke-rp@example.com', company: 'Smoke Co' },
  });

  await run('pilot-request valid', 'api/pilot-request.mjs', {
    method: 'POST',
    url: '/api/pilot-request',
    body: {
      email: 'smoke-pilot@example.com',
      company: 'Smoke Co',
      use_case: 'testing',
      tier: 'pilot',
    },
  });

  await run('stripe-webhook not configured', 'api/stripe-webhook.mjs', {
    method: 'POST',
    url: '/api/stripe-webhook',
    headers: { 'stripe-signature': 'test' },
  });

  await run('agent lookup missing key', 'api/v1/agents/[slug].mjs', {
    method: 'GET',
    url: '/api/v1/agents/skoal-reviewer',
  });

  await run('admin queue missing token', 'api/admin/submissions.mjs', {
    method: 'GET',
    url: '/api/admin/submissions',
  });

  // End-to-end: issue a key, then use it to fetch an agent.
  const sandbox = await run('sandbox-key (for e2e)', 'api/sandbox-key.mjs', {
    method: 'POST',
    url: '/api/sandbox-key',
    body: { email: 'e2e@example.com', company: 'E2E' },
  });
  const token = sandbox?.body?.api_key_preview;
  if (token) {
    await run(`agent lookup with issued key`, 'api/v1/agents/[slug].mjs', {
      method: 'GET',
      url: '/api/v1/agents/skoal-reviewer',
      headers: { authorization: `Bearer ${token}` },
    });
    await run('agent lookup unknown slug', 'api/v1/agents/[slug].mjs', {
      method: 'GET',
      url: '/api/v1/agents/does-not-exist',
      headers: { authorization: `Bearer ${token}` },
    });
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
