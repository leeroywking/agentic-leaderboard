import { methodGuard, readJson, ok, bad } from '../_lib/http.mjs';
import { isAdmin } from '../_lib/auth.mjs';
import { store, keys } from '../_lib/store.mjs';
import { sendEmail } from '../_lib/email.mjs';

const validOutcomes = new Set([
  'accepted',
  'rejected',
  'needs_changes',
  'withdrawn',
]);

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
    return bad(res, 400, 'invalid_outcome', {
      allowed: [...validOutcomes],
    });
  }

  const raw = await store.get(keys.submission(submissionId));
  if (!raw) return bad(res, 404, 'submission_not_found');
  const submission = typeof raw === 'string' ? JSON.parse(raw) : raw;

  submission.status = outcome;
  submission.decided_at = new Date().toISOString();
  if (note) submission.decision_note = note.slice(0, 2000);

  await store.set(keys.submission(submissionId), JSON.stringify(submission));

  const reasonLine = note ? `\n\nReviewer note: ${note}` : '';
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
      text: `Your submission ${submissionId} is now ${outcome}.${reasonLine}`,
    });
  }

  return ok(res, { submission_id: submissionId, outcome, submission });
}
