# Codex Project Memory

Codex Project Memory is a local Codex plugin that keeps durable context separate for each project. It uses interactive memory review when Codex exposes structured input, an explicit automatic-save fallback otherwise, a file-backed knowledge graph, and explicit one-way links when one project needs to read another.

[![CI](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml/badge.svg)](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

## Principles

- Local by default: data stays under `CODEX_HOME` and the plugin does not use the network.
- Inspectable storage: approved memories are plain Markdown outside project directories.
- Project scoped: each registered project has an independent memory namespace.
- Interaction aware: proposals use structured save choices when available and auto-save when that
  interaction tool is unavailable.
- Knowledge graph: approved memories can be connected with reviewed, typed relationships and
  explored through readable Markdown or a private interactive offline workspace.
- Read-only links: cross-project access is explicit, directional, and never grants write access.
- Verifiable context: memory entries can retain multiple evidence, report, workflow, and reference
  citations; every source is checked independently for staleness.

## Requirements

- Codex with local plugin and Skill support
- Node.js 22.13 or newer available to Codex

## Install From This Repository

```bash
git clone https://github.com/WangXueZhi/codex-project-memory.git
cd codex-project-memory
pnpm install --frozen-lockfile
pnpm build
codex plugin marketplace add "$PWD"
codex plugin add codex-project-memory@codex-project-memory
```

Start a new Codex thread after installation. Invoke `@codex-project-memory` explicitly, or ask Codex to load the current project's saved context.

## First Use

1. Ask Codex to detect the current project.
2. Review the detected root and Git/worktree information.
3. Confirm registration to create a local project ID.
4. Optionally request the managed `AGENTS.md` binding snippet for deterministic loading in future threads.
5. At the end of useful work, choose whether to save all, select items, or skip when structured
   input is available. Without it, the plugin saves all proposed items and reports the fallback.

Relevant memories can be understood with `guide` and explored with `relations`, `path`, or `graph`.
Graph output is available as JSON, Mermaid, readable Markdown, or a standalone offline HTML
workspace. The HTML view opens with a research guide that explains what to read first, current
knowledge gaps, evidence status, suggested questions, and display-only relationship clues. A dark
force-directed graph and hierarchical reading layout remain available for deeper exploration;
citation nodes expand only around the selected memory. Normal `load` and `search` do not
automatically expand connected memories.

To let project B read project A, register both projects and approve a one-way `B -> A` link. The plugin will not allow A to read B unless a separate link is approved.

## Data Location

The external file store defaults to:

```text
${CODEX_HOME:-~/.codex}/project-memory/v1/
```

Its layout is:

```text
registry.json
links.json
projects/<project-id>/project.json
projects/<project-id>/MEMORY.md
projects/<project-id>/RELATIONS.json
projects/<project-id>/KNOWLEDGE_GRAPH.html
projects/<project-id>/proposals/<proposal-id>.json
projects/<project-id>/audit.jsonl
```

Approved memory content and source citations live in `MEMORY.md`, while reviewed graph edges live
in `RELATIONS.json`. `KNOWLEDGE_GRAPH.html` is a generated read-only snapshot, not a source of truth.
Other JSON files retain project identity, directional links, proposal state, and the audit trail.
Nothing is written into a registered project.

Set `CODEX_PROJECT_MEMORY_HOME` to use an isolated data directory for development or testing. An optional `config.json` in the same directory may contain additional deny patterns:

```json
{
  "denyPatterns": ["private/**", "**/*.secret"]
}
```

## Development

```bash
pnpm install
pnpm check
pnpm test:visual
```

The distributable plugin lives in `plugins/codex-project-memory`. `pnpm build` bundles the Skill
CLI and Stop Hook plus the Preact/Cytoscape/FCoSE browser assets. Generated graph HTML inlines those
assets, so the user-facing snapshot remains one private offline file.

## Current Limits

- Memory is local and is not synchronized between machines.
- The HTML view is read-only; there is no editing UI or automatic background extraction.
- Source and memory search are literal text searches and do not build a persistent index.
- Knowledge graph relationships do not automatically change search ranking or hide superseded
  memories.
- Display-only relationship clues require explicit user review before they can become formal graph
  relationships.
- The Stop Hook requires one-time review and trust in Codex before it runs.
- Automatic fallback commits all proposed memories, enrichments, and relationships when
  `request_user_input` is unavailable; the final receipt identifies that behavior.
- Existing `memory.sqlite3` files from pre-0.2 development builds are left untouched and are not
  imported automatically.

See [Architecture](docs/architecture.md) and [Security](SECURITY.md) for design and trust boundaries.

## License

Apache License 2.0. See [LICENSE](LICENSE).
