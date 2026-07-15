import type { GraphGuide, GraphRelationSuggestion } from "../types.js";

export type MemoryKind =
  | "architecture"
  | "decision"
  | "workflow"
  | "convention"
  | "pitfall"
  | "status";

export type Confidence = "observed" | "verified" | "inferred";
export type CitationRole = "evidence" | "report" | "workflow" | "reference";
export type RelationType =
  | "related_to"
  | "depends_on"
  | "supports"
  | "contradicts"
  | "supersedes"
  | "derived_from";

export interface BrowserCitation {
  sourceProjectId: string;
  sourceProjectName: string;
  sourcePath: string;
  role: CitationRole;
  locator: string | null;
  note: string | null;
  sourceCommit: string | null;
  stale: boolean;
  staleReason: string | null;
  accessible: boolean;
  fileUrl: string | null;
}

export interface BrowserMemory {
  id: string;
  projectId: string;
  projectName: string;
  kind: MemoryKind;
  title: string;
  summary: string | null;
  topic: string | null;
  content: string;
  tags: string[];
  citations: BrowserCitation[];
  confidence: Confidence;
  updatedAt: string;
  stale: boolean;
  staleReason: string | null;
}

export interface BrowserRelation {
  id: string;
  fromMemoryId: string;
  toMemoryId: string;
  type: RelationType;
  rationale: string;
  confidence: Confidence;
}

export interface GraphViewData {
  projectName: string;
  generatedAt: string;
  memories: BrowserMemory[];
  relations: BrowserRelation[];
  guide: GraphGuide;
}

export type BrowserGraphGuide = GraphGuide;
export type BrowserRelationSuggestion = GraphRelationSuggestion;

export type StaleFilter = "all" | "active" | "stale";
export type FocusDepth = "all" | "1" | "2";

export interface GraphFilters {
  topic: string;
  kind: string;
  relation: string;
  stale: StaleFilter;
  focusDepth: FocusDepth;
}

export type GraphSelection =
  | { type: "memory"; id: string }
  | { type: "citation"; id: string; memoryId: string; citationIndex: number }
  | { type: "relation"; id: string }
  | { type: "suggestion"; id: string }
  | null;

export interface GraphElement {
  group: "nodes" | "edges";
  data: Record<string, string | number | boolean>;
  classes?: string;
}
