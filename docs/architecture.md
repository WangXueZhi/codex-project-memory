# Architecture

## Components

The repository is a Codex marketplace containing one self-contained plugin. The plugin bundles a
concise Skill, a local CLI, and a Stop Hook. The CLI owns deterministic storage and access checks;
the Skill owns the interactive-or-automatic completion policy. No MCP server is required.

## Project Identity

Registration starts from a canonical filesystem path. Git repositories also record their worktree common directory, origin URL, and current commit as relocation hints. A new path that resembles an existing project is returned as a candidate and is never merged without confirmation.

## Storage

All plugin state lives outside registered projects under `CODEX_HOME/project-memory/v1`. A global
`registry.json` records project locations and `links.json` records directional read access. Each
project has a private directory containing `project.json`, approved `MEMORY.md`, pending or reviewed
proposal JSON files, reviewed `RELATIONS.json` graph edges, and an append-only `audit.jsonl`.

Approved memory content is stored in Markdown with structured JSON front matter. Memory document
v2 adds optional summaries, topics, and multiple validated citations; v1 remains readable and is
rewritten only after an accepted memory or enrichment commit. Writes use a
private temporary file followed by an atomic rename. Directories use mode `0700` and state files use
mode `0600` where the platform supports POSIX permissions.

Memory proposals and active memory remain intentionally separate. The Skill's `propose` command
writes a pending proposal file. When structured user input is available, `commit` or `reject`
follows the user's choice. Proposals can create memories, enrich an existing local memory's
summary/topic/citations, and create relationships. When structured input is unavailable, the Skill
commits every proposal item as an explicit automatic fallback. Search reads the Markdown files
directly and does not maintain a database index.

## Knowledge Graph

Each approved memory UUID is a graph node. Typed edges are stored in the owning project's
`RELATIONS.json`; missing relation files are treated as empty for backward compatibility. Supported
edge types are related, depends on, supports, contradicts, supersedes, and derived from. Related and
contradicts are symmetric; the other types are directed.

Relationship candidates share the memory proposal lifecycle. They may refer to existing memory IDs
or stable candidate refs in the same proposal. They follow interactive selection when available and
the save-all fallback otherwise.
Normal memory loading and text search remain unchanged. The read-only `guide` analysis reports
topics, formal connected components, isolated memories, evidence coverage, stale sources,
highlights, suggested questions, and deterministic relationship clues. Clues are same-project
`related_to` suggestions based only on reviewed metadata: shared citations, matching topics, and
rare shared tags. Ubiquitous citations and tags are excluded; existing formal endpoint pairs are
suppressed. Clues are never stored, counted as formal relations, or used by traversal until the user
explicitly converts selected clues through the existing proposal review flow.

Neighbor, shortest-path, and bounded graph queries are explicit and can render JSON, Mermaid,
grouped Markdown, or a private standalone HTML snapshot. The HTML workspace uses a build-time
bundled Preact application and Cytoscape renderer.
FCoSE provides the default force-directed immersive network while Dagre remains available as the
hierarchical reading layout. JavaScript and CSS are embedded into the generated file with CSP
content hashes; the page has no CDN, network request, server, or runtime plugin-resource dependency.

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

Cross-project edges are owned by the current project, require at least one local endpoint, and are
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
