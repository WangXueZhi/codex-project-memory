# Codex Project Memory

English | [简体中文](README.zh-CN.md)

**Private, token-aware project memory for Codex.**

Codex Project Memory helps Codex precisely recall reviewed, traceable, and still-current project
knowledge across separate tasks. It reduces repeated explanations, repeated file reads, and
irrelevant context without putting private memory files inside your repository.

[![CI](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml/badge.svg)](https://github.com/WangXueZhi/codex-project-memory/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

## Why This Project Exists

Codex can complete a task well and still lose useful project context when the next task starts.
This creates several common problems:

| Problem | What it looks like in daily work |
| --- | --- |
| Important context is lost | You must explain the same architecture, decision, or completed work again in every new task. |
| Memories from different projects get mixed | A rule that belongs to one repository may be incorrectly reused in another. |
| A conclusion has no proof | Codex remembers the answer but not the report, data file, or code that supported it. |
| Old information still looks correct | A source file changes, but the saved conclusion gives no warning. |
| Memory files pollute the repository | A project-level `memory.md` may enter Git history, be shared by mistake, or create noisy local changes. |
| A long memory list becomes hard to understand | You can find individual notes, but you cannot easily see how decisions, evidence, and conclusions are connected. |
| More memories consume more context | Loading every full memory spends tokens on unrelated history before the real task starts. |
| Saving is easy to miss | Useful work may finish without a clear indication of what was saved. |

Codex Project Memory addresses these problems with project isolation, reviewable saves,
source-backed memories, staleness checks, token-aware recall, and a readable knowledge guide.

## What You Gain

- **A separate memory space for every project.** A memory from project A is not silently loaded
  into project B.
- **Only relevant memory enters the task.** A compact candidate pass recommends the best matches;
  Codex then deep-reads only selected memories within a clear budget.
- **No memory files in your repository.** Data is kept under your private Codex directory, outside
  the registered project and its Git history.
- **Memories you can inspect.** Approved content is stored in plain `MEMORY.md`; relationships are
  stored in `RELATIONS.json`. There is no SQLite database to inspect or migrate.
- **A clear save result.** When Codex supports interactive choices, you can save all items, choose
  individual items, or skip. When that interaction is unavailable, the plugin saves the proposal
  and explicitly reports that automatic fallback.
- **Conclusions linked to their sources.** A memory can point to evidence, reports, workflows, and
  reference files, including the useful location inside each file.
- **Warnings when evidence changes.** Every cited file is checked separately. Changed, missing, or
  no-longer-authorized sources are shown as stale instead of being silently trusted.
- **A guide, not just a graph.** The offline knowledge workspace tells you what to read first,
  which topics exist, where evidence is weak, which memories are isolated, and what question to ask
  next.
- **Controlled cross-project reuse.** One project can read another only after you approve a
  one-way, read-only link.
- **Private and offline by design.** The plugin has no MCP server, no cloud service, no telemetry,
  and no runtime network access.
- **Deterministic and inspectable retrieval.** Ranking runs locally over plain files using weighted
  lexical matching, source freshness, confidence, project scope, and reviewed one-hop relations.

## How It Differs From Other Memory Options

This plugin complements Codex's built-in memory rather than trying to replace it.

| Option | Best for | Main limitation for project work |
| --- | --- | --- |
| Codex built-in memory | General preferences and context that may be useful across conversations | It is not a reviewable, source-backed knowledge store dedicated to one local project. |
| A `memory.md` inside the repository | A small shared note that should intentionally travel with the code | It can create Git changes and may expose private working context to collaborators or a public repository. |
| Codex Project Memory | Private project decisions, conclusions, workflows, evidence, and relationships | It stays on one machine unless you explicitly export or copy it. |

Use built-in memory for broad personal preferences. Use this plugin when a fact must belong to one
project, remain traceable to local files, and survive future Codex tasks without entering Git.

## How It Works

A substantial task follows this flow:

1. **Detect the project.** Codex identifies the current root. Registration happens only after you
   confirm it.
2. **Find compact candidates.** `recall` uses the task goal to return up to eight summaries within
   an estimated 800-token budget and recommends up to three memory IDs.
3. **Deep-read only the recommendations.** `get` reads those complete memories within an estimated
   1700-token budget. An item that does not fit is omitted whole, never cut in the middle.
4. **Check evidence when needed.** Stale memory is treated as a lead; Codex re-checks changed or
   missing sources before relying on it.
5. **Do the work.** Normal code and files remain the strongest source of truth. Memory is supporting
   context, not an instruction to ignore the current repository.
6. **Prepare useful memories.** At the end of substantial work, Codex proposes only durable items
   such as decisions, verified conclusions, workflows, conventions, or recurring pitfalls.
7. **Resolve the save.** You review the proposal when interactive choices are available. Otherwise,
   the automatic fallback saves it and states exactly what happened.
8. **Use it next time.** A later task can recall, inspect, trace, export, or visualize the saved
   knowledge for this project.

Temporary logs, guesses, secrets, and chat summaries should not become durable memories.

The default startup budget is 2500 estimated tokens: about 800 for candidate summaries and 1700
for deep reads. These are model-independent planning estimates, not billing tokens or exact output
from a model tokenizer.

```bash
project-memory recall --path . --query "first shipment non-ad diagnosis"
project-memory get --path . --memory-ids <id-1>,<id-2>
```

Retrieval is bilingual-friendly but lexical: it understands normalized words, paths, Chinese
phrases, and Chinese two-character fragments. It is not a complete semantic understanding system.

## Knowledge Guide And Graph

Saved memories can be connected with reviewed relationships such as "depends on", "supports",
"contradicts", or "supersedes". The plugin can show this knowledge in four formats:

- JSON for tools and integrations.
- Mermaid for a simple diagram.
- Markdown for a readable, portable report.
- A private, standalone HTML workspace for guided exploration.

The HTML workspace opens with a guide instead of dropping you into an unexplained network. It
summarizes the project, recommends what to read first, groups memories by topic, shows stale or
missing evidence, points out knowledge gaps, and suggests useful questions. The graph and detailed
reading views remain available when you want to inspect relationships and source files.

Relationship clues are suggestions only. They do not become official relationships until you ask
to review and save them.

Unlike whole-codebase graph tools such as Graphify, this plugin does not scan and copy an entire
code structure into a graph. It recalls a smaller set of reviewed decisions, conclusions,
workflows, pitfalls, and evidence that should survive between Codex tasks.

## Requirements

- Codex with local plugin and Skill support
- Node.js 22.13 or newer available to Codex
- pnpm 10.30.2 for installation from source

## Install From This Repository

To install directly from the public GitHub marketplace:

```bash
codex plugin marketplace add WangXueZhi/codex-project-memory --ref main
codex plugin add codex-project-memory@codex-project-memory
```

Restart Codex and start a new task after installation.

For local development from a cloned checkout:

```bash
git clone https://github.com/WangXueZhi/codex-project-memory.git
cd codex-project-memory
pnpm install --frozen-lockfile
pnpm build
codex plugin marketplace add "$PWD"
codex plugin add codex-project-memory@codex-project-memory
```

Invoke `@codex-project-memory` explicitly, or ask Codex to detect and recall memory for the current
project.

## First Use

1. Ask Codex to detect the current project.
2. Check the detected root and Git/worktree information.
3. Confirm registration to create a private local project ID.
4. Optionally ask for the managed `AGENTS.md` binding snippet so future tasks load the Skill more
   consistently.
5. Complete a useful task and review the memory save result at the end.
6. Ask to "view the project knowledge graph" when you want the guide and offline HTML workspace.

To let project B read project A, register both projects and approve a one-way `B -> A` link. This
does not let A read B, and neither project can write to the other.

## Where Your Data Lives

The private file store defaults to:

```text
${CODEX_HOME:-~/.codex}/project-memory/v1/
```

Its main files are:

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

In plain language:

- `MEMORY.md` contains approved memories and their source references.
- `RELATIONS.json` contains reviewed connections between memories.
- `KNOWLEDGE_GRAPH.html` is a generated, read-only snapshot for browsing.
- Proposal files hold items waiting to be accepted or rejected.
- `audit.jsonl` records important memory operations.

Nothing is written into a registered project. Set `CODEX_PROJECT_MEMORY_HOME` to use a separate
data directory for development or testing. An optional `config.json` can block additional paths:

```json
{
  "denyPatterns": ["private/**", "**/*.secret"]
}
```

## What This Project Does Not Do

- It does not synchronize memory between computers or team members.
- It does not edit memories through the HTML workspace; the page is read-only.
- It does not scan the project continuously or create memories in the background.
- It does not use embeddings or a persistent search index; token-aware recall is deterministic
  lexical ranking and cannot provide complete semantic understanding.
- It does not automatically trust relationship clues. Only reviewed formal one-hop relations may
  add a bounded ranking signal.
- It does not automatically import old `memory.sqlite3` files from early development versions.
- It does not guarantee manual review when structured interaction is unavailable; in that case the
  configured automatic fallback saves every proposed item and clearly reports it.

These limits keep the plugin local, understandable, and easy to remove.

## Development

```bash
pnpm install
pnpm check
pnpm test:visual
```

The distributable plugin lives in `plugins/codex-project-memory`. `pnpm build` bundles the Skill
CLI, Stop Hook, and offline browser assets. Generated knowledge graph pages contain everything they
need in one local file and make no runtime network requests.

See [Architecture](docs/architecture.md), [Security](SECURITY.md),
[Privacy](PRIVACY.md), [Terms](TERMS.md), [Support](SUPPORT.md), and
[Contributing](CONTRIBUTING.md) for more information.

## License

Apache License 2.0. See [LICENSE](LICENSE).
