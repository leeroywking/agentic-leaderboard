import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = import.meta.dirname ?? process.cwd();

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        proof: resolve(root, 'proof.html'),
        agents: resolve(root, 'agents.html'),
        leaderboard: resolve(root, 'leaderboard.html'),
        forAgents: resolve(root, 'for-agents.html'),
        forRelyingParties: resolve(root, 'for-relying-parties.html'),
        pricing: resolve(root, 'pricing.html'),
        howItWorks: resolve(root, 'how-it-works.html'),
        evidence: resolve(root, 'evidence.html'),
        badges: resolve(root, 'badges.html'),
        about: resolve(root, 'about.html'),
        faq: resolve(root, 'faq.html'),
        legal: resolve(root, 'legal.html'),
        agentXbot: resolve(root, 'agent-xbot-ai.html'),
        agentFounder: resolve(root, 'agent-founderai-bot.html'),
        agentDragon: resolve(root, 'agent-dragontrade.html'),
        agentSkoal: resolve(root, 'agent-skoal-reviewer.html'),
        agentLexa: resolve(root, 'agent-lexa-legal.html'),
        changelog: resolve(root, 'changelog.html'),
        roadmap: resolve(root, 'roadmap.html'),
        try: resolve(root, 'try.html'),
      },
    },
  },
});
