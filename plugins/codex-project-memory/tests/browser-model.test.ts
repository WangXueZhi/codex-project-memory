import { describe, expect, test } from "vitest";
import {
  buildGraphElements,
  matchesMemory,
  RELATION_META,
  reachableMemoryIds,
  visibleMemories,
} from "../src/browser/model.js";
import type {
  BrowserGraphGuide,
  BrowserMemory,
  GraphViewData,
  RelationType,
} from "../src/browser/types.js";

function memory(id: string, overrides: Partial<BrowserMemory> = {}): BrowserMemory {
  return {
    id,
    projectId: "project",
    projectName: "Project",
    kind: "decision",
    title: `Memory ${id}`,
    summary: `Summary ${id}`,
    topic: "Topic",
    content: `Content ${id}`,
    tags: [],
    citations: [],
    confidence: "verified",
    updatedAt: "2026-07-14T00:00:00.000Z",
    stale: false,
    staleReason: null,
    ...overrides,
  };
}

function guide(overrides: Partial<BrowserGraphGuide> = {}): BrowserGraphGuide {
  return {
    projectId: "project",
    projectName: "Project",
    generatedAt: "2026-07-14T00:00:00.000Z",
    summary: {
      memoryCount: 0,
      formalRelationCount: 0,
      citationCount: 0,
      staleMemoryCount: 0,
      staleCitationCount: 0,
      componentCount: 0,
      isolatedCount: 0,
    },
    topics: [],
    highlights: [],
    gaps: [],
    suggestedQuestions: [],
    relationSuggestions: [],
    ...overrides,
  };
}

const relationTypes: RelationType[] = [
  "related_to",
  "depends_on",
  "supports",
  "contradicts",
  "supersedes",
  "derived_from",
];

describe("browser knowledge graph model", () => {
  test("provides distinct display metadata for every supported relation", () => {
    expect(Object.keys(RELATION_META).sort()).toEqual([...relationTypes].sort());
    expect(RELATION_META.related_to.directed).toBe(false);
    expect(RELATION_META.contradicts.directed).toBe(false);
    expect(RELATION_META.depends_on.directed).toBe(true);
    expect(RELATION_META).toMatchObject({
      related_to: { color: "#c7d2fe", lineStyle: "solid", directed: false },
      depends_on: { color: "#38bdf8", lineStyle: "solid", directed: true },
      supports: { color: "#34d399", lineStyle: "solid", directed: true },
      contradicts: { color: "#fb7185", lineStyle: "dashed", directed: false },
      supersedes: { color: "#f59e0b", lineStyle: "solid", directed: true },
      derived_from: { color: "#c084fc", lineStyle: "dashed", directed: true },
    });
  });

  test("builds point-node metadata and invisible layout links between disconnected components", () => {
    const data: GraphViewData = {
      projectName: "Project",
      generatedAt: "2026-07-14T00:00:00.000Z",
      memories: [memory("a", { stale: true }), memory("b"), memory("c")],
      relations: [
        {
          id: "ab",
          fromMemoryId: "a",
          toMemoryId: "b",
          type: "supports",
          rationale: "",
          confidence: "verified",
        },
      ],
      guide: guide(),
    };
    const elements = buildGraphElements(data, data.memories, "", null);
    const staleNode = elements.find((element) => element.data.id === "a");
    expect(staleNode?.classes).toContain("memory stale");
    expect(staleNode?.data.label).toBe("Memory a");
    expect(elements.filter((element) => element.data.edgeType === "relation")).toHaveLength(1);
    expect(elements.filter((element) => element.data.edgeType === "layout")).toHaveLength(1);
  });

  test("searches titles, content, tags, and citation paths without filtering the graph", () => {
    const item = memory("one", {
      tags: ["inventory"],
      citations: [
        {
          sourceProjectId: "project",
          sourceProjectName: "Project",
          sourcePath: "reports/diagnosis.md",
          role: "report",
          locator: "Conclusion",
          note: "First shipment",
          sourceCommit: null,
          stale: false,
          staleReason: null,
          accessible: true,
          fileUrl: "file:///tmp/diagnosis.md",
        },
      ],
    });
    expect(matchesMemory(item, "inventory")).toBe(true);
    expect(matchesMemory(item, "diagnosis.md")).toBe(true);
    expect(matchesMemory(item, "missing")).toBe(false);
  });

  test("limits focus traversal by depth and safely handles cycles", () => {
    const data: GraphViewData = {
      projectName: "Project",
      generatedAt: "2026-07-14T00:00:00.000Z",
      memories: [memory("a"), memory("b"), memory("c"), memory("d")],
      relations: [
        {
          id: "ab",
          fromMemoryId: "a",
          toMemoryId: "b",
          type: "supports",
          rationale: "",
          confidence: "verified",
        },
        {
          id: "bc",
          fromMemoryId: "b",
          toMemoryId: "c",
          type: "depends_on",
          rationale: "",
          confidence: "verified",
        },
        {
          id: "ca",
          fromMemoryId: "c",
          toMemoryId: "a",
          type: "related_to",
          rationale: "",
          confidence: "verified",
        },
      ],
      guide: guide(),
    };
    expect([...reachableMemoryIds(data, "a", 1)].sort()).toEqual(["a", "b", "c"]);
    expect([...reachableMemoryIds(data, "a", 2)].sort()).toEqual(["a", "b", "c"]);
    expect(
      visibleMemories(
        data,
        { topic: "", kind: "", relation: "", stale: "all", focusDepth: "1" },
        "a",
      ),
    ).toHaveLength(3);
  });

  test("adds citations only for the expanded memory and keeps them out of formal relations", () => {
    const withCitation = memory("a", {
      citations: [
        {
          sourceProjectId: "project",
          sourceProjectName: "Project",
          sourcePath: "evidence/source.csv",
          role: "evidence",
          locator: null,
          note: null,
          sourceCommit: null,
          stale: false,
          staleReason: null,
          accessible: true,
          fileUrl: "file:///tmp/source.csv",
        },
      ],
    });
    const data: GraphViewData = {
      projectName: "Project",
      generatedAt: "2026-07-14T00:00:00.000Z",
      memories: [withCitation, memory("b")],
      relations: [
        {
          id: "ab",
          fromMemoryId: "a",
          toMemoryId: "b",
          type: "supports",
          rationale: "",
          confidence: "verified",
        },
      ],
      guide: guide(),
    };
    const compact = buildGraphElements(data, data.memories, "", null);
    const expanded = buildGraphElements(data, data.memories, "", "a");
    expect(compact.filter((element) => element.data.edgeType === "citation")).toHaveLength(0);
    expect(expanded.filter((element) => element.data.edgeType === "citation")).toHaveLength(1);
    expect(expanded.filter((element) => element.data.edgeType === "relation")).toHaveLength(1);
  });

  test("builds a 100-memory view within the supported node limit", () => {
    const memories = Array.from({ length: 100 }, (_, index) => memory(String(index)));
    const data: GraphViewData = {
      projectName: "Large",
      generatedAt: "2026-07-14T00:00:00.000Z",
      memories,
      relations: [],
      guide: guide(),
    };
    const startedAt = performance.now();
    const elements = buildGraphElements(data, memories, "", null);
    expect(elements.filter((element) => element.group === "nodes")).toHaveLength(100);
    expect(performance.now() - startedAt).toBeLessThan(100);
  });

  test("renders small graphs with stable topic colors and display-only suggestions", () => {
    const memories = [
      memory("a", {
        topic: "Diagnosis",
        citations: Array(4)
          .fill(null)
          .map((_, index) => ({
            sourceProjectId: "project",
            sourceProjectName: "Project",
            sourcePath: `evidence/${index}.csv`,
            role: "evidence" as const,
            locator: null,
            note: null,
            sourceCommit: null,
            stale: false,
            staleReason: null,
            accessible: true,
            fileUrl: null,
          })),
      }),
      memory("b", { topic: "Diagnosis" }),
    ];
    const data: GraphViewData = {
      projectName: "Project",
      generatedAt: "2026-07-14T00:00:00.000Z",
      memories,
      relations: [],
      guide: guide({
        relationSuggestions: [
          {
            id: "hint_1",
            projectId: "project",
            fromMemoryId: "a",
            toMemoryId: "b",
            type: "related_to",
            rationale: "同属主题",
            score: 2,
            signals: [
              {
                kind: "same_topic",
                key: "topic:Diagnosis",
                label: "同属主题：Diagnosis",
                weight: 2,
              },
            ],
          },
        ],
      }),
    };
    const withSuggestion = buildGraphElements(data, memories, "", null, true);
    const withoutSuggestion = buildGraphElements(data, memories, "", null, false);
    const nodes = withSuggestion.filter((element) => element.group === "nodes");
    expect(nodes.every((node) => node.classes?.includes("labeled"))).toBe(true);
    expect(nodes[0]?.data.topicColor).toBe(nodes[1]?.data.topicColor);
    expect(Number(nodes[0]?.data.nodeSize)).toBeGreaterThan(Number(nodes[1]?.data.nodeSize));
    expect(withSuggestion.filter((element) => element.data.edgeType === "suggestion")).toHaveLength(
      1,
    );
    expect(
      withoutSuggestion.filter((element) => element.data.edgeType === "suggestion"),
    ).toHaveLength(0);
    expect([...reachableMemoryIds(data, "a", 1)]).toEqual(["a"]);
  });
});
