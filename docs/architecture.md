# Architecture

English | [简体中文](architecture.zh-CN.md)

This document explains how the plugin works internally. The short version is:

1. The **Skill** tells Codex when to recall memory within a token budget and how to ask about saving it.
2. The **CLI** reads and writes the local files and enforces access rules.
3. The **Stop Hook** checks that a finished task did not leave a save proposal unresolved.
4. The **offline browser** turns saved memories into a guide, graph, and reading view.

All four parts run locally. They do not need a database server, MCP server, or cloud service.

## Components

The repository is a Codex marketplace containing one self-contained plugin. The Skill describes
the workflow in plain instructions for Codex. The CLI performs predictable file operations and
security checks. The Stop Hook runs when a tool-using task is about to finish and makes sure the
memory save decision was handled. No MCP server is required.

## Project Identity

Registration starts from the real, normalized project path. For Git repositories, the plugin also
records the shared worktree directory, remote URL, and current commit. These values help recognize
a project after it moves or when it is opened through another worktree. A similar path is only
shown as a possible match; the plugin never merges it with an existing project without approval.

## Storage

All plugin state lives outside registered projects under `CODEX_HOME/project-memory/v1`. A global
`registry.json` records project locations and `links.json` records directional read access. Each
project has a private directory containing `project.json`, approved `MEMORY.md`, pending or reviewed
proposal JSON files, reviewed `RELATIONS.json` graph edges, and an append-only `audit.jsonl`.

Approved memory content is stored in Markdown with a small structured JSON header. Memory document
v2 adds optional summaries, topics, and multiple validated citations; v1 remains readable and is
rewritten only after an accepted memory or enrichment commit. Writes use a
private temporary file followed by a single replacement operation, so an interrupted write is less
likely to leave half a file. Directories use mode `0700` and state files use mode `0600` on systems
that support POSIX permissions, which means only the current user can access them.

Memory proposals and active memory remain intentionally separate. The Skill's `propose` command
writes a pending proposal file. When structured user input is available, `commit` or `reject`
follows the user's choice. Proposals can create memories, enrich an existing local memory's
summary/topic/citations, and create relationships. When structured input is unavailable, the Skill
commits every proposal item as an explicit automatic fallback. Search reads the Markdown files
directly and does not maintain a database index.

## Token-Aware Retrieval

Normal task startup uses two explicit, read-only stages. `recall` ranks the current project's
memories in memory and returns compact candidates without full content or full citations. It uses
weighted BM25-style lexical signals across title, summary, topic, tags, content, and citation
metadata. Chinese runs contribute phrases and overlapping two-character fragments; English,
numbers, and paths contribute normalized word tokens. Confidence, staleness, linked-project scope,
and reviewed one-hop relations apply bounded deterministic multipliers. Display-only relation
clues never affect retrieval.

`get` then reads only the recommended IDs and returns full content with compact citation fields.
The default planning budget is 800 estimated tokens for `recall` plus 1700 for `get`. Ten percent
of each command budget is reserved for the JSON envelope. A memory that does not fit is omitted
whole rather than truncating its content. Estimates use a model-independent CJK/non-CJK character
approximation and are not billing tokens or exact model tokenizer output.

Both commands read `MEMORY.md` and `RELATIONS.json` directly, build no persistent index, make no
network request, and do not write queries to proposals or audit logs. Linked-project memories enter
the candidate set only while an explicit read link exists. `load` and `search` remain available and
unchanged for compatibility and explicit full inspection.

## Knowledge Graph

Each approved memory is a graph node. A node is simply one saved memory. An edge is a reviewed
relationship between two memories. These edges are stored in the owning project's
`RELATIONS.json`; missing relation files are treated as empty for backward compatibility. Supported
edge types are related, depends on, supports, contradicts, supersedes, and derived from. Related and
contradicts work in both directions; the other types have a clear from/to direction.

Relationship candidates share the memory proposal lifecycle. They may refer to existing memory IDs
or stable candidate refs in the same proposal. They follow interactive selection when available and
the save-all fallback otherwise.
Normal memory loading and text search remain unchanged. The read-only `guide` analysis reports
topics, groups that are connected by reviewed relationships, memories with no relationships,
evidence coverage, stale sources,
highlights, suggested questions, and deterministic relationship clues. Clues are same-project
`related_to` suggestions based only on reviewed metadata: shared citations, matching topics, and
rare shared tags. Ubiquitous citations and tags are excluded; existing formal endpoint pairs are
suppressed. Clues are never stored, counted as formal relations, or used by traversal until the user
explicitly converts selected clues through the existing proposal review flow.

Neighbor, shortest-path, and bounded graph queries are explicit and can render JSON, Mermaid,
grouped Markdown, or a private standalone HTML snapshot. The HTML workspace uses Preact for the
interface and Cytoscape for the graph. Both are bundled during the build.
FCoSE arranges related memories into natural clusters, while Dagre arranges them in a top-to-bottom
reading order. JavaScript and CSS are embedded in the generated file. A Content Security Policy
(CSP) allows only the embedded code whose hash matches the generated page. The page has no CDN,
network request, server, or runtime plugin-resource dependency.

The browser starts in a guide-first research workspace with project metrics, recommended reading,
topic paths, evidence status, gaps, suggested questions, and pending relation clues. The optional
dark graph uses point-shaped, topic-colored memory nodes, typed neon formal relations, subdued
dashed clue edges, a compact topic rail, and a collapsible inspector. Motion is limited to
low-frequency focus pulses and can be paused; reduced-motion preferences disable it. User drag
positions persist until the graph is explicitly laid out again or the static snapshot is reloaded.

Source citations are not stored as relation records. The HTML renderer derives optional evidence,
report, workflow, and reference nodes from memory metadata and connects them with dotted display
edges only when the selected memory is expanded. Invisible layout-only edges keep disconnected
memories readable and never enter relation counts, traversal, storage, or exported graph data.

Cross-project relationships are owned by the current project, require at least one memory from that
project, and are
visible only while the existing directional project link grants read access to every foreign
endpoint. Removing a project link suspends those edges without deleting them.

## Task Completion Check

The bundled Stop Hook runs after tool-using turns in registered projects. A pending proposal is not
a valid completion state. The Hook requires an interactive commit/reject receipt, an automatic-save
fallback receipt, or an explicit no-update receipt. If none is present, it requests one continuation
so Codex resolves the proposal instead of finishing silently. The Hook calls the same file-store
code as the Skill CLI and does not depend on MCP availability.

## Cross-Project Reads

A link from B to A permits B to search A's saved memory and read allowed text files in A. The reverse direction is not implied. Every file request is canonicalized, checked against the target root, evaluated against built-in and user deny patterns, and rejected if it escapes through a symlink.

## Staleness

Memories may cite up to twelve source files across the current or authorized linked projects. The
plugin stores each source commit and SHA-256 file hash. Retrieval recomputes every hash; changed,
unavailable, or no-longer-authorized sources are reported individually rather than silently trusted.

## Non-Goals

Cloud sync, shared team memory, encryption at rest, a graphical management UI, embeddings,
automatic relationship activation, automatic Git changes, and background memory extraction are
intentionally excluded.
