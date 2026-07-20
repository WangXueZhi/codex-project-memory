import path, { basename } from "node:path";
import { pathToFileURL } from "node:url";
import { ProjectMemoryError } from "./errors.js";
import { detectGitMetadata, type GitMetadata } from "./git.js";
import { analyzeKnowledgeGraph } from "./guide.js";
import { loadLocalConfig } from "./paths.js";
import { buildGetResult, buildRecallResult } from "./retrieval.js";
import { assertNoSecret, readProjectFile, searchProjectFiles } from "./security.js";
import type {
  MemoryStore,
  PreparedCandidate,
  PreparedCitation,
  PreparedRelationCandidate,
  PreparedUpdateCandidate,
  ProposalCommitResult,
} from "./store.js";
import {
  CITATION_ROLES,
  type DetectedProject,
  type GetMemoriesResult,
  type GraphGuide,
  MEMORY_KINDS,
  type MemoryCandidate,
  type MemoryCitationCandidate,
  type MemoryCitationRecord,
  type MemoryRecord,
  type MemoryRelationCandidate,
  type MemoryRelationRecord,
  type MemoryUpdateCandidate,
  type ProjectRecord,
  RELATION_TYPES,
  type RecallResult,
  type RelationDirection,
  type RelationType,
  type RelationView,
} from "./types.js";
import { type KnowledgeGraph, renderGraphHtml, renderGraphMarkdown } from "./view.js";

const MAX_CANDIDATES = 20;
const MAX_UPDATE_CANDIDATES = 20;
const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 5000;
const MAX_SUMMARY_LENGTH = 300;
const MAX_TOPIC_LENGTH = 120;
const MAX_CITATIONS = 12;
const MAX_CITATION_LOCATOR_LENGTH = 240;
const MAX_CITATION_NOTE_LENGTH = 500;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 50;
const MAX_RELATION_CANDIDATES = 40;
const MAX_RELATION_RATIONALE_LENGTH = 1000;
const MAX_GRAPH_NODES = 100;
const MAX_GRAPH_DEPTH = 5;
const MAX_PATH_DEPTH = 8;
const MAX_RECALL_LIMIT = 20;
const MAX_RECALL_RECOMMEND = 5;
const MAX_RETRIEVAL_BUDGET = 16000;
const MAX_GET_MEMORY_IDS = 20;

const SYMMETRIC_RELATION_TYPES = new Set<RelationType>(["related_to", "contradicts"]);
const RELATION_LABELS: Record<RelationType, string> = {
  related_to: "相关",
  depends_on: "依赖",
  supports: "支持",
  contradicts: "矛盾",
  supersedes: "替代",
  derived_from: "来源于",
};

export class ProjectMemoryService {
  private readonly denyPatterns: string[];

  constructor(
    readonly store: MemoryStore,
    dataDir: string,
  ) {
    this.denyPatterns = loadLocalConfig(dataDir).denyPatterns;
  }

  detectProject(inputPath: string): DetectedProject {
    let metadata: GitMetadata;
    try {
      metadata = detectGitMetadata(inputPath);
    } catch (error) {
      throw new ProjectMemoryError("INVALID_INPUT", "Project path cannot be resolved.", {
        path: inputPath,
        cause: error instanceof Error ? error.message : String(error),
      });
    }

    const registeredProject = this.store.getProjectByPath(metadata.rootPath);
    const relocationCandidates = registeredProject
      ? []
      : this.store
          .findRelocationCandidates(metadata.gitCommonDir, metadata.remoteUrl)
          .filter((project) => project.primaryPath !== metadata.rootPath);

    return {
      requestedPath: inputPath,
      rootPath: metadata.rootPath,
      name: basename(metadata.rootPath),
      isGit: metadata.isGit,
      gitCommonDir: metadata.gitCommonDir,
      remoteUrl: metadata.remoteUrl,
      headCommit: metadata.headCommit,
      registeredProject: registeredProject
        ? (this.store.getProject(registeredProject.id) as ProjectRecord)
        : null,
      relocationCandidates,
    };
  }

  registerProject(inputPath: string, name?: string, relinkProjectId?: string): ProjectRecord {
    const detected = this.detectProject(inputPath);
    if (detected.registeredProject) {
      this.store.touchProject(
        detected.registeredProject.id,
        detected.rootPath,
        detected.headCommit,
      );
      return this.store.getProject(detected.registeredProject.id) as ProjectRecord;
    }
    if (detected.relocationCandidates.length > 0 && !relinkProjectId) {
      throw new ProjectMemoryError(
        "RELINK_CONFIRMATION_REQUIRED",
        "This path resembles an existing project. Confirm whether it should be relinked.",
        { candidates: detected.relocationCandidates },
      );
    }
    if (
      relinkProjectId &&
      !detected.relocationCandidates.some((candidate) => candidate.id === relinkProjectId)
    ) {
      throw new ProjectMemoryError("INVALID_INPUT", "Relink target is not a detected candidate.", {
        relinkProjectId,
      });
    }
    const projectName = (name ?? detected.name).trim();
    if (!projectName || projectName.length > 120) {
      throw new ProjectMemoryError("INVALID_INPUT", "Project name must be 1-120 characters.");
    }
    return this.store.registerProject({
      name: projectName,
      primaryPath: detected.rootPath,
      isGit: detected.isGit,
      gitCommonDir: detected.gitCommonDir,
      remoteUrl: detected.remoteUrl,
      headCommit: detected.headCommit,
      ...(relinkProjectId ? { relinkProjectId } : {}),
    });
  }

  projectStatus(projectId: string): Record<string, unknown> {
    const project = this.store.requireProject(projectId);
    const memories = this.getContext(projectId, 1000);
    let current: DetectedProject | null = null;
    try {
      current = this.detectProject(project.primaryPath);
    } catch {
      current = null;
    }
    return {
      project: this.store.getProject(projectId),
      links: this.store.listLinks(projectId),
      pathAvailable: current !== null,
      currentDetection: current,
      pendingProposals: this.store.countPendingProposals(projectId),
      memoryCount: memories.length,
      lastMemoryUpdatedAt: memories[0]?.updatedAt ?? null,
    };
  }

  linkProjects(sourceProjectId: string, targetProjectId: string): Record<string, unknown> {
    this.store.linkProjects(sourceProjectId, targetProjectId);
    return { sourceProjectId, targetProjectId, access: "read" };
  }

  unlinkProjects(sourceProjectId: string, targetProjectId: string): Record<string, unknown> {
    this.store.unlinkProjects(sourceProjectId, targetProjectId);
    return { sourceProjectId, targetProjectId, removed: true };
  }

  private requireReadAccess(sourceProjectId: string, targetProjectId: string): void {
    this.store.requireProject(sourceProjectId);
    this.store.requireProject(targetProjectId);
    if (!this.store.hasReadAccess(sourceProjectId, targetProjectId)) {
      throw new ProjectMemoryError(
        "LINK_REQUIRED",
        "A read-only project link is required before cross-project access.",
        { sourceProjectId, targetProjectId },
      );
    }
  }

  private enrichStaleness(memory: MemoryRecord): MemoryRecord {
    const storedCitations =
      memory.citations.length > 0 ? memory.citations : this.legacyCitation(memory);
    if (storedCitations.length === 0) return memory;
    const citations = storedCitations.map((citation) =>
      this.enrichCitation(memory.projectId, citation),
    );
    const staleCitation = citations.find((citation) => citation.stale);
    return {
      ...memory,
      citations,
      stale: Boolean(staleCitation),
      staleReason: staleCitation?.staleReason ?? null,
    };
  }

  private legacyCitation(memory: MemoryRecord): MemoryCitationRecord[] {
    if (!memory.sourceProjectId || !memory.sourcePath || !memory.sourceFileHash) return [];
    return [
      {
        sourceProjectId: memory.sourceProjectId,
        sourceProjectName: "",
        sourcePath: memory.sourcePath,
        role: "reference",
        locator: null,
        note: "由旧版 sourcePath 兼容生成",
        sourceCommit: memory.sourceCommit,
        sourceFileHash: memory.sourceFileHash,
        stale: false,
        staleReason: null,
        accessible: true,
        fileUrl: null,
      },
    ];
  }

  private enrichCitation(projectId: string, citation: MemoryCitationRecord): MemoryCitationRecord {
    const sourceProject = this.store.getProject(citation.sourceProjectId);
    if (!sourceProject) {
      return {
        ...citation,
        sourceProjectName: "未知项目",
        stale: true,
        staleReason: "source_project_missing",
        accessible: false,
        fileUrl: null,
      };
    }
    if (!this.store.hasReadAccess(projectId, citation.sourceProjectId)) {
      return {
        ...citation,
        sourceProjectName: sourceProject.name,
        stale: true,
        staleReason: "source_project_link_missing",
        accessible: false,
        fileUrl: null,
      };
    }
    try {
      const metadata = detectGitMetadata(sourceProject.primaryPath);
      const current = readProjectFile(
        metadata.rootPath,
        citation.sourcePath,
        metadata.headCommit,
        this.denyPatterns,
      );
      const stale = current.fileHash !== citation.sourceFileHash;
      return {
        ...citation,
        sourceProjectName: sourceProject.name,
        stale,
        staleReason: stale ? "source_file_changed" : null,
        accessible: true,
        fileUrl: pathToFileURL(path.resolve(metadata.rootPath, current.path)).href,
      };
    } catch {
      return {
        ...citation,
        sourceProjectName: sourceProject.name,
        stale: true,
        staleReason: "source_file_unavailable",
        accessible: true,
        fileUrl: null,
      };
    }
  }

  getContext(projectId: string, limit = 30): MemoryRecord[] {
    return this.store.getContext(projectId, limit).map((memory) => this.enrichStaleness(memory));
  }

  searchMemory(
    projectId: string,
    query: string,
    includeLinked = false,
    limit = 30,
  ): MemoryRecord[] {
    this.store.requireProject(projectId);
    const projectIds = [projectId];
    if (includeLinked) {
      projectIds.push(...this.store.listLinks(projectId).map((project) => project.id));
    }
    return this.store
      .searchMemories(projectIds, query, limit)
      .map((memory) => this.enrichStaleness(memory));
  }

  recallMemory(
    projectId: string,
    query: string | null,
    recent: boolean,
    includeLinked = false,
    limit = 8,
    recommend = 3,
    budgetTokens = 800,
  ): RecallResult {
    this.store.requireProject(projectId);
    const normalizedQuery = query?.trim() ?? "";
    if (recent === Boolean(normalizedQuery)) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Recall requires exactly one of --query TEXT or --recent true.",
      );
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_RECALL_LIMIT) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Recall limit must be between 1 and ${MAX_RECALL_LIMIT}.`,
      );
    }
    if (!Number.isInteger(recommend) || recommend < 1 || recommend > MAX_RECALL_RECOMMEND) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Recall recommendation count must be between 1 and ${MAX_RECALL_RECOMMEND}.`,
      );
    }
    this.validateRetrievalBudget(budgetTokens);
    const projectIds = [projectId];
    if (includeLinked) {
      projectIds.push(...this.store.listLinks(projectId).map((project) => project.id));
    }
    const memories = projectIds
      .flatMap((visibleProjectId) => this.store.getContext(visibleProjectId, 1000))
      .map((memory) => this.enrichStaleness(memory));
    return buildRecallResult({
      currentProjectId: projectId,
      memories,
      relations: this.visibleRelations(projectId, includeLinked),
      mode: recent ? "recent" : "query",
      query: recent ? null : normalizedQuery,
      limit,
      recommend,
      budgetTokens,
    });
  }

  getMemoriesById(
    projectId: string,
    memoryIds: string[],
    includeLinked = false,
    budgetTokens = 1700,
  ): GetMemoriesResult {
    this.store.requireProject(projectId);
    this.validateRetrievalBudget(budgetTokens);
    const uniqueIds = [...new Set(memoryIds.map((id) => id.trim()).filter(Boolean))];
    if (uniqueIds.length === 0 || uniqueIds.length > MAX_GET_MEMORY_IDS) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Get requires between 1 and ${MAX_GET_MEMORY_IDS} unique memory IDs.`,
      );
    }
    const memories = uniqueIds.map((memoryId) => {
      const memory = this.store.getMemory(memoryId);
      const accessible =
        memory &&
        (memory.projectId === projectId ||
          (includeLinked && this.store.hasReadAccess(projectId, memory.projectId)));
      if (!memory || !accessible) {
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Memory does not exist or is not accessible from this project.",
          { memoryId },
        );
      }
      return this.enrichStaleness(memory);
    });
    return buildGetResult(memories, budgetTokens);
  }

  private validateRetrievalBudget(budgetTokens: number): void {
    if (
      !Number.isInteger(budgetTokens) ||
      budgetTokens < 1 ||
      budgetTokens > MAX_RETRIEVAL_BUDGET
    ) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Retrieval budget must be between 1 and ${MAX_RETRIEVAL_BUDGET} estimated tokens.`,
      );
    }
  }

  private prepareCitations(
    projectId: string,
    citations: MemoryCitationCandidate[],
  ): PreparedCitation[] {
    if (citations.length > MAX_CITATIONS) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `A memory can contain at most ${MAX_CITATIONS} citations.`,
      );
    }
    const prepared = citations.map((citation) => {
      if (!CITATION_ROLES.includes(citation.role)) {
        throw new ProjectMemoryError("INVALID_INPUT", "Unsupported citation role.", {
          role: citation.role,
        });
      }
      const locator = citation.locator?.trim() || null;
      const note = citation.note?.trim() || null;
      if (locator && locator.length > MAX_CITATION_LOCATOR_LENGTH) {
        throw new ProjectMemoryError("INVALID_INPUT", "Citation locator is too long.");
      }
      if (note && note.length > MAX_CITATION_NOTE_LENGTH) {
        throw new ProjectMemoryError("INVALID_INPUT", "Citation note is too long.");
      }
      assertNoSecret(locator ?? "", "citation locator");
      assertNoSecret(note ?? "", "citation note");
      const sourceProjectId = citation.sourceProjectId ?? projectId;
      const sourceProject = this.store.requireProject(sourceProjectId);
      this.requireReadAccess(projectId, sourceProjectId);
      const metadata = detectGitMetadata(sourceProject.primaryPath);
      const source = readProjectFile(
        metadata.rootPath,
        citation.sourcePath,
        metadata.headCommit,
        this.denyPatterns,
      );
      return {
        sourceProjectId,
        sourcePath: source.path,
        role: citation.role,
        locator,
        note,
        sourceCommit: source.commit,
        sourceFileHash: source.fileHash,
      };
    });
    const keys = prepared.map(
      (citation) =>
        `${citation.sourceProjectId}:${citation.sourcePath}:${citation.role}:${citation.locator ?? ""}`,
    );
    if (new Set(keys).size !== keys.length) {
      throw new ProjectMemoryError("INVALID_INPUT", "Duplicate memory citation.");
    }
    return prepared;
  }

  private prepareCandidate(projectId: string, candidate: MemoryCandidate): PreparedCandidate {
    if (!MEMORY_KINDS.includes(candidate.kind)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Unsupported memory kind.", {
        kind: candidate.kind,
      });
    }
    const title = candidate.title.trim();
    const content = candidate.content.trim();
    const summary = candidate.summary?.trim() || null;
    const topic = candidate.topic?.trim() || null;
    const tags = [...new Set((candidate.tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
    if (!title || title.length > MAX_TITLE_LENGTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Title must be 1-${MAX_TITLE_LENGTH} characters.`,
      );
    }
    if (!content || content.length > MAX_CONTENT_LENGTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Content must be 1-${MAX_CONTENT_LENGTH} characters.`,
      );
    }
    if (summary && summary.length > MAX_SUMMARY_LENGTH) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory summary is too long.");
    }
    if (topic && topic.length > MAX_TOPIC_LENGTH) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory topic is too long.");
    }
    if (tags.length > MAX_TAGS || tags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Too many tags or tag is too long.");
    }
    assertNoSecret(title, "memory title");
    assertNoSecret(content, "memory content");
    assertNoSecret(summary ?? "", "memory summary");
    assertNoSecret(topic ?? "", "memory topic");
    assertNoSecret(tags.join(" "), "memory tags");
    const ref = candidate.ref?.trim();
    if (ref && !/^[A-Za-z0-9._:-]{1,80}$/.test(ref)) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Memory candidate ref must use 1-80 letters, numbers, dots, underscores, colons, or hyphens.",
      );
    }

    const sourceProjectId = candidate.sourceProjectId ?? projectId;
    const sourceProject = this.store.requireProject(sourceProjectId);
    this.requireReadAccess(projectId, sourceProjectId);
    let sourceCommit = sourceProject.headCommit;
    let sourceFileHash: string | null = null;
    let sourcePath: string | null = null;

    if (candidate.sourcePath) {
      const metadata = detectGitMetadata(sourceProject.primaryPath);
      const source = readProjectFile(
        metadata.rootPath,
        candidate.sourcePath,
        metadata.headCommit,
        this.denyPatterns,
      );
      sourceCommit = source.commit;
      sourceFileHash = source.fileHash;
      sourcePath = source.path;
    }

    return {
      ...candidate,
      ...(ref ? { ref } : {}),
      title,
      summary,
      topic,
      content,
      tags,
      sourceProjectId,
      sourcePath,
      sourceCommit,
      sourceFileHash,
      citations: this.prepareCitations(projectId, candidate.citations ?? []),
      confidence: candidate.confidence ?? "observed",
    };
  }

  private prepareUpdateCandidate(
    projectId: string,
    candidate: MemoryUpdateCandidate,
  ): PreparedUpdateCandidate {
    const memory = this.store.getMemory(candidate.memoryId);
    if (!memory || memory.projectId !== projectId) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Memory updates can target only an existing memory in the current project.",
        { memoryId: candidate.memoryId },
      );
    }
    if (
      candidate.summary === undefined &&
      candidate.topic === undefined &&
      candidate.citations === undefined
    ) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory update has no enrichment fields.");
    }
    const summary = candidate.summary?.trim();
    const topic = candidate.topic?.trim();
    if (summary !== undefined && (!summary || summary.length > MAX_SUMMARY_LENGTH)) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Memory summary must be non-empty and concise.",
      );
    }
    if (topic !== undefined && (!topic || topic.length > MAX_TOPIC_LENGTH)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory topic must be non-empty and concise.");
    }
    assertNoSecret(summary ?? "", "memory summary");
    assertNoSecret(topic ?? "", "memory topic");
    return {
      memoryId: memory.id,
      ...(summary !== undefined ? { summary } : {}),
      ...(topic !== undefined ? { topic } : {}),
      ...(candidate.citations !== undefined
        ? { citations: this.prepareCitations(projectId, candidate.citations) }
        : {}),
    };
  }

  private prepareRelationCandidate(
    projectId: string,
    candidateRefs: Set<string>,
    candidate: MemoryRelationCandidate,
  ): PreparedRelationCandidate {
    if (!RELATION_TYPES.includes(candidate.type)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Unsupported memory relation type.", {
        type: candidate.type,
      });
    }
    const rationale = candidate.rationale.trim();
    if (!rationale || rationale.length > MAX_RELATION_RATIONALE_LENGTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Relation rationale must be 1-${MAX_RELATION_RATIONALE_LENGTH} characters.`,
      );
    }
    assertNoSecret(rationale, "relation rationale");

    const endpointKey = (endpoint: MemoryRelationCandidate["from"]): string => {
      const memoryId = "memoryId" in endpoint ? endpoint.memoryId : undefined;
      const candidateRef = "candidateRef" in endpoint ? endpoint.candidateRef : undefined;
      if (Boolean(memoryId) === Boolean(candidateRef)) {
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Relation endpoint must contain exactly one of memoryId or candidateRef.",
        );
      }
      if (memoryId) {
        const memory = this.store.getMemory(memoryId);
        if (!memory) {
          throw new ProjectMemoryError(
            "INVALID_INPUT",
            "Relation memory endpoint does not exist.",
            {
              memoryId,
            },
          );
        }
        this.requireReadAccess(projectId, memory.projectId);
        return `memory:${memory.id}`;
      }
      if (!candidateRefs.has(candidateRef as string)) {
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Relation candidateRef must match a unique memory candidate ref in the same proposal.",
          { candidateRef },
        );
      }
      return `candidate:${candidateRef}`;
    };

    const fromKey = endpointKey(candidate.from);
    const toKey = endpointKey(candidate.to);
    if (fromKey === toKey) {
      throw new ProjectMemoryError("INVALID_INPUT", "A memory cannot relate to itself.");
    }
    const endpointProjectId = (endpoint: MemoryRelationCandidate["from"]): string => {
      if ("candidateRef" in endpoint && endpoint.candidateRef) return projectId;
      if (!("memoryId" in endpoint) || !endpoint.memoryId) {
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Relation endpoint must contain memoryId or candidateRef.",
        );
      }
      return (this.store.getMemory(endpoint.memoryId) as MemoryRecord).projectId;
    };
    const fromProjectId = endpointProjectId(candidate.from);
    const toProjectId = endpointProjectId(candidate.to);
    if (fromProjectId !== projectId && toProjectId !== projectId) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "At least one relation endpoint must belong to the current project.",
      );
    }

    return {
      ...candidate,
      rationale,
      confidence: candidate.confidence ?? "inferred",
    };
  }

  proposeMemory(
    projectId: string,
    candidates: MemoryCandidate[],
    relations: MemoryRelationCandidate[] = [],
    updates: MemoryUpdateCandidate[] = [],
  ): unknown {
    this.store.requireProject(projectId);
    if (
      candidates.length + updates.length + relations.length === 0 ||
      candidates.length > MAX_CANDIDATES ||
      updates.length > MAX_UPDATE_CANDIDATES ||
      relations.length > MAX_RELATION_CANDIDATES
    ) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `A proposal must contain memory, update, or relation candidates, with at most ${MAX_CANDIDATES} memories, ${MAX_UPDATE_CANDIDATES} updates, and ${MAX_RELATION_CANDIDATES} relations.`,
      );
    }
    const prepared = candidates.map((candidate) => this.prepareCandidate(projectId, candidate));
    const refs = prepared
      .map((candidate) => candidate.ref)
      .filter((ref): ref is string => Boolean(ref));
    if (new Set(refs).size !== refs.length) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory candidate refs must be unique.");
    }
    const preparedRelations = relations.map((candidate) =>
      this.prepareRelationCandidate(projectId, new Set(refs), candidate),
    );
    const preparedUpdates = updates.map((candidate) =>
      this.prepareUpdateCandidate(projectId, candidate),
    );
    return this.store.createProposal(projectId, prepared, preparedUpdates, preparedRelations);
  }

  commitMemory(
    proposalId: string,
    acceptedItemIds: string[],
    acceptedRelationIds: string[] = [],
    acceptedUpdateIds: string[] = [],
  ): ProposalCommitResult {
    const result = this.store.commitProposal(
      proposalId,
      acceptedItemIds,
      acceptedUpdateIds,
      acceptedRelationIds,
    );
    return {
      ...result,
      memories: result.memories.map((memory) => this.enrichStaleness(memory)),
      updatedMemories: result.updatedMemories.map((memory) => this.enrichStaleness(memory)),
    };
  }

  rejectMemory(proposalId: string): unknown {
    return this.store.rejectProposal(proposalId);
  }

  private requireGraphMemoryAccess(
    projectId: string,
    memoryId: string,
    includeLinked: boolean,
  ): MemoryRecord {
    const memory = this.store.getMemory(memoryId);
    if (!memory) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory does not exist.", { memoryId });
    }
    if (memory.projectId !== projectId) {
      if (!includeLinked) {
        throw new ProjectMemoryError(
          "LINK_REQUIRED",
          "Use --include-linked true to access a linked-project memory.",
          { memoryId, projectId: memory.projectId },
        );
      }
      this.requireReadAccess(projectId, memory.projectId);
    }
    return this.enrichStaleness(memory);
  }

  private visibleRelations(projectId: string, includeLinked: boolean): MemoryRelationRecord[] {
    const ownerProjectIds = includeLinked
      ? [projectId, ...this.store.listLinks(projectId).map((project) => project.id)]
      : [projectId];
    return ownerProjectIds
      .flatMap((ownerProjectId) => this.store.getRelations(ownerProjectId))
      .filter((relation) => {
        const foreignProjectIds = new Set(
          [relation.fromProjectId, relation.toProjectId].filter((id) => id !== projectId),
        );
        if (foreignProjectIds.size === 0) return true;
        if (!includeLinked) return false;
        return [...foreignProjectIds].every((id) => this.store.hasReadAccess(projectId, id));
      });
  }

  private relationView(relation: MemoryRelationRecord): RelationView | null {
    const fromMemory = this.store.getMemory(relation.fromMemoryId);
    const toMemory = this.store.getMemory(relation.toMemoryId);
    if (!fromMemory || !toMemory) return null;
    const enrichedFrom = this.enrichStaleness(fromMemory);
    const enrichedTo = this.enrichStaleness(toMemory);
    return {
      ...relation,
      fromMemory: enrichedFrom,
      toMemory: enrichedTo,
      suspended: false,
      stale: enrichedFrom.stale || enrichedTo.stale,
    };
  }

  listMemoryRelations(
    projectId: string,
    memoryId: string,
    direction: RelationDirection = "both",
    types: RelationType[] = [],
    includeLinked = false,
  ): Record<string, unknown> {
    const memory = this.requireGraphMemoryAccess(projectId, memoryId, includeLinked);
    if (types.some((type) => !RELATION_TYPES.includes(type))) {
      throw new ProjectMemoryError("INVALID_INPUT", "Unsupported relation type filter.", { types });
    }
    const selectedTypes = new Set(types);
    const relations = this.visibleRelations(projectId, includeLinked)
      .filter((relation) => selectedTypes.size === 0 || selectedTypes.has(relation.type))
      .filter((relation) => {
        if (SYMMETRIC_RELATION_TYPES.has(relation.type)) {
          return relation.fromMemoryId === memoryId || relation.toMemoryId === memoryId;
        }
        if (direction === "out") return relation.fromMemoryId === memoryId;
        if (direction === "in") return relation.toMemoryId === memoryId;
        return relation.fromMemoryId === memoryId || relation.toMemoryId === memoryId;
      })
      .map((relation) => this.relationView(relation))
      .filter((relation): relation is RelationView => Boolean(relation));
    return { memory, direction, relations };
  }

  findRelationPath(
    projectId: string,
    fromMemoryId: string,
    toMemoryId: string,
    maxDepth = 4,
    includeLinked = false,
  ): Record<string, unknown> {
    if (!Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > MAX_PATH_DEPTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Path max depth must be between 1 and ${MAX_PATH_DEPTH}.`,
      );
    }
    const fromMemory = this.requireGraphMemoryAccess(projectId, fromMemoryId, includeLinked);
    const toMemory = this.requireGraphMemoryAccess(projectId, toMemoryId, includeLinked);
    const relations = this.visibleRelations(projectId, includeLinked);
    const adjacency = new Map<string, Array<{ nextId: string; relation: MemoryRelationRecord }>>();
    const add = (from: string, nextId: string, relation: MemoryRelationRecord): void => {
      const entries = adjacency.get(from) ?? [];
      entries.push({ nextId, relation });
      adjacency.set(from, entries);
    };
    for (const relation of relations) {
      add(relation.fromMemoryId, relation.toMemoryId, relation);
      if (SYMMETRIC_RELATION_TYPES.has(relation.type)) {
        add(relation.toMemoryId, relation.fromMemoryId, relation);
      }
    }

    const queue: Array<{ memoryId: string; depth: number }> = [
      { memoryId: fromMemoryId, depth: 0 },
    ];
    const visited = new Set([fromMemoryId]);
    const previous = new Map<string, { memoryId: string; relation: MemoryRelationRecord }>();
    while (queue.length > 0) {
      const current = queue.shift() as { memoryId: string; depth: number };
      if (current.memoryId === toMemoryId) break;
      if (current.depth >= maxDepth) continue;
      for (const edge of adjacency.get(current.memoryId) ?? []) {
        if (visited.has(edge.nextId)) continue;
        visited.add(edge.nextId);
        previous.set(edge.nextId, { memoryId: current.memoryId, relation: edge.relation });
        queue.push({ memoryId: edge.nextId, depth: current.depth + 1 });
      }
    }

    if (!visited.has(toMemoryId)) {
      return { found: false, fromMemory, toMemory, nodes: [], relations: [] };
    }
    const memoryIds = [toMemoryId];
    const pathRelations: MemoryRelationRecord[] = [];
    let cursor = toMemoryId;
    while (cursor !== fromMemoryId) {
      const step = previous.get(cursor);
      if (!step) break;
      pathRelations.push(step.relation);
      cursor = step.memoryId;
      memoryIds.push(cursor);
    }
    memoryIds.reverse();
    pathRelations.reverse();
    return {
      found: true,
      fromMemory,
      toMemory,
      nodes: memoryIds
        .map((id) => this.store.getMemory(id))
        .filter((memory): memory is MemoryRecord => Boolean(memory))
        .map((memory) => this.enrichStaleness(memory)),
      relations: pathRelations,
    };
  }

  buildGraph(
    projectId: string,
    memoryId: string | null,
    depth = 1,
    includeLinked = false,
  ): { nodes: MemoryRecord[]; relations: MemoryRelationRecord[] } {
    if (!Number.isInteger(depth) || depth < 1 || depth > MAX_GRAPH_DEPTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Graph depth must be between 1 and ${MAX_GRAPH_DEPTH}.`,
      );
    }
    this.store.requireProject(projectId);
    const visibleRelations = this.visibleRelations(projectId, includeLinked);
    const selectedMemoryIds = new Set<string>();
    const selectedRelationIds = new Set<string>();
    const queue: Array<{ memoryId: string; depth: number }> = [];
    if (memoryId) {
      this.requireGraphMemoryAccess(projectId, memoryId, includeLinked);
      selectedMemoryIds.add(memoryId);
      queue.push({ memoryId, depth: 0 });
    } else {
      for (const memory of this.store.getContext(projectId, MAX_GRAPH_NODES)) {
        selectedMemoryIds.add(memory.id);
        queue.push({ memoryId: memory.id, depth: 0 });
      }
    }
    while (queue.length > 0 && selectedMemoryIds.size < MAX_GRAPH_NODES) {
      const current = queue.shift() as { memoryId: string; depth: number };
      if (current.depth >= depth) continue;
      for (const relation of visibleRelations) {
        let nextId: string | null = null;
        if (relation.fromMemoryId === current.memoryId) nextId = relation.toMemoryId;
        else if (relation.toMemoryId === current.memoryId) nextId = relation.fromMemoryId;
        if (!nextId) continue;
        selectedRelationIds.add(relation.id);
        if (!selectedMemoryIds.has(nextId) && selectedMemoryIds.size < MAX_GRAPH_NODES) {
          selectedMemoryIds.add(nextId);
          queue.push({ memoryId: nextId, depth: current.depth + 1 });
        }
      }
    }
    if (!memoryId) {
      for (const relation of visibleRelations) {
        if (
          selectedMemoryIds.has(relation.fromMemoryId) &&
          selectedMemoryIds.has(relation.toMemoryId)
        ) {
          selectedRelationIds.add(relation.id);
        }
      }
    }
    const nodes = [...selectedMemoryIds]
      .map((id) => this.store.getMemory(id))
      .filter((memory): memory is MemoryRecord => Boolean(memory))
      .map((memory) => this.enrichStaleness(memory));
    const nodeIds = new Set(nodes.map((memory) => memory.id));
    const relations = visibleRelations.filter(
      (relation) =>
        selectedRelationIds.has(relation.id) &&
        nodeIds.has(relation.fromMemoryId) &&
        nodeIds.has(relation.toMemoryId),
    );
    return { nodes, relations };
  }

  renderGraphMermaid(graph: { nodes: MemoryRecord[]; relations: MemoryRelationRecord[] }): string {
    const nodeId = (id: string): string => `m_${id.replaceAll("-", "_")}`;
    const escapeLabel = (value: string): string =>
      value.replaceAll("\\", "\\\\").replaceAll('"', "'").replaceAll(/\r?\n/g, " ");
    const lines = ["graph TD"];
    for (const memory of graph.nodes) {
      const stale = memory.stale ? " [已过期]" : "";
      lines.push(
        `  ${nodeId(memory.id)}["${escapeLabel(`${memory.projectName}: ${memory.title}${stale}`)}"]`,
      );
    }
    for (const relation of graph.relations) {
      const connector = SYMMETRIC_RELATION_TYPES.has(relation.type) ? "---" : "-->";
      lines.push(
        `  ${nodeId(relation.fromMemoryId)} ${connector}|${RELATION_LABELS[relation.type]}| ${nodeId(relation.toMemoryId)}`,
      );
    }
    return `${lines.join("\n")}\n`;
  }

  renderGraphMarkdown(projectId: string, graph: KnowledgeGraph): string {
    const project = this.store.requireProject(projectId);
    const generatedAt = new Date().toISOString();
    const guide = this.buildGraphGuide(projectId, graph, 12, generatedAt);
    return renderGraphMarkdown(project.name, graph, generatedAt, guide);
  }

  buildGraphGuide(
    projectId: string,
    graph: KnowledgeGraph,
    limit = 12,
    generatedAt = new Date().toISOString(),
  ): GraphGuide {
    const project = this.store.requireProject(projectId);
    return analyzeKnowledgeGraph(projectId, project.name, graph, generatedAt, limit);
  }

  writeGraphHtml(
    projectId: string,
    graph: KnowledgeGraph,
    outputPath?: string,
  ): Record<string, unknown> {
    const project = this.store.requireProject(projectId);
    const generatedAt = new Date().toISOString();
    const guide = this.buildGraphGuide(projectId, graph, 12, generatedAt);
    const html = renderGraphHtml(project.name, graph, generatedAt, guide);
    const target = this.store.writeKnowledgeGraph(projectId, html, outputPath);
    return {
      format: "html",
      outputPath: target,
      generatedAt,
      nodeCount: graph.nodes.length,
      relationCount: graph.relations.length,
      relationSuggestionCount: guide.relationSuggestions.length,
    };
  }

  searchFiles(
    sourceProjectId: string,
    targetProjectId: string,
    query: string,
  ): Record<string, unknown> {
    this.requireReadAccess(sourceProjectId, targetProjectId);
    const target = this.store.requireProject(targetProjectId);
    const metadata = detectGitMetadata(target.primaryPath);
    return {
      targetProject: target,
      query,
      results: searchProjectFiles(metadata.rootPath, query, metadata.headCommit, this.denyPatterns),
    };
  }

  readFile(
    sourceProjectId: string,
    targetProjectId: string,
    relativePath: string,
  ): Record<string, unknown> {
    this.requireReadAccess(sourceProjectId, targetProjectId);
    const target = this.store.requireProject(targetProjectId);
    const metadata = detectGitMetadata(target.primaryPath);
    return {
      targetProject: target,
      file: readProjectFile(
        metadata.rootPath,
        relativePath,
        metadata.headCommit,
        this.denyPatterns,
      ),
    };
  }

  bindingSnippet(): Record<string, string> {
    return {
      beginMarker: "<!-- codex-project-memory:start -->",
      endMarker: "<!-- codex-project-memory:end -->",
      markdown: `<!-- codex-project-memory:start -->
Use the installed $project-memory Skill before substantial work: detect the current project, recall compact task-relevant candidates, and get only the recommended memories within the default token budget. Use load only for explicit full inspection. Before finishing a tool-using task, resolve the memory proposal and include the required Project memory receipt. Use structured request_user_input choices when available. When request_user_input is unavailable, automatically commit all proposed memory and relation items and disclose the automatic fallback. Treat linked projects as read-only references.
<!-- codex-project-memory:end -->`,
    };
  }

  exportProject(projectId: string): Record<string, unknown> {
    const exported = this.store.exportProject(projectId);
    return { ...exported, memories: this.getContext(projectId, 1000) };
  }
}
