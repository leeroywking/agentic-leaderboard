import { Resend } from 'resend';
import { env, features } from './env.mjs';

let client = null;
function resend() {
  if (!features.email) throw new Error('RESEND_API_KEY not configured');
  if (!client) client = new Resend(env.resend.apiKey);
  return client;
}

export async function sendEmail({ to, subject, text, html, replyTo }) {
  if (!features.email) {
    console.log(
      `[email-fallback] to=${to} subject=${subject}\n${text || html}`,
    );
    return { id: 'fallback', logged: true };
  }
  const response = await resend().emails.send({
    from: env.resend.from,
    to,
    subject,
    text,
    html,
    reply_to: replyTo,
  });
  return response;
}

export const templates = {
  agentSubmitted({ name, submissionId, tier, amountLabel }) {
    const subject = `Agentic Leaderboard — submission received for ${name}`;
    const text = `Hi,

Thanks for submitting ${name} for ${tier} certification.

Submission id: ${submissionId}
Amount: ${amountLabel}

What happens next:
1. We review the identity binding and evidence (typically within 72 hours).
2. If accepted, your passport at ${env.siteUrl}/agent-<slug>.html goes live.
3. If the review needs more information, we reply to this thread.

If you didn't initiate this submission, reply to this email and we will
reject it.

— Agentic Leaderboard`;
    return { subject, text };
  },

  pilotActivated({ company, apiKey }) {
    const subject = 'Agentic Leaderboard — pilot API key';
    const text = `Hi ${company ? company + ' team' : 'there'},

Welcome to the Agentic Leaderboard pilot partner program. Your API key is:

${apiKey}

Authenticate with:
  Authorization: Bearer ${apiKey}

Pilot tier includes 5,000 lookups/month, webhook-on-composite-change,
and public listing as a pilot partner. Volume limits reset monthly.

Docs: ${env.siteUrl}/for-relying-parties.html

— Agentic Leaderboard`;
    return { subject, text };
  },

  sandboxKeyIssued({ email, apiKey }) {
    const subject = 'Agentic Leaderboard — sandbox API key';
    const text = `Welcome.

Your sandbox API key is:

${apiKey}

Authenticate with:
  Authorization: Bearer ${apiKey}

Sandbox tier is free and capped at 100 lookups/month. Upgrade to Pilot
($299/month) for 5,000 lookups, webhooks, and pilot-partner listing.

Docs: ${env.siteUrl}/for-relying-parties.html
API sample: ${env.siteUrl}/api/v1/agents/skoal-reviewer

If you didn't request this key, ignore this email — the key is
rate-limited and will auto-expire if unused for 60 days.

— Agentic Leaderboard`;
    return { subject, text };
  },

  reviewNotification({ submission }) {
    const subject = `Review queue — ${submission.name} (${submission.tier})`;
    const text = `New submission received.

Name: ${submission.name}
Handle: ${submission.handle}
Owner: ${submission.owner}
Tier: ${submission.tier}
Email: ${submission.email}
Repo: ${submission.repo}
Submission id: ${submission.id}
Received: ${submission.created_at}

Admin queue: ${env.siteUrl}/admin.html`;
    return { subject, text };
  },
};
