import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeKnowledgeGraph } from "./guide.js";
import type {
  GraphGuide,
  MemoryCitationRecord,
  MemoryRecord,
  MemoryRelationRecord,
  RelationType,
} from "./types.js";

export interface KnowledgeGraph {
  nodes: MemoryRecord[];
  relations: MemoryRelationRecord[];
}

const RELATION_LABELS: Record<RelationType, string> = {
  related_to: "相关",
  depends_on: "依赖",
  supports: "支持",
  contradicts: "矛盾",
  supersedes: "替代",
  derived_from: "来源于",
};

const CITATION_LABELS: Record<MemoryCitationRecord["role"], string> = {
  evidence: "证据",
  report: "报告",
  workflow: "流程",
  reference: "参考",
};

function summaryFor(memory: MemoryRecord): string {
  const value = memory.summary ?? memory.content.split(/[。！？.!?]\s*/u)[0] ?? memory.content;
  return value.trim().slice(0, 140);
}

function markdownText(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("|", "\\|");
}

export function renderGraphMarkdown(
  projectName: string,
  graph: KnowledgeGraph,
  generatedAt = new Date().toISOString(),
  providedGuide?: GraphGuide,
): string {
  const projectId = providedGuide?.projectId ?? graph.nodes[0]?.projectId ?? "unknown-project";
  const guide =
    providedGuide ?? analyzeKnowledgeGraph(projectId, projectName, graph, generatedAt, 12);
  const memoryById = new Map(graph.nodes.map((memory) => [memory.id, memory]));
  const lines = [
    `# ${projectName} 记忆知识图谱`,
    "",
    `> 静态快照：${generatedAt}`,
    "",
    "## 知识概况",
    "",
    `- ${guide.summary.memoryCount} 条记忆 · ${guide.summary.formalRelationCount} 条已审核关系 · ${guide.summary.citationCount} 个来源`,
    `- ${guide.summary.componentCount} 个连通分量 · ${guide.summary.isolatedCount} 个孤立节点`,
    `- ${guide.summary.staleMemoryCount} 条过期记忆 · ${guide.summary.staleCitationCount} 个失效来源`,
    "",
    "## 推荐先读",
    "",
  ];
  if (guide.highlights.length === 0) {
    lines.push("- 暂无记忆");
  } else {
    for (const highlight of guide.highlights) {
      lines.push(`- **${markdownText(highlight.title)}**：${markdownText(highlight.reason)}`);
    }
  }
  lines.push("", "## 知识缺口", "");
  if (guide.gaps.length === 0) {
    lines.push("- 未发现明显缺口");
  } else {
    for (const gap of guide.gaps) lines.push(`- ${markdownText(gap.message)}`);
  }
  lines.push("", "## 建议探索", "");
  if (guide.suggestedQuestions.length === 0) {
    lines.push("- 暂无建议问题");
  } else {
    for (const question of guide.suggestedQuestions) {
      lines.push(`- **${markdownText(question.question)}** · ${markdownText(question.why)}`);
    }
  }
  lines.push("", "## 待审核关联线索", "");
  if (guide.relationSuggestions.length === 0) {
    lines.push("- 暂无关联线索");
  } else {
    for (const suggestion of guide.relationSuggestions) {
      const from = memoryById.get(suggestion.fromMemoryId);
      const to = memoryById.get(suggestion.toMemoryId);
      lines.push(
        `- \`${suggestion.id}\` · **${markdownText(from?.title ?? suggestion.fromMemoryId)}** ↔ **${markdownText(to?.title ?? suggestion.toMemoryId)}** · 强度 ${suggestion.score} · ${markdownText(suggestion.rationale)}`,
      );
    }
  }
  lines.push("", "## 主题概览", "");
  for (const topic of guide.topics) {
    lines.push(
      "- **" +
        markdownText(topic.name) +
        "**：" +
        topic.memoryCount +
        " 条记忆，" +
        topic.staleCount +
        " 条过期",
    );
  }
  lines.push("", "## 记忆详情", "");
  for (const memory of graph.nodes) {
    lines.push(
      `### ${markdownText(memory.title)}${memory.stale ? " [已过期]" : ""}`,
      "",
      `- 主题：${markdownText(memory.topic ?? "未分组")}`,
      `- 类型：${memory.kind}`,
      `- 摘要：${markdownText(summaryFor(memory))}`,
      `- 置信度：${memory.confidence}`,
      `- 更新时间：${memory.updatedAt}`,
      "",
      memory.content,
      "",
      "**来源**",
      "",
    );
    if (memory.citations.length === 0) {
      lines.push("- 无已记录来源");
    } else {
      for (const citation of memory.citations) {
        const locator = citation.locator ? ` · ${markdownText(citation.locator)}` : "";
        const stale = citation.stale ? ` · 已过期：${citation.staleReason}` : "";
        lines.push(
          "- " +
            CITATION_LABELS[citation.role] +
            " · " +
            markdownText(`${citation.sourceProjectName}/${citation.sourcePath}`) +
            locator +
            stale +
            (citation.note ? ` · ${markdownText(citation.note)}` : ""),
        );
      }
    }
    const connected = graph.relations.filter(
      (relation) => relation.fromMemoryId === memory.id || relation.toMemoryId === memory.id,
    );
    lines.push("", "**关系**", "");
    if (connected.length === 0) {
      lines.push("- 无已记录关系");
    } else {
      for (const relation of connected) {
        const outgoing = relation.fromMemoryId === memory.id;
        const otherId = outgoing ? relation.toMemoryId : relation.fromMemoryId;
        const other = graph.nodes.find((candidate) => candidate.id === otherId);
        lines.push(
          "- " +
            (outgoing ? "→ " : "← ") +
            RELATION_LABELS[relation.type] +
            " · " +
            markdownText(other?.title ?? otherId) +
            " · " +
            markdownText(relation.rationale) +
            " · " +
            relation.confidence,
        );
      }
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function buildViewData(
  projectName: string,
  graph: KnowledgeGraph,
  generatedAt: string,
  guide: GraphGuide,
) {
  return {
    projectName,
    generatedAt,
    guide,
    memories: graph.nodes.map((memory) => ({
      id: memory.id,
      projectId: memory.projectId,
      projectName: memory.projectName,
      kind: memory.kind,
      title: memory.title,
      summary: memory.summary,
      topic: memory.topic,
      content: memory.content,
      tags: memory.tags,
      citations: memory.citations.map((citation) => ({
        sourceProjectId: citation.sourceProjectId,
        sourceProjectName: citation.sourceProjectName,
        sourcePath: citation.sourcePath,
        role: citation.role,
        locator: citation.locator,
        note: citation.note,
        sourceCommit: citation.sourceCommit,
        stale: citation.stale,
        staleReason: citation.staleReason,
        accessible: citation.accessible,
        fileUrl: citation.accessible ? citation.fileUrl : null,
      })),
      confidence: memory.confidence,
      updatedAt: memory.updatedAt,
      stale: memory.stale,
      staleReason: memory.staleReason,
    })),
    relations: graph.relations.map((relation) => ({
      id: relation.id,
      fromMemoryId: relation.fromMemoryId,
      toMemoryId: relation.toMemoryId,
      type: relation.type,
      rationale: relation.rationale,
      confidence: relation.confidence,
    })),
  };
}

function htmlText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function browserAsset(name: "graph-app.css" | "graph-app.js"): string {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(moduleDir, "browser", name),
    path.resolve(moduleDir, "..", "dist", "browser", name),
  ];
  const assetPath = candidates.find((candidate) => existsSync(candidate));
  if (!assetPath) {
    throw new Error(`Browser asset ${name} is missing. Run pnpm build:browser first.`);
  }
  return readFileSync(assetPath, "utf8");
}

function contentHash(value: string): string {
  return createHash("sha256").update(value).digest("base64");
}

export function renderGraphHtml(
  projectName: string,
  graph: KnowledgeGraph,
  generatedAt = new Date().toISOString(),
  providedGuide?: GraphGuide,
): string {
  const projectId = providedGuide?.projectId ?? graph.nodes[0]?.projectId ?? "unknown-project";
  const guide =
    providedGuide ?? analyzeKnowledgeGraph(projectId, projectName, graph, generatedAt, 12);
  const data = buildViewData(projectName, graph, generatedAt, guide);
  const css = browserAsset("graph-app.css").replaceAll("</style", "<\\/style");
  const script = browserAsset("graph-app.js").replaceAll("</script", "<\\/script");
  const csp = [
    "default-src 'none'",
    `style-src 'sha256-${contentHash(css)}'`,
    `script-src 'sha256-${contentHash(script)}'`,
    "img-src data:",
    "font-src 'none'",
    "connect-src 'none'",
    "media-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-src 'none'",
    "worker-src 'none'",
  ].join("; ");

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${htmlAttribute(csp)}">
<title>${htmlText(projectName)} · 记忆知识图谱</title>
<style>${css}</style>
</head>
<body>
<div id="app"></div>
<template id="graph-data">${htmlText(JSON.stringify(data))}</template>
<script>${script}</script>
</body>
</html>
`;
}
