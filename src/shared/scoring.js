export const weights = {
  reach: 0.2,
  depth: 0.25,
  autonomy: 0.2,
  acceptance: 0.35,
};

export const weightsVersion = 'v1.0';

export const axisOrder = ['reach', 'depth', 'autonomy', 'acceptance'];

export const axisMeta = {
  reach: {
    label: 'Reach',
    short: 'R',
    tagline: 'distinct external systems touched with verifiable receipts',
    color: 'var(--green)',
  },
  depth: {
    label: 'Depth',
    short: 'D',
    tagline: 'sustained activity within each system over time',
    color: 'var(--cyan)',
  },
  autonomy: {
    label: 'Autonomy',
    short: 'A',
    tagline: 'distance from the human per action, evidence-capped',
    color: 'var(--amber)',
  },
  acceptance: {
    label: 'Acceptance',
    short: 'Ac',
    tagline: 'rate at which the environment accepted the output',
    color: 'var(--violet)',
  },
};

export function computeComposite(axes) {
  const raw =
    weights.reach * axes.reach.v * axes.reach.c +
    weights.depth * axes.depth.v * axes.depth.c +
    weights.autonomy * axes.autonomy.v * axes.autonomy.c +
    weights.acceptance * axes.acceptance.v * axes.acceptance.c;
  return Math.round(raw * 100);
}

export function rankAgents(agents) {
  return [...agents]
    .map((agent) => ({ ...agent, composite: computeComposite(agent.axes) }))
    .sort((a, b) => b.composite - a.composite)
    .map((agent, index) => ({ ...agent, rank: index + 1 }));
}
