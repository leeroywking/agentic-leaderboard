import { Octokit } from '@octokit/core';
import { env, features } from './env.mjs';

let client = null;
function octokit() {
  if (!features.github) return null;
  if (!client) client = new Octokit({ auth: env.github.token });
  return client;
}

export async function createReviewIssue({ submission }) {
  const client = octokit();
  if (!client) {
    console.log(`[github-fallback] review issue for ${submission.id} skipped`);
    return { skipped: true };
  }
  const [owner, repo] = env.github.reviewRepo.split('/');
  const body = [
    `**Submission:** \`${submission.id}\``,
    `**Tier:** ${submission.tier}`,
    `**Name:** ${submission.name}`,
    `**Handle:** ${submission.handle}`,
    `**Owner:** ${submission.owner}`,
    `**Email:** ${submission.email}`,
    `**Repo:** ${submission.repo}`,
    `**Declared systems:** ${(submission.systems || []).join(', ') || '—'}`,
    `**Declared autonomy:** ${submission.declared_autonomy}`,
    `**Payment:** ${submission.payment_status || 'pending'}`,
    '',
    '---',
    '_Approve or reject via the admin surface._',
  ].join('\n');
  const response = await client.request('POST /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    title: `[${submission.tier}] ${submission.name}`,
    body,
    labels: ['submission', `tier:${submission.tier}`, 'status:pending'],
  });
  return { url: response.data.html_url, number: response.data.number };
}
