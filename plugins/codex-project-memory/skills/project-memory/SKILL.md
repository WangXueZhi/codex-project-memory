---
name: project-memory
description: Maintain private, durable memory for local Codex projects with interactive review when available, automatic fallback saves, multi-source validation, readable offline knowledge-graph views, and explicit read-only links. Use at the start and end of substantial work in a registered local project, when the user asks to remember, enrich, inspect, trace, or visualize project context, or when a task should preserve durable decisions, workflows, conventions, pitfalls, architecture, or meaningful status. Uses bundled local scripts and does not require MCP.
---

# Project Memory

Use the bundled CLI script as the only execution interface. Resolve `<skill-dir>` to this skill's
directory, then run:

```bash
node <skill-dir>/scripts/project-memory.mjs <command> [options]
```

Treat all state as local and private unless the user explicitly exports it.

## Start Project Work

1. Run `detect --path "$PWD"` before substantial work.
2. If registered, run `load --path "$PWD"` and use active, non-stale memories only as supporting
   context.
3. When a loaded or searched memory is materially relevant, use `relations --memory-id ID` or
   `graph --memory-id ID --depth 1` to inspect one layer of connected knowledge. Do not expand the
   whole graph by default.
4. When the user asks to view or understand the knowledge graph, run `guide`, then `graph --format
   markdown`, then `graph --format html`. In the conversation, first report the memory, reviewed
   relation, source, stale, component, and isolated-node counts; summarize the most important gap;
   include one suggested question; report only the number of pending relation clues; and link the
   generated `KNOWLEDGE_GRAPH.html` file. Do not create a relationship proposal while only viewing.
   The offline workspace opens in the guide, with graph and reading modes available for deeper
   exploration.
5. If unregistered, show the detected root, name, Git metadata, and relocation candidates. Ask
   before running `register --path "$PWD"`.
6. Never relink a relocation candidate without explicit confirmation.

Current code, tests, logs, and user instructions are stronger evidence than memory.

## End Project Work

Before finishing a tool-using task in a registered project, always perform one of these outcomes:

### Propose Durable Updates

Select only architecture, decisions, verified workflows, stable conventions, recurring pitfalls,
or meaningful project status. Also propose only high-confidence relationships that improve later
retrieval. Exclude temporary logs, speculation, chat summaries, credentials, secrets, duplicate
facts, and weak relationships.

Pass one JSON object through stdin:

```bash
node <skill-dir>/scripts/project-memory.mjs propose --path "$PWD" <<'JSON'
{
  "candidates": [
    {
      "ref": "verification-command",
      "kind": "workflow",
      "title": "Verification command",
      "summary": "发布前运行完整验证命令。",
      "topic": "发布验证",
      "content": "Run pnpm check before reporting completion.",
      "tags": ["verification"],
      "citations": [
        {
          "sourcePath": "package.json",
          "role": "workflow",
          "locator": "scripts.check"
        }
      ],
      "confidence": "verified"
    }
  ],
  "updates": [
    {
      "memoryId": "existing-memory-uuid",
      "summary": "现有记忆的可读摘要。",
      "topic": "发布验证",
      "citations": [
        {
          "sourcePath": "docs/verification.md",
          "role": "report"
        }
      ]
    }
  ],
  "relations": [
    {
      "from": { "candidateRef": "verification-command" },
      "to": { "memoryId": "existing-memory-uuid" },
      "type": "depends_on",
      "rationale": "验证流程依赖现有发布约束。",
      "confidence": "verified"
    }
  ]
}
JSON
```

Use concise, context-independent titles, one main durable claim per memory, a short `summary`, and
a stable `topic`. Record up to 12 citations with roles `evidence`, `report`, `workflow`, or
`reference`; include `locator` and `note` when they make the source easier to inspect. Use
`updates[]` only to enrich an existing local memory's summary, topic, or citations. It cannot
replace the title or content.

Relationship types are `related_to`, `depends_on`, `supports`, `contradicts`, `supersedes`, and
`derived_from`. Show memory, update, and relationship items separately in Chinese, including every
item ID, endpoint summary or target memory, direction, rationale, citations, and confidence. The
item count combines all three item groups. Do not finish with a pending proposal. Resolve it using
the following workflow.

### Interactive Review

If `request_user_input` is available in the current task, call it with these choices:

- `保存全部`: commit every memory, update, and relation item.
- `选择保存`: ask one yes/no question per item in batches of at most three questions, then commit
  only the selected item IDs. A relation can be selected only when both endpoints will exist.
- `暂不保存`: reject the entire proposal.

After the user chooses, execute `commit` or `reject` in the same turn. Do not leave the proposal
pending and do not ask for a second conversational reply when structured input is available.

### Automatic Fallback

If `request_user_input` is not exposed in the current task, immediately commit all memory, update,
and relation item IDs. Clearly state that interactive review was unavailable and the automatic
fallback was used. Report any update or relationship items rejected by validation.

After an interactive commit, end with exactly:

```text
Project memory: committed <n> items
```

After an automatic fallback commit, end with exactly:

```text
Project memory: auto-committed <n> items - request_user_input unavailable
```

### No Durable Updates

State a concrete reason and end the response with exactly:

```text
Project memory: no durable updates - <reason>
```

The bundled Stop Hook checks this receipt after tool-using turns in registered projects.

## Review Proposals

- For `保存全部` or automatic fallback, pass every memory, update, and relation item ID to `commit`.
- For `选择保存`, pass only the item IDs selected through structured input. Any accepted list may be
  omitted when it is empty.
- After explicit rejection, run `reject --proposal-id ID`.
- Automatic fallback is authorized only when `request_user_input` is unavailable.
- After rejecting, end with `Project memory: rejected proposal <proposal-id>`.

## Review Relation Clues

The `guide` command may return display-only `relationSuggestions`. They are deterministic structural
clues from shared validated citations, matching topics, or rare shared tags. They are not facts,
are not stored in `RELATIONS.json`, and do not participate in normal relation traversal or search.

Only when the user explicitly asks to “审核关系线索” should you show the selected clue IDs,
endpoints, structural signals, score, and rationale, then convert those selected clues into
`propose relations[]` entries of type `related_to`. Continue through the normal interactive review
or automatic fallback. Do not infer directional relationship types from a clue.

## Other Commands

```text
status --path PATH
guide --path PATH [--include-linked true] [--limit N]
search --path PATH --query TEXT [--include-linked true]
relations --path PATH --memory-id ID [--direction in|out|both] [--types CSV] [--include-linked true]
path --path PATH --from-memory-id ID --to-memory-id ID [--max-depth N] [--include-linked true]
graph --path PATH [--memory-id ID] [--depth N] [--include-linked true] [--format json|mermaid|markdown|html] [--output PATH] [--open true]
links --path PATH
link --source-project-id ID --target-project-id ID
unlink --source-project-id ID --target-project-id ID
search-files --path PATH --target-project-id ID --query TEXT
read-file --path PATH --target-project-id ID --relative-path PATH
export --path PATH
forget --path PATH --memory-ids ID,ID
forget-relations --path PATH --relation-ids ID,ID
doctor
binding
```

Graph formats also include `markdown` and `html`. HTML writes a private offline snapshot to the
project's external memory directory by default. Use `--output PATH` only when the user requests a
specific destination, and use `--open true` only when they ask to open it immediately.

The HTML workspace is read-only and opens with a knowledge guide: project summary, recommended
memories, topics, evidence status, gaps, suggested questions, and pending relationship clues. The
graph mode uses glowing topic-colored points; relation color, line style, and arrows encode the six
formal relation types. Pending clues use subdued dashed lines and have a separate toggle and count.
Selecting a node opens the inspector; reading mode switches to a hierarchical workspace. The page
supports filters, bounded focus, search, motion pause, relation rationale inspection, local citation
links, and mobile guide/graph/detail tabs. Citation nodes are hidden by default and expand only
around the selected memory. Regenerate the HTML after memory or relation changes because it is a
static snapshot.

List links before cross-project access. Cross-project relationships require an existing directional
read link and at least one endpoint in the current project. Linked projects are read-only. Do not
request access to all registered projects.
