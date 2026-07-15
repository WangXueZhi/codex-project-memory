import { randomUUID } from "node:crypto";
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { ProjectMemoryError } from "./errors.js";
import type {
  CitationRole,
  Confidence,
  MemoryCandidate,
  MemoryCitationCandidate,
  MemoryKind,
  MemoryRecord,
  MemoryRelationCandidate,
  MemoryRelationRecord,
  MemoryUpdateCandidate,
  MemoryUpdateProposalItem,
  ProjectRecord,
  ProposalItem,
  ProposalRecord,
  RelationProposalItem,
  RelationType,
} from "./types.js";
import { RELATION_TYPES } from "./types.js";

const SCHEMA_VERSION = 1;
const MEMORY_SCHEMA_VERSION = 2;

interface ProjectLocation {
  canonicalPath: string;
  firstSeenAt: string;
  lastSeenAt: string;
}

interface RegistryEntry {
  id: string;
  locations: ProjectLocation[];
}

interface RegistryDocument {
  schemaVersion: number;
  projects: RegistryEntry[];
}

interface LinkRecord {
  sourceProjectId: string;
  targetProjectId: string;
  access: "read";
  createdAt: string;
}

interface LinksDocument {
  schemaVersion: number;
  links: LinkRecord[];
}

interface StoredMemoryMetadata {
  id: string;
  projectId: string;
  kind: MemoryKind;
  title: string;
  summary?: string | null;
  topic?: string | null;
  tags: string[];
  sourceProjectId: string | null;
  sourcePath: string | null;
  sourceCommit: string | null;
  sourceFileHash: string | null;
  citations?: StoredMemoryCitation[];
  confidence: Confidence;
  status: "active";
  createdAt: string;
  updatedAt: string;
}

interface StoredMemoryCitation {
  sourceProjectId: string;
  sourcePath: string;
  role: CitationRole;
  locator: string | null;
  note: string | null;
  sourceCommit: string | null;
  sourceFileHash: string;
}

interface MemoryDocumentMetadata {
  schemaVersion: number;
  projectId: string;
  memories: StoredMemoryMetadata[];
}

interface RelationsDocument {
  schemaVersion: number;
  projectId: string;
  relations: MemoryRelationRecord[];
}

interface StoredProposalItem extends Omit<ProposalItem, "candidate"> {
  candidate: PreparedCandidate;
}

interface StoredRelationProposalItem extends Omit<RelationProposalItem, "candidate"> {
  candidate: PreparedRelationCandidate;
}

interface StoredUpdateProposalItem extends Omit<MemoryUpdateProposalItem, "candidate"> {
  candidate: PreparedUpdateCandidate;
}

interface StoredProposal extends Omit<ProposalRecord, "items" | "updateItems" | "relationItems"> {
  items: StoredProposalItem[];
  updateItems?: StoredUpdateProposalItem[];
  relationItems?: StoredRelationProposalItem[];
}

interface AuditEvent {
  eventType: string;
  projectId: string | null;
  subjectId: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface ProjectCreateInput {
  name: string;
  primaryPath: string;
  isGit: boolean;
  gitCommonDir: string | null;
  remoteUrl: string | null;
  headCommit: string | null;
  relinkProjectId?: string;
}

export type PreparedCandidate = Omit<
  MemoryCandidate,
  "sourceProjectId" | "sourcePath" | "confidence" | "tags" | "summary" | "topic" | "citations"
> & {
  summary: string | null;
  topic: string | null;
  sourceProjectId: string | null;
  sourcePath: string | null;
  sourceCommit: string | null;
  sourceFileHash: string | null;
  citations: PreparedCitation[];
  confidence: Confidence;
  tags: string[];
};

export type PreparedCitation = Required<Pick<MemoryCitationCandidate, "sourcePath" | "role">> & {
  sourceProjectId: string;
  locator: string | null;
  note: string | null;
  sourceCommit: string | null;
  sourceFileHash: string;
};

export type PreparedUpdateCandidate = Omit<
  MemoryUpdateCandidate,
  "summary" | "topic" | "citations"
> & {
  summary?: string;
  topic?: string;
  citations?: PreparedCitation[];
};

export type PreparedRelationCandidate = MemoryRelationCandidate & {
  rationale: string;
  confidence: Confidence;
};

export interface ProposalCommitResult {
  memories: MemoryRecord[];
  updatedMemories: MemoryRecord[];
  relations: MemoryRelationRecord[];
  rejectedUpdateItems: MemoryUpdateProposalItem[];
  rejectedRelationItems: RelationProposalItem[];
}

function now(): string {
  return new Date().toISOString();
}

function ensurePrivateDirectory(directory: string): void {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
}

function writePrivateFile(filePath: string, content: string, hardenDirectory = true): void {
  if (hardenDirectory) {
    ensurePrivateDirectory(path.dirname(filePath));
  } else {
    mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
  }
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporaryPath, content, { encoding: "utf8", mode: 0o600 });
    chmodSync(temporaryPath, 0o600);
    renameSync(temporaryPath, filePath);
    chmodSync(filePath, 0o600);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
}

function writeJson(filePath: string, value: unknown): void {
  writePrivateFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson<T>(filePath: string): T {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch (error) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Unable to read project memory state.", {
      path: filePath,
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

function headingTitle(title: string): string {
  return title.replaceAll(/\s+/g, " ").trim();
}

function renderMemoryDocument(projectId: string, memories: MemoryRecord[]): string {
  const metadata: MemoryDocumentMetadata = {
    schemaVersion: MEMORY_SCHEMA_VERSION,
    projectId,
    memories: memories.map((memory) => ({
      id: memory.id,
      projectId: memory.projectId,
      kind: memory.kind,
      title: memory.title,
      summary: memory.summary,
      topic: memory.topic,
      tags: memory.tags,
      sourceProjectId: memory.sourceProjectId,
      sourcePath: memory.sourcePath,
      sourceCommit: memory.sourceCommit,
      sourceFileHash: memory.sourceFileHash,
      citations: memory.citations.map((citation) => ({
        sourceProjectId: citation.sourceProjectId,
        sourcePath: citation.sourcePath,
        role: citation.role,
        locator: citation.locator,
        note: citation.note,
        sourceCommit: citation.sourceCommit,
        sourceFileHash: citation.sourceFileHash,
      })),
      confidence: memory.confidence,
      status: "active",
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    })),
  };
  const sections = memories.map(
    (memory) => `## [${memory.id}] ${headingTitle(memory.title)}\n\n${memory.content.trim()}\n`,
  );
  return `---\n${JSON.stringify(metadata, null, 2)}\n---\n\n# Project Memory\n\n${sections.join("\n")}`;
}

function parseMemoryDocument(filePath: string, project: ProjectRecord): MemoryRecord[] {
  if (!existsSync(filePath)) {
    return [];
  }
  const text = readFileSync(filePath, "utf8");
  const frontMatter = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontMatter) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Project MEMORY.md has invalid front matter.", {
      path: filePath,
    });
  }
  let metadata: MemoryDocumentMetadata;
  try {
    metadata = JSON.parse(frontMatter[1] ?? "") as MemoryDocumentMetadata;
  } catch (error) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Project MEMORY.md metadata is invalid.", {
      path: filePath,
      cause: error instanceof Error ? error.message : String(error),
    });
  }
  if (
    ![1, MEMORY_SCHEMA_VERSION].includes(metadata.schemaVersion) ||
    metadata.projectId !== project.id
  ) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Project MEMORY.md identity is invalid.", {
      path: filePath,
      projectId: project.id,
    });
  }

  const bodyOffset = frontMatter[0].length;
  const body = text.slice(bodyOffset);
  const headings = new Map<string, { contentStart: number; sectionEnd: number }>();
  const memoryIds = new Set(metadata.memories.map((memory) => memory.id));
  const matches = [...body.matchAll(/^## \[([0-9a-f-]+)\](?: .*)?$/gim)].filter((match) =>
    memoryIds.has(match[1] ?? ""),
  );
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const id = match?.[1];
    if (!match || !id || match.index === undefined) {
      continue;
    }
    const lineEnd = body.indexOf("\n", match.index);
    const contentStart = lineEnd === -1 ? body.length : lineEnd + 1;
    const sectionEnd = matches[index + 1]?.index ?? body.length;
    headings.set(id, { contentStart, sectionEnd });
  }

  return metadata.memories.map((memory) => {
    const section = headings.get(memory.id);
    if (!section) {
      throw new ProjectMemoryError(
        "STORAGE_ERROR",
        "Project MEMORY.md is missing a memory section.",
        {
          path: filePath,
          memoryId: memory.id,
        },
      );
    }
    return {
      ...memory,
      summary: memory.summary ?? null,
      topic: memory.topic ?? null,
      projectName: project.name,
      content: body.slice(section.contentStart, section.sectionEnd).trim(),
      citations: (memory.citations ?? []).map((citation) => ({
        ...citation,
        sourceProjectName: "",
        stale: false,
        staleReason: null,
        accessible: true,
        fileUrl: null,
      })),
      stale: false,
      staleReason: null,
    };
  });
}

function scoreMemory(memory: MemoryRecord, tokens: string[]): number {
  const title = memory.title.toLocaleLowerCase();
  const tags = memory.tags.join(" ").toLocaleLowerCase();
  const content = memory.content.toLocaleLowerCase();
  return tokens.reduce((score, token) => {
    if (title.includes(token)) return score + 5;
    if (tags.includes(token)) return score + 3;
    if (content.includes(token)) return score + 1;
    return score;
  }, 0);
}

const SYMMETRIC_RELATION_TYPES = new Set<RelationType>(["related_to", "contradicts"]);

function relationKey(type: RelationType, fromMemoryId: string, toMemoryId: string): string {
  if (SYMMETRIC_RELATION_TYPES.has(type)) {
    const [left, right] = [fromMemoryId, toMemoryId].sort();
    return `${type}:${left}:${right}`;
  }
  return `${type}:${fromMemoryId}:${toMemoryId}`;
}

function publicCitation(citation: PreparedCitation): MemoryCitationCandidate {
  return {
    sourceProjectId: citation.sourceProjectId,
    sourcePath: citation.sourcePath,
    role: citation.role,
    ...(citation.locator ? { locator: citation.locator } : {}),
    ...(citation.note ? { note: citation.note } : {}),
  };
}

function publicUpdateCandidate(candidate: PreparedUpdateCandidate): MemoryUpdateCandidate {
  return {
    memoryId: candidate.memoryId,
    ...(candidate.summary !== undefined ? { summary: candidate.summary } : {}),
    ...(candidate.topic !== undefined ? { topic: candidate.topic } : {}),
    ...(candidate.citations !== undefined
      ? { citations: candidate.citations.map(publicCitation) }
      : {}),
  };
}

function publicProposal(proposal: StoredProposal): ProposalRecord {
  return {
    id: proposal.id,
    projectId: proposal.projectId,
    status: proposal.status,
    createdAt: proposal.createdAt,
    reviewedAt: proposal.reviewedAt,
    items: proposal.items.map((item) => ({
      id: item.id,
      proposalId: item.proposalId,
      status: item.status,
      candidate: {
        ...(item.candidate.ref ? { ref: item.candidate.ref } : {}),
        kind: item.candidate.kind,
        title: item.candidate.title,
        ...(item.candidate.summary ? { summary: item.candidate.summary } : {}),
        ...(item.candidate.topic ? { topic: item.candidate.topic } : {}),
        content: item.candidate.content,
        tags: item.candidate.tags,
        ...(item.candidate.sourceProjectId
          ? { sourceProjectId: item.candidate.sourceProjectId }
          : {}),
        ...(item.candidate.sourcePath ? { sourcePath: item.candidate.sourcePath } : {}),
        ...((item.candidate.citations ?? []).length > 0
          ? { citations: (item.candidate.citations ?? []).map(publicCitation) }
          : {}),
        confidence: item.candidate.confidence,
      },
    })),
    updateItems: (proposal.updateItems ?? []).map((item) => ({
      id: item.id,
      proposalId: item.proposalId,
      status: item.status,
      rejectionReason: item.rejectionReason,
      candidate: publicUpdateCandidate(item.candidate),
    })),
    relationItems: (proposal.relationItems ?? []).map((item) => ({
      id: item.id,
      proposalId: item.proposalId,
      status: item.status,
      rejectionReason: item.rejectionReason,
      candidate: {
        from: item.candidate.from,
        to: item.candidate.to,
        type: item.candidate.type,
        rationale: item.candidate.rationale,
        confidence: item.candidate.confidence,
      },
    })),
  };
}

export class MemoryStore {
  readonly storageRoot: string;
  private readonly registryPath: string;
  private readonly linksPath: string;
  private readonly projectsRoot: string;

  constructor(dataDir: string) {
    this.storageRoot = dataDir;
    this.registryPath = path.join(dataDir, "registry.json");
    this.linksPath = path.join(dataDir, "links.json");
    this.projectsRoot = path.join(dataDir, "projects");
    ensurePrivateDirectory(this.projectsRoot);
    if (!existsSync(this.registryPath)) {
      writeJson(this.registryPath, { schemaVersion: SCHEMA_VERSION, projects: [] });
    }
    if (!existsSync(this.linksPath)) {
      writeJson(this.linksPath, { schemaVersion: SCHEMA_VERSION, links: [] });
    }
    this.readRegistry();
    this.readLinks();
  }

  close(): void {}

  private projectDir(projectId: string): string {
    return path.join(this.projectsRoot, projectId);
  }

  private projectPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "project.json");
  }

  private memoryPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "MEMORY.md");
  }

  writeKnowledgeGraph(projectId: string, content: string, outputPath?: string): string {
    this.requireProject(projectId);
    const target = outputPath
      ? path.resolve(outputPath)
      : path.join(this.projectDir(projectId), "KNOWLEDGE_GRAPH.html");
    writePrivateFile(target, content, outputPath === undefined);
    return target;
  }

  private relationsPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "RELATIONS.json");
  }

  private proposalsDir(projectId: string): string {
    return path.join(this.projectDir(projectId), "proposals");
  }

  private proposalPath(projectId: string, proposalId: string): string {
    return path.join(this.proposalsDir(projectId), `${proposalId}.json`);
  }

  private auditPath(projectId: string): string {
    return path.join(this.projectDir(projectId), "audit.jsonl");
  }

  private readRelationsDocument(projectId: string): RelationsDocument {
    this.requireProject(projectId);
    const relationsPath = this.relationsPath(projectId);
    if (!existsSync(relationsPath)) {
      return { schemaVersion: SCHEMA_VERSION, projectId, relations: [] };
    }
    const document = readJson<RelationsDocument>(relationsPath);
    if (
      document.schemaVersion !== SCHEMA_VERSION ||
      document.projectId !== projectId ||
      !Array.isArray(document.relations)
    ) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project relations schema is invalid.", {
        path: relationsPath,
        projectId,
      });
    }
    return document;
  }

  private writeRelationsDocument(document: RelationsDocument): void {
    writeJson(this.relationsPath(document.projectId), document);
  }

  getRelations(projectId: string): MemoryRelationRecord[] {
    return this.readRelationsDocument(projectId).relations;
  }

  getAllRelations(): MemoryRelationRecord[] {
    return this.readRegistry().projects.flatMap((entry) => this.getRelations(entry.id));
  }

  private readRegistry(): RegistryDocument {
    const registry = readJson<RegistryDocument>(this.registryPath);
    if (registry.schemaVersion !== SCHEMA_VERSION || !Array.isArray(registry.projects)) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project registry schema is invalid.", {
        path: this.registryPath,
      });
    }
    return registry;
  }

  private writeRegistry(registry: RegistryDocument): void {
    writeJson(this.registryPath, registry);
  }

  private readLinks(): LinksDocument {
    const links = readJson<LinksDocument>(this.linksPath);
    if (links.schemaVersion !== SCHEMA_VERSION || !Array.isArray(links.links)) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project links schema is invalid.", {
        path: this.linksPath,
      });
    }
    return links;
  }

  private writeLinks(links: LinksDocument): void {
    writeJson(this.linksPath, links);
  }

  private audit(
    eventType: string,
    projectId: string | null,
    subjectId: string | null,
    details: Record<string, unknown>,
  ): void {
    if (!projectId) {
      return;
    }
    const event: AuditEvent = { eventType, projectId, subjectId, details, createdAt: now() };
    const auditPath = this.auditPath(projectId);
    ensurePrivateDirectory(path.dirname(auditPath));
    appendFileSync(auditPath, `${JSON.stringify(event)}\n`, { encoding: "utf8", mode: 0o600 });
    chmodSync(auditPath, 0o600);
  }

  getProject(projectId: string): ProjectRecord | null {
    const projectPath = this.projectPath(projectId);
    return existsSync(projectPath) ? readJson<ProjectRecord>(projectPath) : null;
  }

  getProjectByPath(canonicalPath: string): ProjectRecord | null {
    const entry = this.readRegistry().projects.find((project) =>
      project.locations.some((location) => location.canonicalPath === canonicalPath),
    );
    return entry ? this.getProject(entry.id) : null;
  }

  findRelocationCandidates(gitCommonDir: string | null, remoteUrl: string | null): ProjectRecord[] {
    if (!gitCommonDir && !remoteUrl) {
      return [];
    }
    return this.readRegistry()
      .projects.map((entry) => this.getProject(entry.id))
      .filter((project): project is ProjectRecord => Boolean(project))
      .filter(
        (project) =>
          (gitCommonDir !== null && project.gitCommonDir === gitCommonDir) ||
          (remoteUrl !== null && project.remoteUrl === remoteUrl),
      )
      .sort((left, right) => right.lastSeenAt.localeCompare(left.lastSeenAt));
  }

  registerProject(input: ProjectCreateInput): ProjectRecord {
    const existing = this.getProjectByPath(input.primaryPath);
    if (existing) {
      throw new ProjectMemoryError(
        "PROJECT_ALREADY_REGISTERED",
        "Project path is already registered.",
        { projectId: existing.id },
      );
    }

    const registry = this.readRegistry();
    const timestamp = now();
    if (input.relinkProjectId) {
      const project = this.getProject(input.relinkProjectId);
      const entry = registry.projects.find((candidate) => candidate.id === input.relinkProjectId);
      if (!project || !entry) {
        throw new ProjectMemoryError("PROJECT_NOT_REGISTERED", "Relink target does not exist.", {
          projectId: input.relinkProjectId,
        });
      }
      const updated: ProjectRecord = {
        ...project,
        name: input.name,
        primaryPath: input.primaryPath,
        isGit: input.isGit,
        gitCommonDir: input.gitCommonDir,
        remoteUrl: input.remoteUrl,
        headCommit: input.headCommit,
        updatedAt: timestamp,
        lastSeenAt: timestamp,
      };
      entry.locations.push({
        canonicalPath: input.primaryPath,
        firstSeenAt: timestamp,
        lastSeenAt: timestamp,
      });
      writeJson(this.projectPath(project.id), updated);
      this.writeRegistry(registry);
      this.audit("project_relinked", project.id, project.id, { path: input.primaryPath });
      return updated;
    }

    const id = randomUUID();
    const project: ProjectRecord = {
      id,
      name: input.name,
      primaryPath: input.primaryPath,
      isGit: input.isGit,
      gitCommonDir: input.gitCommonDir,
      remoteUrl: input.remoteUrl,
      headCommit: input.headCommit,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastSeenAt: timestamp,
    };
    ensurePrivateDirectory(this.proposalsDir(id));
    writeJson(this.projectPath(id), project);
    writePrivateFile(this.memoryPath(id), renderMemoryDocument(id, []));
    this.writeRelationsDocument({ schemaVersion: SCHEMA_VERSION, projectId: id, relations: [] });
    registry.projects.push({
      id,
      locations: [
        { canonicalPath: input.primaryPath, firstSeenAt: timestamp, lastSeenAt: timestamp },
      ],
    });
    this.writeRegistry(registry);
    this.audit("project_registered", id, id, { path: input.primaryPath });
    return project;
  }

  touchProject(projectId: string, pathValue: string, headCommit: string | null): void {
    const project = this.requireProject(projectId);
    const registry = this.readRegistry();
    const entry = registry.projects.find((candidate) => candidate.id === projectId);
    if (!entry) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project is missing from the registry.", {
        projectId,
      });
    }
    const timestamp = now();
    const location = entry.locations.find((candidate) => candidate.canonicalPath === pathValue);
    if (location) {
      location.lastSeenAt = timestamp;
    } else {
      entry.locations.push({
        canonicalPath: pathValue,
        firstSeenAt: timestamp,
        lastSeenAt: timestamp,
      });
    }
    writeJson(this.projectPath(projectId), {
      ...project,
      primaryPath: pathValue,
      headCommit,
      updatedAt: timestamp,
      lastSeenAt: timestamp,
    });
    this.writeRegistry(registry);
  }

  linkProjects(sourceProjectId: string, targetProjectId: string): void {
    if (sourceProjectId === targetProjectId) {
      throw new ProjectMemoryError("INVALID_INPUT", "A project cannot link to itself.");
    }
    this.requireProject(sourceProjectId);
    this.requireProject(targetProjectId);
    const links = this.readLinks();
    if (
      !links.links.some(
        (link) =>
          link.sourceProjectId === sourceProjectId && link.targetProjectId === targetProjectId,
      )
    ) {
      links.links.push({ sourceProjectId, targetProjectId, access: "read", createdAt: now() });
      this.writeLinks(links);
    }
    this.audit("project_linked", sourceProjectId, targetProjectId, { access: "read" });
  }

  unlinkProjects(sourceProjectId: string, targetProjectId: string): void {
    const links = this.readLinks();
    links.links = links.links.filter(
      (link) =>
        !(link.sourceProjectId === sourceProjectId && link.targetProjectId === targetProjectId),
    );
    this.writeLinks(links);
    this.audit("project_unlinked", sourceProjectId, targetProjectId, {});
  }

  listLinks(sourceProjectId: string): ProjectRecord[] {
    this.requireProject(sourceProjectId);
    return this.readLinks()
      .links.filter((link) => link.sourceProjectId === sourceProjectId)
      .map((link) => this.getProject(link.targetProjectId))
      .filter((project): project is ProjectRecord => Boolean(project))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  hasReadAccess(sourceProjectId: string, targetProjectId: string): boolean {
    if (sourceProjectId === targetProjectId) {
      return true;
    }
    return this.readLinks().links.some(
      (link) =>
        link.sourceProjectId === sourceProjectId && link.targetProjectId === targetProjectId,
    );
  }

  createProposal(
    projectId: string,
    candidates: PreparedCandidate[],
    updates: PreparedUpdateCandidate[] = [],
    relations: PreparedRelationCandidate[] = [],
  ): ProposalRecord {
    this.requireProject(projectId);
    const proposalId = randomUUID();
    const proposal: StoredProposal = {
      id: proposalId,
      projectId,
      status: "pending",
      createdAt: now(),
      reviewedAt: null,
      items: candidates.map((candidate) => ({
        id: randomUUID(),
        proposalId,
        candidate,
        status: "pending",
      })),
      updateItems: updates.map((candidate) => ({
        id: randomUUID(),
        proposalId,
        candidate,
        status: "pending",
        rejectionReason: null,
      })),
      relationItems: relations.map((candidate) => ({
        id: randomUUID(),
        proposalId,
        candidate,
        status: "pending",
        rejectionReason: null,
      })),
    };
    writeJson(this.proposalPath(projectId, proposalId), proposal);
    this.audit("memory_proposed", projectId, proposalId, {
      itemCount: candidates.length,
      updateItemCount: updates.length,
      relationItemCount: relations.length,
    });
    return publicProposal(proposal);
  }

  private findProposalPath(proposalId: string): string | null {
    for (const entry of this.readRegistry().projects) {
      const proposalPath = this.proposalPath(entry.id, proposalId);
      if (existsSync(proposalPath)) {
        return proposalPath;
      }
    }
    return null;
  }

  getProposal(proposalId: string, expectedItemIds?: string[]): ProposalRecord | null {
    const proposalPath = this.findProposalPath(proposalId);
    if (!proposalPath) {
      return null;
    }
    const proposal = readJson<StoredProposal>(proposalPath);
    if (expectedItemIds && proposal.items.some((item) => !expectedItemIds.includes(item.id))) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Proposal items changed unexpectedly.");
    }
    return publicProposal(proposal);
  }

  commitProposal(
    proposalId: string,
    acceptedItemIds: string[],
    acceptedUpdateIds: string[] = [],
    acceptedRelationIds: string[] = [],
  ): ProposalCommitResult {
    const proposalPath = this.findProposalPath(proposalId);
    const proposal = proposalPath ? readJson<StoredProposal>(proposalPath) : null;
    if (proposal?.status !== "pending" || !proposalPath) {
      throw new ProjectMemoryError("PROPOSAL_NOT_PENDING", "Proposal is not pending.", {
        proposalId,
      });
    }
    const accepted = new Set(acceptedItemIds);
    const acceptedUpdates = new Set(acceptedUpdateIds);
    const acceptedRelations = new Set(acceptedRelationIds);
    const validIds = new Set(proposal.items.map((item) => item.id));
    const updateItems = proposal.updateItems ?? [];
    const validUpdateIds = new Set(updateItems.map((item) => item.id));
    const relationItems = proposal.relationItems ?? [];
    const validRelationIds = new Set(relationItems.map((item) => item.id));
    if (
      accepted.size + acceptedUpdates.size + acceptedRelations.size === 0 ||
      [...accepted].some((id) => !validIds.has(id)) ||
      [...acceptedUpdates].some((id) => !validUpdateIds.has(id)) ||
      [...acceptedRelations].some((id) => !validRelationIds.has(id))
    ) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Accepted memory, update, and relation item IDs must belong to the proposal.",
        { proposalId },
      );
    }

    const project = this.requireProject(proposal.projectId);
    const memories = this.getContext(project.id, 1000);
    const reviewedAt = now();
    const created: MemoryRecord[] = [];
    const createdByRef = new Map<string, MemoryRecord>();
    for (const item of proposal.items) {
      if (!accepted.has(item.id)) {
        item.status = "rejected";
        continue;
      }
      const candidate = item.candidate;
      const memory: MemoryRecord = {
        id: randomUUID(),
        projectId: project.id,
        projectName: project.name,
        kind: candidate.kind,
        title: candidate.title,
        summary: candidate.summary ?? null,
        topic: candidate.topic ?? null,
        content: candidate.content,
        tags: candidate.tags,
        sourceProjectId: candidate.sourceProjectId,
        sourcePath: candidate.sourcePath,
        sourceCommit: candidate.sourceCommit,
        sourceFileHash: candidate.sourceFileHash,
        citations: (candidate.citations ?? []).map((citation) => ({
          ...citation,
          sourceProjectName: "",
          stale: false,
          staleReason: null,
          accessible: true,
          fileUrl: null,
        })),
        confidence: candidate.confidence,
        status: "active",
        createdAt: reviewedAt,
        updatedAt: reviewedAt,
        stale: false,
        staleReason: null,
      };
      memories.push(memory);
      created.push(memory);
      if (candidate.ref) createdByRef.set(candidate.ref, memory);
      item.status = "accepted";
    }

    const updatedMemories: MemoryRecord[] = [];
    const rejectedUpdateItems: MemoryUpdateProposalItem[] = [];
    for (const item of updateItems) {
      if (!acceptedUpdates.has(item.id)) {
        item.status = "rejected";
        item.rejectionReason = "not_accepted";
        continue;
      }
      const memory = memories.find((candidate) => candidate.id === item.candidate.memoryId);
      if (!memory || memory.projectId !== project.id) {
        item.status = "rejected";
        item.rejectionReason = "memory_unavailable";
        rejectedUpdateItems.push({
          id: item.id,
          proposalId: item.proposalId,
          candidate: publicUpdateCandidate(item.candidate),
          status: "rejected",
          rejectionReason: item.rejectionReason,
        });
        continue;
      }
      if (item.candidate.summary !== undefined) memory.summary = item.candidate.summary;
      if (item.candidate.topic !== undefined) memory.topic = item.candidate.topic;
      if (item.candidate.citations !== undefined) {
        memory.citations = item.candidate.citations.map((citation) => ({
          ...citation,
          sourceProjectName: "",
          stale: false,
          staleReason: null,
          accessible: true,
          fileUrl: null,
        }));
      }
      memory.updatedAt = reviewedAt;
      updatedMemories.push(memory);
      item.status = "accepted";
      item.rejectionReason = null;
    }

    const relationDocument = this.readRelationsDocument(project.id);
    const relationKeys = new Set(
      relationDocument.relations.map((relation) =>
        relationKey(relation.type, relation.fromMemoryId, relation.toMemoryId),
      ),
    );
    const createdRelations: MemoryRelationRecord[] = [];
    const rejectedRelationItems: RelationProposalItem[] = [];
    const resolveEndpoint = (endpoint: MemoryRelationCandidate["from"]): MemoryRecord | null => {
      if (endpoint.memoryId) return this.getMemory(endpoint.memoryId);
      if (!("candidateRef" in endpoint) || !endpoint.candidateRef) return null;
      return createdByRef.get(endpoint.candidateRef) ?? null;
    };

    for (const item of relationItems) {
      if (!acceptedRelations.has(item.id)) {
        item.status = "rejected";
        item.rejectionReason = "not_accepted";
        continue;
      }
      const fromMemory = resolveEndpoint(item.candidate.from);
      const toMemory = resolveEndpoint(item.candidate.to);
      let rejectionReason: string | null = null;
      if (!fromMemory || !toMemory) {
        rejectionReason = "endpoint_unavailable";
      } else if (fromMemory.id === toMemory.id) {
        rejectionReason = "self_relation";
      } else if (fromMemory.projectId !== project.id && toMemory.projectId !== project.id) {
        rejectionReason = "current_project_endpoint_required";
      } else {
        const foreignProjectIds = new Set(
          [fromMemory.projectId, toMemory.projectId].filter((id) => id !== project.id),
        );
        if ([...foreignProjectIds].some((id) => !this.hasReadAccess(project.id, id))) {
          rejectionReason = "project_link_required";
        }
      }
      const key =
        fromMemory && toMemory
          ? relationKey(item.candidate.type, fromMemory.id, toMemory.id)
          : null;
      if (!rejectionReason && key && relationKeys.has(key)) {
        rejectionReason = "duplicate_relation";
      }
      if (rejectionReason || !fromMemory || !toMemory || !key) {
        item.status = "rejected";
        item.rejectionReason = rejectionReason ?? "invalid_relation";
        rejectedRelationItems.push({
          id: item.id,
          proposalId: item.proposalId,
          candidate: item.candidate,
          status: item.status,
          rejectionReason: item.rejectionReason,
        });
        continue;
      }
      const relation: MemoryRelationRecord = {
        id: randomUUID(),
        ownerProjectId: project.id,
        fromMemoryId: fromMemory.id,
        fromProjectId: fromMemory.projectId,
        toMemoryId: toMemory.id,
        toProjectId: toMemory.projectId,
        type: item.candidate.type,
        rationale: item.candidate.rationale,
        confidence: item.candidate.confidence,
        sourceProposalId: proposalId,
        status: "active",
        createdAt: reviewedAt,
        updatedAt: reviewedAt,
      };
      relationDocument.relations.push(relation);
      relationKeys.add(key);
      createdRelations.push(relation);
      item.status = "accepted";
      item.rejectionReason = null;
    }
    proposal.status = "accepted";
    proposal.reviewedAt = reviewedAt;
    writePrivateFile(this.memoryPath(project.id), renderMemoryDocument(project.id, memories));
    this.writeRelationsDocument(relationDocument);
    writeJson(proposalPath, proposal);
    this.audit("memory_committed", project.id, proposalId, {
      acceptedItemIds: [...accepted],
      memoryIds: created.map((memory) => memory.id),
      acceptedUpdateIds: [...acceptedUpdates],
      updatedMemoryIds: updatedMemories.map((memory) => memory.id),
      rejectedUpdateItemIds: rejectedUpdateItems.map((item) => item.id),
      acceptedRelationIds: [...acceptedRelations],
      relationIds: createdRelations.map((relation) => relation.id),
      rejectedRelationItemIds: rejectedRelationItems.map((item) => item.id),
    });
    return {
      memories: created,
      updatedMemories,
      relations: createdRelations,
      rejectedUpdateItems,
      rejectedRelationItems,
    };
  }

  rejectProposal(proposalId: string): ProposalRecord {
    const proposalPath = this.findProposalPath(proposalId);
    const proposal = proposalPath ? readJson<StoredProposal>(proposalPath) : null;
    if (proposal?.status !== "pending" || !proposalPath) {
      throw new ProjectMemoryError("PROPOSAL_NOT_PENDING", "Proposal is not pending.", {
        proposalId,
      });
    }
    proposal.status = "rejected";
    proposal.reviewedAt = now();
    for (const item of proposal.items) {
      item.status = "rejected";
    }
    for (const item of proposal.updateItems ?? []) {
      item.status = "rejected";
      item.rejectionReason = "proposal_rejected";
    }
    for (const item of proposal.relationItems ?? []) {
      item.status = "rejected";
      item.rejectionReason = "proposal_rejected";
    }
    writeJson(proposalPath, proposal);
    this.audit("memory_rejected", proposal.projectId, proposalId, {});
    return publicProposal(proposal);
  }

  getMemory(memoryId: string): MemoryRecord | null {
    for (const entry of this.readRegistry().projects) {
      const memory = this.getContext(entry.id, 1000).find((candidate) => candidate.id === memoryId);
      if (memory) {
        return memory;
      }
    }
    return null;
  }

  getContext(projectId: string, limit = 30): MemoryRecord[] {
    const project = this.requireProject(projectId);
    return parseMemoryDocument(this.memoryPath(projectId), project)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, Math.min(Math.max(limit, 1), 1000));
  }

  searchMemories(projectIds: string[], query: string, limit = 30): MemoryRecord[] {
    if (projectIds.length === 0) {
      return [];
    }
    const tokens = (query.match(/[\p{L}\p{N}_-]+/gu) ?? []).map((token) =>
      token.toLocaleLowerCase(),
    );
    if (tokens.length === 0) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory search query cannot be empty.");
    }
    return projectIds
      .flatMap((projectId) => this.getContext(projectId, 1000))
      .map((memory) => ({ memory, score: scoreMemory(memory, tokens) }))
      .filter(({ memory }) => {
        const haystack =
          `${memory.title}\n${memory.tags.join(" ")}\n${memory.content}`.toLocaleLowerCase();
        return tokens.every((token) => haystack.includes(token));
      })
      .sort(
        (left, right) =>
          right.score - left.score || right.memory.updatedAt.localeCompare(left.memory.updatedAt),
      )
      .slice(0, Math.min(Math.max(limit, 1), 100))
      .map(({ memory }) => memory);
  }

  forgetMemories(projectId: string, memoryIds: string[]): string[] {
    this.requireProject(projectId);
    const forgotten = new Set(memoryIds);
    const memories = this.getContext(projectId, 1000);
    const retained = memories.filter((memory) => !forgotten.has(memory.id));
    const removed = memories
      .filter((memory) => forgotten.has(memory.id))
      .map((memory) => memory.id);
    writePrivateFile(this.memoryPath(projectId), renderMemoryDocument(projectId, retained));
    const removedSet = new Set(removed);
    for (const entry of this.readRegistry().projects) {
      const document = this.readRelationsDocument(entry.id);
      const removedRelations = document.relations.filter(
        (relation) => removedSet.has(relation.fromMemoryId) || removedSet.has(relation.toMemoryId),
      );
      if (removedRelations.length === 0) continue;
      document.relations = document.relations.filter(
        (relation) =>
          !removedSet.has(relation.fromMemoryId) && !removedSet.has(relation.toMemoryId),
      );
      this.writeRelationsDocument(document);
      this.audit("relations_forgotten", entry.id, null, {
        relationIds: removedRelations.map((relation) => relation.id),
        causedByMemoryIds: removed,
      });
    }
    this.audit("memory_forgotten", projectId, null, { memoryIds: removed });
    return removed;
  }

  forgetRelations(projectId: string, relationIds: string[]): string[] {
    const document = this.readRelationsDocument(projectId);
    const requested = new Set(relationIds);
    const removed = document.relations
      .filter((relation) => requested.has(relation.id))
      .map((relation) => relation.id);
    document.relations = document.relations.filter((relation) => !requested.has(relation.id));
    this.writeRelationsDocument(document);
    this.audit("relations_forgotten", projectId, null, { relationIds: removed });
    return removed;
  }

  exportProject(projectId: string): Record<string, unknown> {
    const project = this.requireProject(projectId);
    return {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now(),
      project,
      links: this.listLinks(projectId),
      memories: this.getContext(projectId, 1000),
      relations: this.getRelations(projectId),
    };
  }

  countPendingProposals(projectId: string): number {
    this.requireProject(projectId);
    const directory = this.proposalsDir(projectId);
    if (!existsSync(directory)) {
      return 0;
    }
    return readdirSync(directory)
      .filter((file) => file.endsWith(".json"))
      .map((file) => readJson<StoredProposal>(path.join(directory, file)))
      .filter((proposal) => proposal.status === "pending").length;
  }

  doctor(): Record<string, unknown> {
    const errors: Array<{ path: string; message: string }> = [];
    const warnings: Array<{ path: string; message: string }> = [];
    let memories = 0;
    let relations = 0;
    let suspendedRelations = 0;
    let pendingProposals = 0;
    const registry = this.readRegistry();
    for (const entry of registry.projects) {
      try {
        this.requireProject(entry.id);
        memories += this.getContext(entry.id, 1000).length;
        const projectRelations = this.getRelations(entry.id);
        relations += projectRelations.length;
        const keys = new Set<string>();
        for (const relation of projectRelations) {
          if (relation.ownerProjectId !== entry.id) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} has an invalid owner project.`,
            });
          }
          if (!RELATION_TYPES.includes(relation.type)) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} has an invalid type.`,
            });
            continue;
          }
          const key = relationKey(relation.type, relation.fromMemoryId, relation.toMemoryId);
          if (keys.has(key)) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Duplicate relation ${relation.id}.`,
            });
          }
          keys.add(key);
          if (relation.fromMemoryId === relation.toMemoryId) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Self relation ${relation.id}.`,
            });
          }
          const fromMemory = this.getMemory(relation.fromMemoryId);
          const toMemory = this.getMemory(relation.toMemoryId);
          if (!fromMemory || !toMemory) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} has a missing endpoint.`,
            });
          } else if (
            fromMemory.projectId !== relation.fromProjectId ||
            toMemory.projectId !== relation.toProjectId
          ) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} endpoint project metadata is inconsistent.`,
            });
          }
          const foreignProjectIds = new Set(
            [relation.fromProjectId, relation.toProjectId].filter((id) => id !== entry.id),
          );
          if ([...foreignProjectIds].some((id) => !this.hasReadAccess(entry.id, id))) {
            suspendedRelations += 1;
            warnings.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} is suspended because a project link is missing.`,
            });
          }
        }
        pendingProposals += this.countPendingProposals(entry.id);
      } catch (error) {
        errors.push({
          path: this.projectDir(entry.id),
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
    this.readLinks();
    return {
      ok: errors.length === 0,
      integrity: errors.length === 0 ? ["ok"] : errors,
      warnings,
      storageRoot: this.storageRoot,
      storageFormat: "markdown-json",
      schemaVersion: SCHEMA_VERSION,
      memorySchemaVersion: MEMORY_SCHEMA_VERSION,
      nodeVersion: process.version,
      counts: {
        projects: registry.projects.length,
        memories,
        relations,
        suspendedRelations,
        pendingProposals,
      },
    };
  }

  requireProject(projectId: string): ProjectRecord {
    const project = this.getProject(projectId);
    if (!project) {
      throw new ProjectMemoryError("PROJECT_NOT_REGISTERED", "Project is not registered.", {
        projectId,
      });
    }
    return project;
  }
}
