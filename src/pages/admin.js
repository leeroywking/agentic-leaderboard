import { mountPage } from '../shared/layout.js';
import { escapeHtml } from '../shared/render.js';

const STORAGE_KEY = 'alb.admin.token';

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">Admin</p>
      <h2>Review queue.</h2>
      <p>
        Gated by <code>ADMIN_TOKEN</code>. The token is kept in
        <code>localStorage</code> on this browser until cleared.
      </p>
    </div>
    <div class="fee-card" style="margin-bottom:18px;">
      <label for="admin-token" class="eyebrow" style="display:block;margin-bottom:8px;">Admin token</label>
      <div style="display:flex;gap:10px;">
        <input
          id="admin-token"
          type="password"
          placeholder="ADMIN_TOKEN"
          style="flex:1;padding:10px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:0.96rem;"
        />
        <button data-admin-load>Load queue</button>
        <button data-admin-logout style="background:#fff;color:var(--ink);">Forget</button>
      </div>
    </div>
    <div data-admin-output>
      <p class="pricing-note">Enter a token above to load the queue.</p>
    </div>
  </section>
`;

mountPage({ activePath: '/admin.html', content });

const hasStorage = typeof globalThis.localStorage !== 'undefined';
const tokenInput = document.querySelector('#admin-token');
const output = document.querySelector('[data-admin-output]');

const saved = hasStorage ? globalThis.localStorage.getItem(STORAGE_KEY) : null;
if (saved && tokenInput) tokenInput.value = saved;

function renderSubmissions(list) {
  if (!list.length) {
    output.innerHTML = `<p class="pricing-note">No submissions yet.</p>`;
    return;
  }
  output.innerHTML = `
    <div class="stacked-list">
      ${list
        .map((sub) => {
          const statusColor =
            sub.status === 'accepted' ? 'var(--green)' :
            sub.status === 'rejected' ? 'var(--red)' :
            sub.status === 'pending_payment' ? 'var(--amber)' :
            'var(--muted)';
          const isAgent = sub.kind === 'agent_submission';
          const primary = isAgent ? sub.name : sub.company;
          const secondary = isAgent
            ? `${sub.handle} · ${sub.owner} · ${sub.repo}`
            : `${sub.email} · ${sub.platform_url || ''}`;
          return `
            <div>
              <div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline;">
                <strong>${escapeHtml(primary || sub.id)}</strong>
                <span style="color:${statusColor};font-weight:900;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.04em;">
                  ${escapeHtml(sub.status || 'pending')}
                </span>
              </div>
              <p style="margin:6px 0;">
                <code style="font-size:0.8rem;">${escapeHtml(sub.id)}</code>
                · tier <strong>${escapeHtml(sub.tier || 'n/a')}</strong>
                · received ${escapeHtml(sub.created_at || '')}
              </p>
              <p style="margin:4px 0;color:var(--muted);font-size:0.9rem;">${escapeHtml(secondary || '')}</p>
              ${sub.notes ? `<p style="margin:6px 0;">Notes: ${escapeHtml(sub.notes)}</p>` : ''}
              ${sub.api_key ? `<p style="margin:6px 0;"><code>${escapeHtml(sub.api_key)}</code></p>` : ''}
              <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
                <button data-decide="${escapeHtml(sub.id)}" data-outcome="accepted" style="background:var(--green);border-color:var(--green);color:#fff;">Accept</button>
                <button data-decide="${escapeHtml(sub.id)}" data-outcome="needs_changes" style="background:var(--amber);border-color:var(--amber);color:#3a2b00;">Needs changes</button>
                <button data-decide="${escapeHtml(sub.id)}" data-outcome="rejected" style="background:var(--red);border-color:var(--red);color:#fff;">Reject</button>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
  document.querySelectorAll('[data-decide]').forEach((button) => {
    button.addEventListener('click', () => decide(button.dataset.decide, button.dataset.outcome));
  });
}

async function loadQueue() {
  const token = tokenInput.value.trim();
  if (!token) return;
  if (hasStorage) globalThis.localStorage.setItem(STORAGE_KEY, token);
  output.innerHTML = `<p class="pricing-note">Loading…</p>`;
  try {
    const response = await fetch('/api/admin/submissions', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) {
      output.innerHTML = `<p class="pricing-note">Unauthorized — check the token.</p>`;
      return;
    }
    if (!response.ok) {
      const detail = await response.text();
      output.innerHTML = `<p class="pricing-note">Error: ${escapeHtml(detail)}</p>`;
      return;
    }
    const data = await response.json();
    renderSubmissions(data.submissions || []);
  } catch (err) {
    output.innerHTML = `<p class="pricing-note">Fetch failed: ${escapeHtml(err.message)} — API functions may not be deployed in this environment.</p>`;
  }
}

async function decide(submissionId, outcome) {
  const token = tokenInput.value.trim();
  const note = outcome === 'rejected' ? prompt('Rejection reason (will be emailed to the subject):') : '';
  if (outcome === 'rejected' && note === null) return;
  const response = await fetch('/api/admin/decide', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ submission_id: submissionId, outcome, note: note || undefined }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    alert(`Failed: ${data.error || response.statusText}`);
    return;
  }
  loadQueue();
}

const loadBtn = document.querySelector('[data-admin-load]');
const logoutBtn = document.querySelector('[data-admin-logout]');
if (loadBtn) loadBtn.addEventListener('click', loadQueue);
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (hasStorage) globalThis.localStorage.removeItem(STORAGE_KEY);
    tokenInput.value = '';
    output.innerHTML = `<p class="pricing-note">Token forgotten.</p>`;
  });
}
if (tokenInput) {
  tokenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadQueue();
    }
  });
}

// Auto-load queue only in a real browser (localStorage present means
// we're not in the prerender environment).
if (saved && hasStorage) loadQueue();
