export const MEMORY_KINDS = [
  "architecture",
  "decision",
  "workflow",
  "convention",
  "pitfall",
  "status",
] as const;

export type MemoryKind = (typeof MEMORY_KINDS)[number];
export type Confidence = "observed" | "verified" | "inferred";

export const CITATION_ROLES = ["evidence", "report", "workflow", "reference"] as const;
export type CitationRole = (typeof CITATION_ROLES)[number];

export interface MemoryCitationCandidate {
  sourceProjectId?: string;
  sourcePath: string;
  role: CitationRole;
  locator?: string;
  note?: string;
}

export interface MemoryCitationRecord {
  sourceProjectId: string;
  sourceProjectName: string;
  sourcePath: string;
  role: CitationRole;
  locator: string | null;
  note: string | null;
  sourceCommit: string | null;
  sourceFileHash: string;
  stale: boolean;
  staleReason: string | null;
  accessible: boolean;
  fileUrl: string | null;
}

export const RELATION_TYPES = [
  "related_to",
  "depends_on",
  "supports",
  "contradicts",
  "supersedes",
  "derived_from",
] as const;

export type RelationType = (typeof RELATION_TYPES)[number];
export type RelationDirection = "in" | "out" | "both";

export interface ProjectRecord {
  id: string;
  name: string;
  primaryPath: string;
  isGit: boolean;
  gitCommonDir: string | null;
  remoteUrl: string | null;
  headCommit: string | null;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string;
}

export interface DetectedProject {
  requestedPath: string;
  rootPath: string;
  name: string;
  isGit: boolean;
  gitCommonDir: string | null;
  remoteUrl: string | null;
  headCommit: string | null;
  registeredProject: ProjectRecord | null;
  relocationCandidates: ProjectRecord[];
}

export interface MemoryCandidate {
  ref?: string;
  kind: MemoryKind;
  title: string;
  summary?: string;
  topic?: string;
  content: string;
  tags?: string[];
  sourceProjectId?: string;
  sourcePath?: string;
  citations?: MemoryCitationCandidate[];
  confidence?: Confidence;
}

export interface MemoryUpdateCandidate {
  memoryId: string;
  summary?: string;
  topic?: string;
  citations?: MemoryCitationCandidate[];
}

export type RelationEndpointCandidate =
  | { memoryId: string; candidateRef?: never }
  | { candidateRef: string; memoryId?: never };

export interface MemoryRelationCandidate {
  from: RelationEndpointCandidate;
  to: RelationEndpointCandidate;
  type: RelationType;
  rationale: string;
  confidence?: Confidence;
}

export interface MemoryRecord {
  id: string;
  projectId: string;
  projectName: string;
  kind: MemoryKind;
  title: string;
  summary: string | null;
  topic: string | null;
  content: string;
  tags: string[];
  sourceProjectId: string | null;
  sourcePath: string | null;
  sourceCommit: string | null;
  sourceFileHash: string | null;
  citations: MemoryCitationRecord[];
  confidence: Confidence;
  status: "active";
  createdAt: string;
  updatedAt: string;
  stale: boolean;
  staleReason: string | null;
}

export interface ProposalItem {
  id: string;
  proposalId: string;
  candidate: MemoryCandidate;
  status: "pending" | "accepted" | "rejected";
}

export interface RelationProposalItem {
  id: string;
  proposalId: string;
  candidate: MemoryRelationCandidate;
  status: "pending" | "accepted" | "rejected";
  rejectionReason: string | null;
}

export interface MemoryUpdateProposalItem {
  id: string;
  proposalId: string;
  candidate: MemoryUpdateCandidate;
  status: "pending" | "accepted" | "rejected";
  rejectionReason: string | null;
}

export interface ProposalRecord {
  id: string;
  projectId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  reviewedAt: string | null;
  items: ProposalItem[];
  updateItems: MemoryUpdateProposalItem[];
  relationItems: RelationProposalItem[];
}

export interface MemoryRelationRecord {
  id: string;
  ownerProjectId: string;
  fromMemoryId: string;
  fromProjectId: string;
  toMemoryId: string;
  toProjectId: string;
  type: RelationType;
  rationale: string;
  confidence: Confidence;
  sourceProposalId: string;
  status: "active";
  createdAt: string;
  updatedAt: string;
}

export interface RelationView extends MemoryRelationRecord {
  fromMemory: MemoryRecord;
  toMemory: MemoryRecord;
  suspended: boolean;
  stale: boolean;
}

export type GraphHighlightKind = "connected" | "evidence" | "recent";
export type GraphGapKind = "isolated" | "stale_memory" | "stale_citation";
export type RelationSuggestionSignalKind = "shared_citation" | "same_topic" | "shared_tag";

export interface GraphGuideSummary {
  memoryCount: number;
  formalRelationCount: number;
  citationCount: number;
  staleMemoryCount: number;
  staleCitationCount: number;
  componentCount: number;
  isolatedCount: number;
}

export interface GraphGuideTopic {
  name: string;
  memoryIds: string[];
  memoryCount: number;
  staleCount: number;
}

export interface GraphHighlight {
  id: string;
  kind: GraphHighlightKind;
  memoryId: string;
  title: string;
  reason: string;
  value: number | string;
}

export interface GraphGap {
  id: string;
  kind: GraphGapKind;
  memoryIds: string[];
  message: string;
}

export interface RelationSuggestionSignal {
  kind: RelationSuggestionSignalKind;
  key: string;
  label: string;
  weight: number;
  role?: CitationRole;
  sourceProjectId?: string;
  sourcePath?: string;
}

export interface GraphRelationSuggestion {
  id: string;
  projectId: string;
  fromMemoryId: string;
  toMemoryId: string;
  type: "related_to";
  rationale: string;
  score: number;
  signals: RelationSuggestionSignal[];
}

export interface GraphSuggestedQuestion {
  id: string;
  question: string;
  why: string;
  memoryIds: string[];
}

export interface GraphGuide {
  projectId: string;
  projectName: string;
  generatedAt: string;
  summary: GraphGuideSummary;
  topics: GraphGuideTopic[];
  highlights: GraphHighlight[];
  gaps: GraphGap[];
  suggestedQuestions: GraphSuggestedQuestion[];
  relationSuggestions: GraphRelationSuggestion[];
}

export interface FileSearchResult {
  path: string;
  line: number;
  excerpt: string;
  commit: string | null;
  fileHash: string;
}

export interface ReadFileResult {
  path: string;
  content: string;
  truncated: boolean;
  size: number;
  commit: string | null;
  fileHash: string;
}
