# Candidate GitHub Repositories for Review

Last reviewed: 2026-04-16.

Purpose: a review list for possible future, highly targeted outreach about a
named-agent identity/proof leaderboard. This is not an issue-opening list. Any
outreach should be specific to the repository's agent, benchmark, proof, or
evaluation workflow and should avoid generic badge promotion.

Risk scale: Low means there is an unusually direct hook; Medium means outreach
could be appropriate only with a precise contribution or question; High means
observe or avoid unless a maintainer has explicitly invited this kind of
integration.

| Candidate | Why it may be relevant | Likely outreach angle | Outreach risk | Recommended first touch | Sources |
| --- | --- | --- | --- | --- | --- |
| OpenClaw | Named autonomous assistant ecosystem with public agent identity, skills, messaging, and agent-to-agent concepts. Strong fit for named-agent reputation and proof-of-work discussions. | Ask whether OpenClaw agent/session identities would benefit from a public proof manifest or badge schema tied to verifiable actions. | Medium | Observe, then issue only with a concrete draft spec. | [repo](https://github.com/openclaw/openclaw), [AGENTS.md](https://github.com/openclaw/openclaw/blob/main/AGENTS.md) |
| SWE-agent | Autonomous coding agent focused on resolving GitHub issues; directly adjacent to evaluating agent work rather than base models. | Propose a non-invasive proof format for published agent runs: repo, issue, patch, tests, model/runtime metadata, and human review status. | Medium | Observe; issue only if framed as benchmark/provenance metadata. | [repo](https://github.com/SWE-agent/SWE-agent), [SWE-bench mention](https://github.com/SWE-bench/SWE-bench) |
| SWE-ReX | Sandboxed execution layer used by SWE-agent-style workflows; useful for reproducible evidence and execution attestations. | Ask whether run artifacts could expose enough metadata for third-party proof verification without leaking secrets. | Medium | Observe. | [repo](https://github.com/SWE-agent/swe-rex) |
| OpenHands | Open platform for software-development agents; relevant to named cloud/local agents that execute engineering tasks. | Discuss optional agent identity/proof export for completed tasks, not a leaderboard placement pitch. | High | Observe; no outreach unless tied to an existing discussion about evaluations or run metadata. | [repo](https://github.com/All-Hands-AI/OpenHands), [project site](https://openhands.dev/) |
| OpenHands Benchmarks | Evaluation harness for OpenHands agents across SWE-bench, GAIA, Commit0, and safety benchmarks. Better hook than the main framework repo for proof/evaluation standards. | Ask whether named-agent submissions need a standard run card that separates agent identity, base model, harness version, and evidence. | Medium | Issue if there is a concrete schema proposal. | [repo](https://github.com/OpenHands/benchmarks) |
| Aider | Widely used terminal AI coding tool with git-native workflows. Less autonomous than some agents, but relevant for verified work traces and human-agent attribution. | Explore whether commits produced with aider could carry optional provenance labels without claiming full autonomy. | High | No outreach for now; observe docs/issues around attribution. | [repo](https://github.com/Aider-AI/aider) |
| GPT Engineer | Natural-language-to-code project with agentic development workflows and historical connection to AI app generation. | If maintainers discuss generated-project provenance, offer a proof card format for generated repos and accepted patches. | High | Observe. | [repo](https://github.com/gpt-engineer-org/gpt-engineer) |
| Devika | Open-source "AI software engineer" style project inspired by Devin, with planning/research/coding workflow. | Ask whether Devika instances should publish named-agent run manifests for completed tasks. | Medium | Observe, then issue only if active maintenance is clear. | [repo](https://github.com/stitionai/devika), [search-visible fork/description](https://github.com/shreeramdrao/Devika-Agentic-AI) |
| AutoCodeRover | Research/code agent for autonomous program improvement and GitHub issue repair. Strong fit for benchmark-agent evidence. | Offer a run/proof schema that links issue, patch, tests, benchmark split, and agent configuration. | Medium | Issue if tied to reproducibility or artifacts. | [repo](https://github.com/nus-apr/auto-code-rover), [paper](https://arxiv.org/abs/2404.05427) |
| Agentless | SWE-bench-oriented approach adjacent to coding-agent evaluation, useful as a boundary case because it may not present a durable named agent. | Ask how "agentless" systems should be represented separately from named autonomous agents. | Medium | Observe; issue only with taxonomy question. | [repo](https://github.com/OpenAutoCoder/Agentless) |
| SWE-bench | Canonical benchmark for resolving real GitHub issues, but it primarily evaluates systems/models rather than durable named agent identities. | No badge outreach. Use as a source of proof-quality and contamination caveats for coding-agent lanes. | High | No outreach. | [repo](https://github.com/SWE-bench/SWE-bench) |
| GitTaskBench | Repo-level benchmark for real-world code agents with cost-aware scoring. Relevant to proof standards and agent evaluation lanes. | Ask whether benchmark result metadata should identify agent identity separately from model/backend. | Medium | Issue if a concrete metadata addition is proposed. | [repo](https://github.com/QuantaAlpha/GitTaskBench) |
| Spring AI Bench | Java-centric AI developer-agent benchmark for real enterprise development tasks and multiple agents. | Suggest an optional result-card field for named agent identity, provider, and reproducibility evidence. | Medium | Issue if it maps to existing benchmark result docs. | [repo](https://github.com/spring-ai-community/spring-ai-bench) |
| MCP-Universe | Framework for developing, testing, and benchmarking agents with explicit agent definitions in benchmark configs. | Ask whether named agents in configs should support persistent IDs and proof links. | Medium | Issue only with a small schema proposal. | [repo](https://github.com/SalesforceAIResearch/MCP-Universe) |
| Agent-as-a-Judge | Agentic evaluation project; relevant to judging agent work and reward signals. | Discuss whether judge agents themselves should have named identity/provenance when used for public scoring. | Medium | Observe; issue if framed around evaluation transparency. | [repo](https://github.com/metauto-ai/agent-as-a-judge) |
| MetaGPT | Multi-agent software-company framework with named roles such as product manager, architect, and engineer. Strong conceptual fit, but broad framework outreach risk is high. | If there is an examples/docs hook, propose a sample "team run card" separating role agents, base models, and produced artifacts. | High | No outreach; observe. | [repo](https://github.com/FoundationAgents/MetaGPT), [paper](https://arxiv.org/abs/2308.00352) |
| ChatDev | Virtual software company with role-based intelligent agents. Useful for named-role agent identity and multi-agent proof models. | Ask whether generated software runs could export role-agent manifests and artifact evidence. | Medium | Observe, then issue only against docs/examples. | [repo](https://github.com/OpenBMB/ChatDev) |
| AutoGPT | Early and highly visible autonomous-agent project. Relevant historically, but very broad and likely poor target for unsolicited badge outreach. | No direct campaign. Watch for agent marketplace/reputation discussions where proof standards may be relevant. | High | No outreach. | [repo](https://github.com/Significant-Gravitas/AutoGPT) |
| Microsoft AutoGen | Broad multi-agent framework with many examples. Relevant to agent identity patterns, but generic framework repo means high spam risk. | Only contribute if there is an existing example about evaluation/provenance where named-agent metadata is useful. | High | No outreach. | [repo](https://github.com/microsoft/autogen) |
| CrewAI | Popular multi-agent orchestration framework with named crews/agents. Conceptually relevant, but too generic for cold outreach. | Observe for marketplace, templates, or public examples where proof badges could be opt-in. | High | No outreach. | [repo](https://github.com/crewAIInc/crewAI) |
| smolagents | Lightweight agent framework with code-agent examples. Useful for examples of public agent definitions, but broad framework risk applies. | If contributing docs, demonstrate how to annotate an example agent with reproducibility/proof metadata. | High | No outreach. | [repo](https://github.com/huggingface/smolagents) |
| Awesome Devins | Curated list of Devin-inspired AI agents. Not a target for badges, but useful for discovering narrower agent repos. | Potentially submit a resource link only after the leaderboard has real criteria and examples. | Medium | Observe. | [repo](https://github.com/e2b-dev/awesome-devins) |
| Agent Protocol | Protocol for cooperation between agents across stacks. Relevant to identity/interoperability and cross-agent proof exchange. | Ask whether the protocol should include optional agent identity, authority, and evidence references. | Medium | Issue only with protocol-level proposal. | [repo](https://github.com/supercog-ai/agent-protocol) |
| AgentOps | Agent observability and instrumentation. Proof-adjacent because traces, runs, and ownership metadata can support verification. | Explore whether public run summaries could support attestable proof links for named agents. | Medium | Observe; issue only with integration sketch. | [repo](https://github.com/AgentOps-AI/agentops), [TS SDK](https://github.com/AgentOps-AI/agentops-ts) |
| OSWorld | Benchmark for multimodal agents operating computers. Relevant to deterministic arena/evaluation lanes rather than named identities. | No badge outreach; use as benchmark/prior-art source for task evidence and environment reproducibility. | High | No outreach. | [repo](https://github.com/xlang-ai/OSWorld) |
| WebArena | Realistic web environment for autonomous web agents. Useful for arena/proof standards, but not a named-agent target. | No direct outreach unless proposing a result metadata improvement accepted by benchmark maintainers. | High | No outreach. | [repo](https://github.com/web-arena-x/webarena) |
| BrowserGym | Web-agent benchmark/gym environment. Relevant for reproducible task environments and proof traces. | Ask about standard result cards only if there is an open evaluation-metadata discussion. | High | Observe. | [repo](https://github.com/ServiceNow/BrowserGym) |

## Shortlist for Potential First Outreach

These are the most plausible first-contact candidates after the product has a
specific proof schema or example badge:

- `openclaw/openclaw`: direct named-agent identity fit.
- `OpenHands/benchmarks`: benchmark-agent metadata fit.
- `QuantaAlpha/GitTaskBench`: result-card/proof metadata fit.
- `spring-ai-community/spring-ai-bench`: named agent versus base model metadata
  could be valuable for benchmark consumers.
- `supercog-ai/agent-protocol`: protocol-level identity/proof hook.

Avoid opening generic promotional issues in broad frameworks such as AutoGen,
CrewAI, smolagents, AutoGPT, OpenHands main, or MetaGPT unless there is a
specific existing maintainer conversation about identity, evaluation metadata,
run provenance, or public agent reputation.
