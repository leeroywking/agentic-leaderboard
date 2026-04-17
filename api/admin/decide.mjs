import { methodGuard, readJson, ok, bad } from '../_lib/http.mjs';
import { isAdmin } from '../_lib/auth.mjs';
import { store, keys } from '../_lib/store.mjs';
import { sendEmail } from '../_lib/email.mjs';
import { env } from '../_lib/env.mjs';

const validOutcomes = new Set([
  'accepted',
  'rejected',
  'needs_changes',
  'withdrawn',
]);

function publishedAgentFrom(submission) {
  const slug = submission.slug;
  return {
    slug,
    name: submission.name,
    handle: submission.handle,
    type: 'named agent',
    owner: submission.owner,
    ownerType: 'human',
    framework: 'custom',
    certification: submission.tier === 'certified' ? 'certified' : 'verified',
    firstSeen: new Date().toISOString().slice(0, 10),
    systems: submission.systems || [],
    identityBindings: [
      { type: 'github_repo_file', value: `${submission.repo}/AGENT.md` },
    ],
    proofs: 0,
    agency: 'agency-proofed',
    lane: 'verified_work',
    confidence: 'low',
    lastAction: 'Awaiting first verified evidence',
    axes: {
      reach: {
        v: Math.min(1, (submission.systems || []).length / 8),
        c: 0.35,
        detail: `${(submission.systems || []).length} declared systems`,
      },
      depth: { v: 0, c: 0.25, detail: 'No proof events yet' },
      autonomy: {
        v: 0.3,
        c: 0.25,
        grade: 'supervised',
        capNote: 'capped — no harness telemetry yet',
      },
      acceptance: {
        v: 0,
        c: 0.2,
        externalN: 0,
        externalRate: 0,
        selfRate: null,
      },
    },
    continuity: Array(12).fill(0),
    proofTimeline: [],
    source: 'submission',
    submission_id: submission.id,
    published_at: new Date().toISOString(),
    passport_url: `${env.siteUrl}/agent.html?slug=${slug}`,
  };
}

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;
  if (!isAdmin(req)) return bad(res, 401, 'unauthorized');

  let body;
  try {
    body = await readJson(req);
  } catch {
    return bad(res, 400, 'invalid_json');
  }

  const { submission_id: submissionId, outcome, note } = body;
  if (!submissionId) return bad(res, 400, 'missing_submission_id');
  if (!validOutcomes.has(outcome)) {
    return bad(res, 400, 'invalid_outcome', { allowed: [...validOutcomes] });
  }

  const raw = await store.get(keys.submission(submissionId));
  if (!raw) return bad(res, 404, 'submission_not_found');
  const submission = typeof raw === 'string' ? JSON.parse(raw) : raw;

  submission.status = outcome;
  submission.decided_at = new Date().toISOString();
  if (note) submission.decision_note = note.slice(0, 2000);

  let publishedPassportUrl = null;
  if (outcome === 'accepted' && submission.kind === 'agent_submission') {
    const record = publishedAgentFrom(submission);
    await store.set(
      keys.publishedAgent(record.slug),
      JSON.stringify(record),
    );
    await store.sadd(keys.publishedAgents, record.slug);
    submission.published_slug = record.slug;
    publishedPassportUrl = record.passport_url;
  }

  await store.set(keys.submission(submissionId), JSON.stringify(submission));

  const reasonLine = note ? `\n\nReviewer note: ${note}` : '';
  const publishedLine = publishedPassportUrl
    ? `\n\nYour live passport is at: ${publishedPassportUrl}\nBadges start returning real SVGs once the first verified evidence is ingested.`
    : '';
  if (submission.email) {
    const subject = {
      accepted: `Approved — ${submission.name || submission.company || submissionId}`,
      rejected: `Rejected — ${submission.name || submission.company || submissionId}`,
      needs_changes: `Needs changes — ${submission.name || submission.company || submissionId}`,
      withdrawn: `Withdrawn — ${submission.name || submission.company || submissionId}`,
    }[outcome];
    await sendEmail({
      to: submission.email,
      subject,
      text: `Your submission ${submissionId} is now ${outcome}.${reasonLine}${publishedLine}`,
    });
  }

  return ok(res, {
    submission_id: submissionId,
    outcome,
    submission,
    published_passport_url: publishedPassportUrl,
  });
}
