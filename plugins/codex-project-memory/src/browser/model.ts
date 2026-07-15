import type {
  BrowserMemory,
  CitationRole,
  GraphElement,
  GraphFilters,
  GraphViewData,
  MemoryKind,
  RelationType,
} from "./types.js";

export const RELATION_META: Record<
  RelationType,
  { label: string; color: string; lineStyle: "solid" | "dashed"; directed: boolean }
> = {
  related_to: { label: "相关", color: "#c7d2fe", lineStyle: "solid", directed: false },
  depends_on: { label: "依赖", color: "#38bdf8", lineStyle: "solid", directed: true },
  supports: { label: "支持", color: "#34d399", lineStyle: "solid", directed: true },
  contradicts: { label: "矛盾", color: "#fb7185", lineStyle: "dashed", directed: false },
  supersedes: { label: "替代", color: "#f59e0b", lineStyle: "solid", directed: true },
  derived_from: { label: "来源于", color: "#c084fc", lineStyle: "dashed", directed: true },
};

export const KIND_LABELS: Record<MemoryKind, string> = {
  architecture: "架构",
  decision: "决策",
  workflow: "流程",
  convention: "约定",
  pitfall: "风险",
  status: "状态",
};

export const CITATION_LABELS: Record<CitationRole, string> = {
  evidence: "证据",
  report: "报告",
  workflow: "流程",
  reference: "参考",
};

export const TOPIC_COLORS = [
  "#67e8f9",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#60a5fa",
  "#f472b6",
  "#2dd4bf",
] as const;

function hashTopic(value: string): number {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + (character.codePointAt(0) ?? 0)) >>> 0;
  return hash;
}

export function topicColor(topic: string): string {
  return TOPIC_COLORS[hashTopic(topic) % TOPIC_COLORS.length] ?? TOPIC_COLORS[0];
}

export function memorySummary(memory: BrowserMemory): string {
  const fallback = memory.content.split(/[。！？.!?]\s*/u)[0] ?? memory.content;
  return (memory.summary ?? fallback).trim().slice(0, 160);
}

function truncate(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

export function matchesMemory(memory: BrowserMemory, rawQuery: string): boolean {
  const query = rawQuery.trim().toLocaleLowerCase("zh-CN");
  if (!query) return true;
  const citations = memory.citations
    .flatMap((citation) => [citation.sourcePath, citation.locator ?? "", citation.note ?? ""])
    .join(" ");
  return [
    memory.title,
    memory.summary ?? "",
    memory.content,
    memory.topic ?? "",
    memory.tags.join(" "),
    citations,
  ]
    .join(" ")
    .toLocaleLowerCase("zh-CN")
    .includes(query);
}

export function reachableMemoryIds(
  data: GraphViewData,
  startId: string,
  maxDepth: number,
): Set<string> {
  const visited = new Set<string>([startId]);
  let frontier = [startId];
  for (let depth = 0; depth < maxDepth && frontier.length > 0; depth += 1) {
    const next: string[] = [];
    for (const relation of data.relations) {
      for (const current of frontier) {
        const neighbor =
          relation.fromMemoryId === current
            ? relation.toMemoryId
            : relation.toMemoryId === current
              ? relation.fromMemoryId
              : null;
        if (neighbor && !visited.has(neighbor)) {
          visited.add(neighbor);
          next.push(neighbor);
        }
      }
    }
    frontier = next;
  }
  return visited;
}

export function visibleMemories(
  data: GraphViewData,
  filters: GraphFilters,
  focusMemoryId: string | null,
): BrowserMemory[] {
  const reachable =
    focusMemoryId && filters.focusDepth !== "all"
      ? reachableMemoryIds(data, focusMemoryId, Number(filters.focusDepth))
      : null;
  return data.memories.filter((memory) => {
    if (filters.topic && memory.topic !== filters.topic) return false;
    if (filters.kind && memory.kind !== filters.kind) return false;
    if (filters.stale === "active" && memory.stale) return false;
    if (filters.stale === "stale" && !memory.stale) return false;
    if (reachable && !reachable.has(memory.id)) return false;
    return true;
  });
}

export function buildGraphElements(
  data: GraphViewData,
  memories: BrowserMemory[],
  relationFilter: string,
  expandedMemoryId: string | null,
  showSuggestions = true,
): GraphElement[] {
  const memoryIds = new Set(memories.map((memory) => memory.id));
  const adjacency = new Map(memories.map((memory) => [memory.id, new Set<string>()]));
  const degree = new Map(memories.map((memory) => [memory.id, 0]));
  for (const relation of data.relations) {
    if (!memoryIds.has(relation.fromMemoryId) || !memoryIds.has(relation.toMemoryId)) continue;
    degree.set(relation.fromMemoryId, (degree.get(relation.fromMemoryId) ?? 0) + 1);
    degree.set(relation.toMemoryId, (degree.get(relation.toMemoryId) ?? 0) + 1);
  }
  const labelCount = Math.max(1, Math.ceil(memories.length * 0.2));
  const labeledIds = new Set(
    memories
      .slice()
      .sort(
        (left, right) =>
          (degree.get(right.id) ?? 0) - (degree.get(left.id) ?? 0) ||
          right.citations.length - left.citations.length ||
          left.id.localeCompare(right.id),
      )
      .slice(0, labelCount)
      .map((memory) => memory.id),
  );
  const showAllLabels = memories.length <= 12;
  const elements: GraphElement[] = memories.map((memory) => ({
    group: "nodes",
    data: {
      id: memory.id,
      nodeType: "memory",
      memoryId: memory.id,
      label: truncate(memory.title, 28),
      summary: memorySummary(memory),
      title: memory.title,
      topic: memory.topic ?? "未分组",
      kind: memory.kind,
      stale: memory.stale,
      citationCount: memory.citations.length,
      confidence: memory.confidence,
      degree: degree.get(memory.id) ?? 0,
      nodeSize:
        7 +
        Math.min(5, (degree.get(memory.id) ?? 0) * 2) +
        Math.min(3, Math.floor(memory.citations.length / 4)),
      topicColor: topicColor(memory.topic ?? "未分组"),
    },
    classes:
      `memory ${memory.stale ? "stale" : ""} ${showAllLabels || labeledIds.has(memory.id) ? "labeled" : ""}`.trim(),
  }));

  for (const relation of data.relations) {
    if (!memoryIds.has(relation.fromMemoryId) || !memoryIds.has(relation.toMemoryId)) continue;
    if (relationFilter && relation.type !== relationFilter) continue;
    const meta = RELATION_META[relation.type];
    adjacency.get(relation.fromMemoryId)?.add(relation.toMemoryId);
    adjacency.get(relation.toMemoryId)?.add(relation.fromMemoryId);
    elements.push({
      group: "edges",
      data: {
        id: `relation:${relation.id}`,
        relationId: relation.id,
        source: relation.fromMemoryId,
        target: relation.toMemoryId,
        edgeType: "relation",
        relationType: relation.type,
        label: meta.label,
        color: meta.color,
        directed: meta.directed,
        dashed: meta.lineStyle === "dashed",
      },
      classes: `relation relation-${relation.type} ${meta.directed ? "directed" : "undirected"}`,
    });
  }

  if (showSuggestions) {
    for (const suggestion of data.guide.relationSuggestions) {
      if (!memoryIds.has(suggestion.fromMemoryId) || !memoryIds.has(suggestion.toMemoryId))
        continue;
      adjacency.get(suggestion.fromMemoryId)?.add(suggestion.toMemoryId);
      adjacency.get(suggestion.toMemoryId)?.add(suggestion.fromMemoryId);
      elements.push({
        group: "edges",
        data: {
          id: `suggestion:${suggestion.id}`,
          suggestionId: suggestion.id,
          source: suggestion.fromMemoryId,
          target: suggestion.toMemoryId,
          edgeType: "suggestion",
          label: "待审核",
          color: "#64748b",
          directed: false,
          dashed: true,
          score: suggestion.score,
        },
        classes: "suggestion-edge undirected",
      });
    }
  }

  const components: string[][] = [];
  const visited = new Set<string>();
  for (const memory of memories) {
    if (visited.has(memory.id)) continue;
    const component: string[] = [];
    const queue = [memory.id];
    visited.add(memory.id);
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      component.push(current);
      for (const neighbor of adjacency.get(current) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    components.push(component);
  }
  components.sort((left, right) => right.length - left.length);
  const hub = components[0]
    ?.slice()
    .sort((left, right) => (adjacency.get(right)?.size ?? 0) - (adjacency.get(left)?.size ?? 0))[0];
  if (hub) {
    for (const component of components.slice(1)) {
      const representative = component
        .slice()
        .sort(
          (left, right) => (adjacency.get(right)?.size ?? 0) - (adjacency.get(left)?.size ?? 0),
        )[0];
      if (!representative) continue;
      elements.push({
        group: "edges",
        data: {
          id: `layout:${hub}:${representative}`,
          source: hub,
          target: representative,
          edgeType: "layout",
          color: "transparent",
        },
        classes: "layout-edge",
      });
    }
  }

  if (expandedMemoryId && memoryIds.has(expandedMemoryId)) {
    const memory = data.memories.find((candidate) => candidate.id === expandedMemoryId);
    memory?.citations.forEach((citation, index) => {
      const citationId = `citation:${memory.id}:${index}`;
      elements.push({
        group: "nodes",
        data: {
          id: citationId,
          nodeType: "citation",
          memoryId: memory.id,
          citationIndex: index,
          label: `${CITATION_LABELS[citation.role]} · ${citation.sourcePath.split("/").at(-1) ?? citation.sourcePath}`,
          role: citation.role,
          stale: citation.stale,
        },
        classes: `citation citation-${citation.role} ${citation.stale ? "stale" : ""}`.trim(),
      });
      elements.push({
        group: "edges",
        data: {
          id: `citation-edge:${memory.id}:${index}`,
          source: citationId,
          target: memory.id,
          edgeType: "citation",
          label: CITATION_LABELS[citation.role],
          color: "#8a7892",
          directed: true,
          dashed: true,
        },
        classes: "citation-edge",
      });
    });
  }

  return elements;
}
