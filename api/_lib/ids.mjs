import { randomBytes } from 'node:crypto';

export function submissionId() {
  return `sub_${randomBytes(9).toString('base64url')}`;
}

export function apiKey(tier = 'sandbox') {
  const prefix = { sandbox: 'alb_sbx_', pilot: 'alb_pil_', standard: 'alb_std_' }[tier] || 'alb_';
  return `${prefix}${randomBytes(18).toString('base64url')}`;
}

export function slugify(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}
