import cytoscape, { type Core, type EventObject } from "cytoscape";
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  CircleAlert,
  Compass,
  Copy,
  ExternalLink,
  FileCheck2,
  FileSearch,
  Files,
  Focus,
  Layers3,
  LocateFixed,
  Maximize2,
  Network,
  PanelLeft,
  PanelRight,
  Pause,
  Play,
  RotateCcw,
  Route,
  Search,
  SlidersHorizontal,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-preact";
import { render } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  buildGraphElements,
  CITATION_LABELS,
  KIND_LABELS,
  matchesMemory,
  memorySummary,
  RELATION_META,
  visibleMemories,
} from "./model.js";
import type {
  BrowserMemory,
  BrowserRelation,
  BrowserRelationSuggestion,
  FocusDepth,
  GraphFilters,
  GraphSelection,
  GraphViewData,
} from "./types.js";

cytoscape.use(dagre);
cytoscape.use(fcose);

const DEFAULT_FILTERS: GraphFilters = {
  topic: "",
  kind: "",
  relation: "",
  stale: "all",
  focusDepth: "all",
};

const GRAPH_STYLE = [
  {
    selector: "node",
    style: {
      "font-family": '"PingFang SC", "Microsoft YaHei", sans-serif',
      "overlay-opacity": 0,
      "transition-property": "opacity, background-color, border-color, border-width, shadow-blur, width, height",
      "transition-duration": "220ms",
    },
  },
  {
    selector: "node.memory",
    style: {
      width: "data(nodeSize)",
      height: "data(nodeSize)",
      shape: "ellipse",
      "background-color": "data(topicColor)",
      "border-color": "data(topicColor)",
      "border-width": 0.8,
      "shadow-blur": 9,
      "shadow-color": "#22d3ee",
      "shadow-opacity": 0.8,
      label: "",
      color: "#e2e8f0",
      "font-size": 13,
      "font-weight": 650,
      "text-wrap": "wrap",
      "text-max-width": 168,
      "text-valign": "center",
      "text-halign": "center",
      "text-margin-y": -19,
      "text-background-color": "#0b1020",
      "text-background-opacity": 0.78,
      "text-background-padding": 3,
      "text-border-width": 0,
    },
  },
  { selector: "node.memory.labeled", style: { label: "data(label)" } },
  {
    selector: "node.citation",
    style: {
      width: 4,
      height: 4,
      shape: "ellipse",
      "background-color": "#c084fc",
      "border-color": "#f0abfc",
      "border-width": 1,
      "shadow-blur": 6,
      "shadow-color": "#c084fc",
      "shadow-opacity": 0.55,
      label: "",
      color: "#cbd5e1",
      "font-size": 10,
      "text-wrap": "ellipsis",
      "text-max-width": 180,
      "text-valign": "center",
      "text-halign": "center",
      "text-margin-y": -17,
      "text-background-color": "#0b1020",
      "text-background-opacity": 0.9,
      "text-background-padding": 4,
    },
  },
  {
    selector: "node.stale",
    style: {
      "background-color": "#fdba74",
      "border-color": "#fb923c",
      "shadow-color": "#f97316",
    },
  },
  {
    selector: "edge",
    style: {
      width: 1.1,
      "curve-style": "bezier",
      "line-color": "data(color)",
      "target-arrow-color": "data(color)",
      "target-arrow-shape": "triangle",
      "arrow-scale": 0.65,
      label: "data(label)",
      color: "#e2e8f0",
      "font-size": 10,
      "font-weight": 600,
      "text-background-color": "#0b1020",
      "text-background-opacity": 0,
      "text-background-padding": 4,
      "text-rotation": "autorotate",
      "text-opacity": 0,
      "overlay-opacity": 0,
      "transition-property": "opacity, width, text-opacity, line-opacity",
      "transition-duration": "220ms",
    },
  },
  { selector: "edge.undirected", style: { "target-arrow-shape": "none" } },
  {
    selector: "edge.citation-edge",
    style: {
      "line-style": "dashed",
      "line-dash-pattern": [6, 5],
      width: 0.9,
      "target-arrow-shape": "none",
      "line-opacity": 0.55,
    },
  },
  {
    selector: "edge.suggestion-edge",
    style: {
      "line-style": "dashed",
      "line-dash-pattern": [3, 7],
      width: 1,
      "line-color": "#64748b",
      "target-arrow-shape": "none",
      "line-opacity": 0.55,
    },
  },
  {
    selector: "edge.layout-edge",
    style: {
      width: 0.1,
      opacity: 0,
      events: "no",
      "target-arrow-shape": "none",
    },
  },
  {
    selector: "edge.relation-contradicts, edge.relation-derived_from",
    style: { "line-style": "dashed", "line-dash-pattern": [8, 5] },
  },
  {
    selector: ".selected",
    style: {
      "border-color": "#f8fafc",
      "border-width": 2,
      "background-color": "#ffffff",
      "shadow-blur": 18,
      "shadow-color": "#67e8f9",
      "shadow-opacity": 1,
      width: 10,
      height: 10,
      label: "data(label)",
      opacity: 1,
    },
  },
  {
    selector: "node.hovered",
    style: {
      label: "data(label)",
      width: 8,
      height: 8,
      "shadow-blur": 16,
      "shadow-opacity": 1,
    },
  },
  {
    selector: "edge.selected, edge.hovered",
    style: { width: 2.8, "text-opacity": 1, "text-background-opacity": 0.92, opacity: 1 },
  },
  { selector: "edge.flow", style: { width: 1.8, "line-opacity": 1 } },
  { selector: ".neighbor", style: { opacity: 1 } },
  { selector: ".distant", style: { opacity: 0.34 } },
  {
    selector: ".search-hit",
    style: {
      "border-color": "#fef08a",
      "border-width": 1.5,
      "shadow-color": "#facc15",
      "shadow-blur": 15,
      "shadow-opacity": 1,
      width: 9,
      height: 9,
      label: "data(label)",
      opacity: 1,
    },
  },
  { selector: ".search-dim", style: { opacity: 0.2 } },
  { selector: ".pulse", style: { "shadow-blur": 20, "shadow-opacity": 1 } },
] as unknown as cytoscape.StylesheetStyle[];

function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 820px)").matches;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function IconButton({
  label,
  onClick,
  children,
  pressed,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: preact.ComponentChildren;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      class="icon-button"
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SegmentedControl({
  value,
  onChange,
}: {
  value: FocusDepth;
  onChange: (value: FocusDepth) => void;
}) {
  const items: Array<{ value: FocusDepth; label: string }> = [
    { value: "all", label: "全图" },
    { value: "1", label: "一层" },
    { value: "2", label: "两层" },
  ];
  return (
    <div class="segmented" role="group" aria-label="关系范围">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          class={value === item.value ? "active" : ""}
          aria-pressed={value === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function EmptyDetail() {
  return (
    <div class="detail-empty">
      <Network size={28} strokeWidth={1.5} />
      <strong>选择一条记忆</strong>
      <span>查看完整结论、来源与关系理由</span>
    </div>
  );
}

function MemoryDetail({
  memory,
  relations,
  data,
  sourcesExpanded,
  onToggleSources,
  onSelectMemory,
  onSelectCitation,
  onSelectRelation,
}: {
  memory: BrowserMemory;
  relations: BrowserRelation[];
  data: GraphViewData;
  sourcesExpanded: boolean;
  onToggleSources: () => void;
  onSelectMemory: (id: string) => void;
  onSelectCitation: (memoryId: string, index: number) => void;
  onSelectRelation: (id: string) => void;
}) {
  const incoming = relations.filter((relation) => relation.toMemoryId === memory.id);
  const outgoing = relations.filter((relation) => relation.fromMemoryId === memory.id);
  const otherMemory = (id: string) => data.memories.find((candidate) => candidate.id === id);
  return (
    <article class="detail-article">
      <div class="detail-kicker">
        <span class={`kind-mark kind-${memory.kind}`}>{KIND_LABELS[memory.kind]}</span>
        <span>{memory.topic ?? "未分组"}</span>
      </div>
      <h2>{memory.title}</h2>
      <p class="detail-summary">{memorySummary(memory)}</p>
      <dl class="metadata-grid">
        <dt>置信度</dt>
        <dd>{memory.confidence}</dd>
        <dt>更新时间</dt>
        <dd>{formatDate(memory.updatedAt)}</dd>
        <dt>状态</dt>
        <dd class={memory.stale ? "status-stale" : "status-active"}>
          {memory.stale ? `已过期 · ${memory.staleReason ?? "来源发生变化"}` : "有效"}
        </dd>
      </dl>

      <section class="detail-section">
        <h3>完整结论</h3>
        <p class="long-form">{memory.content}</p>
      </section>

      <section class="detail-section">
        <div class="section-heading">
          <h3>来源</h3>
          {memory.citations.length > 0 && (
            <button
              class="text-button"
              type="button"
              aria-pressed={sourcesExpanded}
              onClick={onToggleSources}
            >
              <Files size={15} />
              {sourcesExpanded ? "收起图中来源" : "在图中展开"}
            </button>
          )}
        </div>
        {memory.citations.length === 0 ? (
          <p class="empty-line">无已记录来源</p>
        ) : (
          <div class="source-list">
            {memory.citations.map((citation, index) => (
              <button
                class="source-row"
                type="button"
                key={`${citation.sourcePath}:${index}`}
                onClick={() => onSelectCitation(memory.id, index)}
              >
                <FileSearch size={17} />
                <span class="source-copy">
                  <strong>{CITATION_LABELS[citation.role]}</strong>
                  <span>{citation.sourceProjectName}/{citation.sourcePath}</span>
                  {citation.locator && <small>{citation.locator}</small>}
                </span>
                {citation.stale && <CircleAlert class="warning-icon" size={16} />}
              </button>
            ))}
          </div>
        )}
      </section>

      <section class="detail-section">
        <h3>出边 <span class="heading-count">{outgoing.length}</span></h3>
        {outgoing.length === 0 ? (
          <p class="empty-line">无出边关系</p>
        ) : (
          outgoing.map((relation) => {
            const other = otherMemory(relation.toMemoryId);
            return (
              <button class="relation-row" type="button" key={relation.id} onClick={() => onSelectRelation(relation.id)}>
                <span class="relation-direction">→ {RELATION_META[relation.type].label}</span>
                <strong onClick={(event) => { event.stopPropagation(); onSelectMemory(relation.toMemoryId); }}>
                  {other?.title ?? relation.toMemoryId}
                </strong>
                <span>{relation.rationale}</span>
              </button>
            );
          })
        )}
      </section>

      <section class="detail-section">
        <h3>入边 <span class="heading-count">{incoming.length}</span></h3>
        {incoming.length === 0 ? (
          <p class="empty-line">无入边关系</p>
        ) : (
          incoming.map((relation) => {
            const other = otherMemory(relation.fromMemoryId);
            return (
              <button class="relation-row" type="button" key={relation.id} onClick={() => onSelectRelation(relation.id)}>
                <span class="relation-direction">← {RELATION_META[relation.type].label}</span>
                <strong onClick={(event) => { event.stopPropagation(); onSelectMemory(relation.fromMemoryId); }}>
                  {other?.title ?? relation.fromMemoryId}
                </strong>
                <span>{relation.rationale}</span>
              </button>
            );
          })
        )}
      </section>
    </article>
  );
}

function CitationDetail({
  memory,
  citationIndex,
  onBack,
}: {
  memory: BrowserMemory;
  citationIndex: number;
  onBack: () => void;
}) {
  const citation = memory.citations[citationIndex];
  if (!citation) return <EmptyDetail />;
  return (
    <article class="detail-article">
      <button class="back-button" type="button" onClick={onBack}>
        <ChevronLeft size={16} /> 返回记忆
      </button>
      <div class="detail-kicker">
        <span class={`citation-mark citation-${citation.role}`}>{CITATION_LABELS[citation.role]}</span>
        <span>{citation.sourceProjectName}</span>
      </div>
      <h2>{citation.sourcePath.split("/").at(-1)}</h2>
      <p class="path-line">{citation.sourcePath}</p>
      <dl class="metadata-grid">
        <dt>位置</dt>
        <dd>{citation.locator ?? "未记录"}</dd>
        <dt>提交版本</dt>
        <dd>{citation.sourceCommit ?? "非 Git 来源"}</dd>
        <dt>状态</dt>
        <dd class={citation.stale ? "status-stale" : "status-active"}>
          {citation.stale ? `已过期 · ${citation.staleReason ?? "来源发生变化"}` : "有效"}
        </dd>
      </dl>
      {citation.note && (
        <section class="detail-section">
          <h3>来源说明</h3>
          <p class="long-form">{citation.note}</p>
        </section>
      )}
      {citation.fileUrl && (
        <a class="primary-action" href={citation.fileUrl}>
          <ExternalLink size={16} /> 打开本地文件
        </a>
      )}
    </article>
  );
}

function RelationDetail({
  relation,
  data,
  onSelectMemory,
}: {
  relation: BrowserRelation;
  data: GraphViewData;
  onSelectMemory: (id: string) => void;
}) {
  const from = data.memories.find((memory) => memory.id === relation.fromMemoryId);
  const to = data.memories.find((memory) => memory.id === relation.toMemoryId);
  const meta = RELATION_META[relation.type];
  return (
    <article class="detail-article">
      <div class="detail-kicker">
        <span class={`relation-mark relation-${relation.type}`}>{meta.label}</span>
        <span>{meta.directed ? "有向关系" : "双向关系"}</span>
      </div>
      <h2>关系详情</h2>
      <div class="relation-path">
        <button type="button" onClick={() => onSelectMemory(relation.fromMemoryId)}>{from?.title ?? relation.fromMemoryId}</button>
        <span>{meta.directed ? "→" : "↔"}</span>
        <button type="button" onClick={() => onSelectMemory(relation.toMemoryId)}>{to?.title ?? relation.toMemoryId}</button>
      </div>
      <section class="detail-section">
        <h3>关系理由</h3>
        <p class="long-form">{relation.rationale}</p>
      </section>
      <dl class="metadata-grid">
        <dt>类型</dt>
        <dd>{relation.type}</dd>
        <dt>置信度</dt>
        <dd>{relation.confidence}</dd>
      </dl>
    </article>
  );
}

function SuggestionDetail({
  suggestion,
  data,
  onSelectMemory,
}: {
  suggestion: BrowserRelationSuggestion;
  data: GraphViewData;
  onSelectMemory: (id: string) => void;
}) {
  const from = data.memories.find((memory) => memory.id === suggestion.fromMemoryId);
  const to = data.memories.find((memory) => memory.id === suggestion.toMemoryId);
  return (
    <article class="detail-article suggestion-detail">
      <div class="detail-kicker">
        <span class="relation-mark relation-suggestion">待审核</span>
        <span>结构信号，不代表事实置信度</span>
      </div>
      <h2>关联线索</h2>
      <div class="relation-path">
        <button type="button" onClick={() => onSelectMemory(suggestion.fromMemoryId)}>
          {from?.title ?? suggestion.fromMemoryId}
        </button>
        <span>↔</span>
        <button type="button" onClick={() => onSelectMemory(suggestion.toMemoryId)}>
          {to?.title ?? suggestion.toMemoryId}
        </button>
      </div>
      <section class="detail-section">
        <h3>为什么出现</h3>
        <p class="long-form">{suggestion.rationale}</p>
      </section>
      <section class="detail-section">
        <h3>结构信号</h3>
        <div class="signal-list">
          {suggestion.signals.map((signal) => (
            <div class="signal-row" key={signal.key}>
              <span>{signal.label}</span>
              <strong>+{signal.weight}</strong>
            </div>
          ))}
        </div>
      </section>
      <dl class="metadata-grid">
        <dt>候选类型</dt><dd>related_to</dd>
        <dt>线索强度</dt><dd>{suggestion.score}</dd>
        <dt>线索 ID</dt><dd>{suggestion.id}</dd>
      </dl>
      <p class="review-note">只有在 Codex 中明确提出“审核关系线索”，并通过既有审核流程后，才会写入正式关系。</p>
    </article>
  );
}

function GuideView({
  data,
  onOpenMemory,
  onExploreQuestion,
  onExploreSuggestion,
}: {
  data: GraphViewData;
  onOpenMemory: (id: string) => void;
  onExploreQuestion: (memoryIds: string[]) => void;
  onExploreSuggestion: (id: string) => void;
}) {
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);
  const memoryById = new Map(data.memories.map((memory) => [memory.id, memory]));
  const summary = data.guide.summary;
  const copyQuestion = async (id: string, question: string) => {
    try {
      await navigator.clipboard.writeText(question);
    } catch {
      const area = document.createElement("textarea");
      area.value = question;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopiedQuestionId(id);
    window.setTimeout(() => setCopiedQuestionId((current) => current === id ? null : current), 1400);
  };
  return (
    <main class="guide-workspace">
      <header class="guide-hero">
        <div>
          <span class="eyebrow"><Compass size={14} /> 知识导览</span>
          <h2>先读结论，再沿关系和证据深入</h2>
          <p>这是一份静态知识快照。导览告诉你从哪里开始、知识缺口在哪里，以及下一步可以问什么。</p>
        </div>
        <div class="guide-metrics" aria-label="项目知识概况">
          <span><strong>{summary.memoryCount}</strong>记忆</span>
          <span><strong>{summary.formalRelationCount}</strong>已审核关系</span>
          <span><strong>{summary.citationCount}</strong>来源</span>
          <span class={summary.isolatedCount > 0 ? "warning" : ""}><strong>{summary.isolatedCount}</strong>孤立节点</span>
        </div>
      </header>

      <div class="guide-columns">
        <div class="guide-primary">
          <section class="guide-section" data-testid="guide-highlights">
            <div class="guide-heading"><div><span>01</span><h3>推荐先读</h3></div><small>按连接、证据与更新时间选择</small></div>
            <div class="highlight-list">
              {data.guide.highlights.map((highlight, index) => (
                <button class="highlight-row" type="button" key={highlight.id} onClick={() => onOpenMemory(highlight.memoryId)}>
                  <span class="rank">{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{highlight.title}</strong><small>{highlight.reason}</small></span>
                  <ArrowRight size={17} />
                </button>
              ))}
              {data.guide.highlights.length === 0 && <p class="guide-empty">暂无可导览的记忆。</p>}
            </div>
          </section>

          <section class="guide-section">
            <div class="guide-heading"><div><span>02</span><h3>主题脉络</h3></div><small>{data.guide.topics.length} 个主题</small></div>
            <div class="topic-map">
              {data.guide.topics.map((topic) => (
                <div class="topic-band" key={topic.name}>
                  <div class="topic-band-heading"><strong>{topic.name}</strong><span>{topic.memoryCount} 条{topic.staleCount > 0 ? ` · ${topic.staleCount} 过期` : ""}</span></div>
                  <div class="topic-memory-links">
                    {topic.memoryIds.map((id) => (
                      <button type="button" key={id} onClick={() => onOpenMemory(id)}>{memoryById.get(id)?.title ?? id}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section class="guide-section">
            <div class="guide-heading"><div><span>03</span><h3>建议探索</h3></div><small>复制问题到 Codex，或在图中定位</small></div>
            <div class="question-list">
              {data.guide.suggestedQuestions.map((item) => (
                <div class="question-row" key={item.id}>
                  <button class="question-main" type="button" onClick={() => onExploreQuestion(item.memoryIds)}>
                    <strong>{item.question}</strong><small>{item.why}</small>
                  </button>
                  <IconButton label={copiedQuestionId === item.id ? "已复制" : "复制问题"} onClick={() => void copyQuestion(item.id, item.question)}>
                    {copiedQuestionId === item.id ? <Check size={16} /> : <Copy size={16} />}
                  </IconButton>
                </div>
              ))}
              {data.guide.suggestedQuestions.length === 0 && <p class="guide-empty">暂无建议问题。</p>}
            </div>
          </section>
        </div>

        <aside class="guide-secondary">
          <section class="guide-section compact">
            <div class="guide-heading"><div><CircleAlert size={15} /><h3>知识缺口</h3></div><small>{data.guide.gaps.length}</small></div>
            <div class="gap-list">
              {data.guide.gaps.map((gap) => (
                <button type="button" key={gap.id} onClick={() => gap.memoryIds[0] && onOpenMemory(gap.memoryIds[0])}>
                  <span class={`gap-dot gap-${gap.kind}`} />
                  <span>{gap.message}</span>
                </button>
              ))}
              {data.guide.gaps.length === 0 && <p class="guide-empty">未发现明显缺口。</p>}
            </div>
          </section>

          <section class="guide-section compact" data-testid="relation-suggestions">
            <div class="guide-heading"><div><Route size={15} /><h3>待审核关联线索</h3></div><small>{data.guide.relationSuggestions.length}</small></div>
            <p class="section-intro">来自共享来源、主题或稀有标签，仅作为结构提示。</p>
            <div class="suggestion-list">
              {data.guide.relationSuggestions.map((suggestion) => (
                <button type="button" key={suggestion.id} onClick={() => onExploreSuggestion(suggestion.id)}>
                  <span class="suggestion-titles">
                    <strong>{memoryById.get(suggestion.fromMemoryId)?.title ?? suggestion.fromMemoryId}</strong>
                    <i>↔</i>
                    <strong>{memoryById.get(suggestion.toMemoryId)?.title ?? suggestion.toMemoryId}</strong>
                  </span>
                  <span class="suggestion-meta">强度 {suggestion.score} · {suggestion.rationale}</span>
                </button>
              ))}
              {data.guide.relationSuggestions.length === 0 && <p class="guide-empty">暂无满足阈值的结构线索。</p>}
            </div>
          </section>

          <section class="guide-section compact evidence-summary">
            <div class="guide-heading"><div><FileCheck2 size={15} /><h3>证据状态</h3></div></div>
            <dl>
              <dt>可追溯来源</dt><dd>{summary.citationCount}</dd>
              <dt>失效来源</dt><dd class={summary.staleCitationCount > 0 ? "warning" : ""}>{summary.staleCitationCount}</dd>
              <dt>过期记忆</dt><dd class={summary.staleMemoryCount > 0 ? "warning" : ""}>{summary.staleMemoryCount}</dd>
              <dt>连通分量</dt><dd>{summary.componentCount}</dd>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}

function App({ data }: { data: GraphViewData }) {
  const graphRoot = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const initialized = useRef(false);
  const layoutModeRef = useRef<"immersive" | "reading" | null>(null);
  const positionsRef = useRef(new Map<string, { x: number; y: number }>());
  const [selection, setSelection] = useState<GraphSelection>(null);
  const [focusMemoryId, setFocusMemoryId] = useState<string | null>(null);
  const focusMemoryRef = useRef<string | null>(null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [filters, setFilters] = useState<GraphFilters>(DEFAULT_FILTERS);
  const [query, setQuery] = useState("");
  const [activePanel, setActivePanel] = useState<"guide" | "graph" | "details">("guide");
  const [viewMode, setViewMode] = useState<"guide" | "immersive" | "reading">("guide");
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const graphVisible = viewMode !== "guide";

  const memories = useMemo(
    () => visibleMemories(data, filters, focusMemoryId),
    [data, filters, focusMemoryId],
  );
  const elements = useMemo(
    () =>
      buildGraphElements(
        data,
        memories,
        filters.relation,
        sourcesExpanded ? focusMemoryId : null,
        showSuggestions,
      ),
    [data, memories, filters.relation, sourcesExpanded, focusMemoryId, showSuggestions],
  );
  const searchResults = useMemo(
    () => (query.trim() ? data.memories.filter((memory) => matchesMemory(memory, query)).slice(0, 8) : []),
    [data.memories, query],
  );
  const topics = useMemo(() => {
    const counts = new Map<string, { total: number; stale: number }>();
    for (const memory of data.memories) {
      const topic = memory.topic ?? "未分组";
      const count = counts.get(topic) ?? { total: 0, stale: 0 };
      count.total += 1;
      if (memory.stale) count.stale += 1;
      counts.set(topic, count);
    }
    return [...counts].sort(([left], [right]) => left.localeCompare(right, "zh-CN"));
  }, [data.memories]);

  const chooseMemory = (id: string) => {
    if (focusMemoryRef.current !== id) setSourcesExpanded(false);
    focusMemoryRef.current = id;
    setFocusMemoryId(id);
    setSelection({ type: "memory", id });
    setRightPanelOpen(true);
    if (isMobileViewport()) setActivePanel("details");
  };

  const chooseCitation = (memoryId: string, citationIndex: number) => {
    focusMemoryRef.current = memoryId;
    setFocusMemoryId(memoryId);
    setSelection({
      type: "citation",
      id: `citation:${memoryId}:${citationIndex}`,
      memoryId,
      citationIndex,
    });
    setRightPanelOpen(true);
    if (isMobileViewport()) setActivePanel("details");
  };

  const chooseRelation = (id: string) => {
    setSelection({ type: "relation", id });
    setRightPanelOpen(true);
    if (isMobileViewport()) setActivePanel("details");
  };

  const chooseSuggestion = (id: string) => {
    const suggestion = data.guide.relationSuggestions.find((candidate) => candidate.id === id);
    if (!suggestion) return;
    focusMemoryRef.current = suggestion.fromMemoryId;
    setFocusMemoryId(suggestion.fromMemoryId);
    setSelection({ type: "suggestion", id });
    setRightPanelOpen(true);
    setViewMode("immersive");
    setActivePanel(isMobileViewport() ? "details" : "graph");
  };

  useEffect(() => {
    if (!graphRoot.current) return;
    const cy = cytoscape({
      container: graphRoot.current,
      elements: [],
      style: GRAPH_STYLE,
      minZoom: 0.28,
      maxZoom: 2.5,
      wheelSensitivity: 0.18,
      boxSelectionEnabled: false,
      autoungrabify: false,
      autolock: false,
    });
    cyRef.current = cy;
    const selectNode = (event: EventObject) => {
      const node = event.target;
      const nodeType = node.data("nodeType") as string;
      if (nodeType === "citation") {
        chooseCitation(node.data("memoryId") as string, Number(node.data("citationIndex")));
      } else {
        chooseMemory(node.id());
      }
    };
    const selectEdge = (event: EventObject) => {
      const relationId = event.target.data("relationId") as string | undefined;
      if (relationId) chooseRelation(relationId);
      const suggestionId = event.target.data("suggestionId") as string | undefined;
      if (suggestionId) chooseSuggestion(suggestionId);
    };
    const clearSelection = (event: EventObject) => {
      if (event.target === cy) {
        setSelection(null);
        setRightPanelOpen(false);
      }
    };
    const hoverEdge = (event: EventObject) => event.target.addClass("hovered");
    const leaveEdge = (event: EventObject) => event.target.removeClass("hovered");
    const hoverNode = (event: EventObject) => event.target.addClass("hovered");
    const leaveNode = (event: EventObject) => event.target.removeClass("hovered");
    const rememberPosition = (event: EventObject) => {
      positionsRef.current.set(event.target.id(), event.target.position());
    };
    cy.on("tap", "node", selectNode);
    cy.on("tap", "edge.relation", selectEdge);
    cy.on("tap", "edge.suggestion-edge", selectEdge);
    cy.on("tap", clearSelection);
    cy.on("mouseover", "edge", hoverEdge);
    cy.on("mouseout", "edge", leaveEdge);
    cy.on("mouseover", "node", hoverNode);
    cy.on("mouseout", "node", leaveNode);
    cy.on("dragfree", "node", rememberPosition);
    const resize = () => cy.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cy.destroy();
      cyRef.current = null;
    };
  }, [graphVisible]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const previousZoom = cy.zoom();
    const previousPan = cy.pan();
    cy.nodes().forEach((node) => {
      positionsRef.current.set(node.id(), node.position());
    });
    cy.batch(() => {
      cy.elements().remove();
      cy.add(elements as cytoscape.ElementDefinition[]);
      cy.nodes().forEach((node) => {
        const previousPosition = positionsRef.current.get(node.id());
        if (previousPosition) {
          node.position(previousPosition);
          return;
        }
        if (node.data("nodeType") === "citation") {
          const parent = cy.getElementById(node.data("memoryId") as string);
          const index = Number(node.data("citationIndex"));
          const angle = -Math.PI / 2 + index * (Math.PI / 3);
          if (parent.nonempty()) {
            const origin = parent.position();
            node.position({ x: origin.x + Math.cos(angle) * 62, y: origin.y + Math.sin(angle) * 62 });
          }
        }
      });
    });
    if (viewMode === "guide") return;
    const shouldRelayout = !initialized.current || layoutModeRef.current !== viewMode;
    if (cy.nodes().length > 0 && shouldRelayout) {
      const layoutOptions = viewMode === "immersive"
        ? {
            name: "fcose",
            quality: "default",
            randomize: true,
            animate: !motionPaused,
            animationDuration: 700,
            fit: false,
            padding: 72,
            nodeRepulsion: 5200,
            idealEdgeLength: 170,
            edgeElasticity: 0.45,
            nestingFactor: 0.8,
            gravity: 0.22,
            numIter: 600,
          }
        : {
            name: "dagre",
            rankDir: "TB",
            rankSep: 82,
            nodeSep: 48,
            edgeSep: 24,
            animate: false,
            fit: false,
            padding: 42,
          };
      const layout = cy.layout(layoutOptions as cytoscape.LayoutOptions);
      layout.one("layoutstop", () => {
        cy.nodes().forEach((node) => {
          positionsRef.current.set(node.id(), node.position());
        });
        initialized.current = true;
        layoutModeRef.current = viewMode;
        cy.fit(undefined, 52);
      });
      layout.run();
    } else if (cy.nodes().length > 0) {
      cy.zoom(previousZoom);
      cy.pan(previousPan);
    } else {
      initialized.current = false;
      layoutModeRef.current = null;
    }
  }, [elements, viewMode, motionPaused]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || motionPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let cursor = 0;
    let active = false;
    const timer = window.setInterval(() => {
      const nodes = cy.nodes(".memory");
      if (nodes.length === 0) return;
      nodes.removeClass("pulse");
      cy.edges(".relation").removeClass("flow");
      active = !active;
      if (!active) return;
      const selected = selection?.type === "memory" ? cy.getElementById(selection.id) : null;
      const target = selected?.nonempty() ? selected : nodes[ cursor % nodes.length ];
      target?.addClass("pulse");
      target?.connectedEdges(".relation").addClass("flow");
      cursor += 1;
    }, 1200);
    return () => window.clearInterval(timer);
  }, [motionPaused, selection]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.batch(() => {
      cy.elements().removeClass("selected neighbor distant");
      if (!selection) return;
      if (selection.type === "memory") {
        const selected = cy.getElementById(selection.id);
        if (selected.nonempty()) {
          selected.addClass("selected");
          const connectedEdges = selected.connectedEdges(".relation, .citation-edge");
          const neighborhood = selected.union(connectedEdges).union(connectedEdges.connectedNodes());
          neighborhood.addClass("neighbor");
          cy.elements().not(neighborhood).addClass("distant");
        }
      } else if (selection.type === "citation") {
        const selected = cy.getElementById(selection.id);
        const memory = cy.getElementById(selection.memoryId);
        selected.addClass("selected");
        selected.connectedEdges().addClass("neighbor");
        memory.addClass("neighbor");
        cy.elements().not(selected.union(memory).union(selected.connectedEdges())).addClass("distant");
      } else if (selection.type === "relation") {
        const edge = cy.getElementById(`relation:${selection.id}`);
        edge.addClass("selected");
        edge.connectedNodes().addClass("neighbor");
        cy.elements().not(edge.union(edge.connectedNodes())).addClass("distant");
      } else {
        const edge = cy.getElementById(`suggestion:${selection.id}`);
        edge.addClass("selected");
        edge.connectedNodes().addClass("neighbor");
        cy.elements().not(edge.union(edge.connectedNodes())).addClass("distant");
      }
    });
  }, [selection, elements]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const matches = new Set(data.memories.filter((memory) => matchesMemory(memory, query)).map((memory) => memory.id));
    cy.batch(() => {
      cy.nodes(".memory").removeClass("search-hit search-dim");
      if (!query.trim()) return;
      cy.nodes(".memory").forEach((node) => {
        node.addClass(matches.has(node.id()) ? "search-hit" : "search-dim");
      });
    });
  }, [query, data.memories, elements]);

  useEffect(() => {
    if (viewMode === "guide" || (isMobileViewport() && activePanel !== "graph")) return;
    const frame = window.requestAnimationFrame(() => {
      cyRef.current?.resize();
      if (!initialized.current && cyRef.current?.nodes().length) {
        const layout = cyRef.current.layout({ name: viewMode === "reading" ? "dagre" : "fcose", animate: false, fit: true, padding: 52 } as cytoscape.LayoutOptions);
        layout.one("layoutstop", () => {
          initialized.current = true;
          layoutModeRef.current = viewMode;
        });
        layout.run();
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activePanel, viewMode]);

  const focusGraphNode = (id: string) => {
    setViewMode("immersive");
    chooseMemory(id);
    setActivePanel("graph");
    const cy = cyRef.current;
    const node = cy?.getElementById(id);
    if (node?.nonempty()) cy?.animate({ center: { eles: node }, duration: 260 });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    setSourcesExpanded(false);
  };

  const selectedMemory =
    selection?.type === "memory"
      ? data.memories.find((memory) => memory.id === selection.id)
      : selection?.type === "citation"
        ? data.memories.find((memory) => memory.id === selection.memoryId)
        : undefined;
  const selectedRelation =
    selection?.type === "relation"
      ? data.relations.find((relation) => relation.id === selection.id)
      : undefined;
  const selectedSuggestion =
    selection?.type === "suggestion"
      ? data.guide.relationSuggestions.find((suggestion) => suggestion.id === selection.id)
      : undefined;

  const openMemoryFromGuide = (id: string) => {
    chooseMemory(id);
    setViewMode("reading");
    setActivePanel("details");
  };

  const exploreQuestion = (memoryIds: string[]) => {
    const first = memoryIds[0];
    setViewMode("immersive");
    setActivePanel("graph");
    if (first) {
      focusMemoryRef.current = first;
      setFocusMemoryId(first);
      setSelection({ type: "memory", id: first });
    }
  };

  const updateFilter = <Key extends keyof GraphFilters>(key: Key, value: GraphFilters[Key]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div
      class={`app-shell mode-${viewMode} ${rightPanelOpen ? "inspector-open" : "inspector-closed"} ${topicsOpen ? "topics-open" : ""}`}
      data-mobile-panel={activePanel}
    >
      <header class="topbar">
        <div class="brand-block">
          <span class="brand-icon"><Network size={18} /></span>
          <div>
            <h1>{data.projectName}</h1>
            <p>记忆知识图谱 · 静态快照 {formatDate(data.generatedAt)}</p>
          </div>
        </div>
        <div class="search-wrap">
          <Search size={17} />
          <input
            type="search"
            value={query}
            placeholder="搜索结论、证据或文件"
            aria-label="搜索知识图谱"
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
          {query.trim() && (
            <div class="search-results" role="listbox" aria-label="搜索结果">
              {searchResults.length === 0 ? (
                <span class="search-empty">没有匹配的记忆</span>
              ) : (
                searchResults.map((memory) => (
                  <button key={memory.id} type="button" role="option" onClick={() => focusGraphNode(memory.id)}>
                    <span>{memory.topic ?? "未分组"}</span>
                    <strong>{memory.title}</strong>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <div class="snapshot-count">
          <strong>{data.memories.length}</strong><span>记忆</span>
          <strong>{data.relations.length}</strong><span>已审核关系</span>
        </div>
        <div class="top-actions">
          <div class="mode-switch" role="group" aria-label="显示模式">
            <button class={viewMode === "guide" ? "active" : ""} type="button" aria-pressed={viewMode === "guide"} onClick={() => { setViewMode("guide"); setActivePanel("guide"); }}>导览</button>
            <button class={viewMode === "immersive" ? "active" : ""} type="button" aria-pressed={viewMode === "immersive"} onClick={() => { setViewMode("immersive"); setActivePanel("graph"); }}>图谱</button>
            <button class={viewMode === "reading" ? "active" : ""} type="button" aria-pressed={viewMode === "reading"} onClick={() => { setViewMode("reading"); setActivePanel(selection ? "details" : "graph"); }}>阅读</button>
          </div>
          <IconButton label={motionPaused ? "恢复动态" : "暂停动态"} onClick={() => setMotionPaused((current) => !current)} pressed={motionPaused} disabled={viewMode === "guide"}>
            {motionPaused ? <Play size={16} /> : <Pause size={16} />}
          </IconButton>
          <IconButton label={rightPanelOpen ? "收起详情面板" : "打开详情面板"} onClick={() => setRightPanelOpen((current) => !current)} pressed={rightPanelOpen} disabled={viewMode === "guide"}>
            <PanelRight size={16} />
          </IconButton>
        </div>
      </header>

      <nav class="mobile-tabs" aria-label="移动端视图">
        <button class={activePanel === "guide" ? "active" : ""} type="button" onClick={() => { setActivePanel("guide"); setViewMode("guide"); }}>
          <Compass size={16} />导览
        </button>
        <button class={activePanel === "graph" ? "active" : ""} type="button" onClick={() => { setActivePanel("graph"); setViewMode("immersive"); }}>
          <Network size={16} />图谱
        </button>
        <button class={activePanel === "details" ? "active" : ""} type="button" onClick={() => { setActivePanel("details"); setViewMode("reading"); }}>
          <BookOpen size={16} />详情
        </button>
      </nav>

      {viewMode === "guide" ? (
        <GuideView
          data={data}
          onOpenMemory={openMemoryFromGuide}
          onExploreQuestion={exploreQuestion}
          onExploreSuggestion={chooseSuggestion}
        />
      ) : (
      <main class="workspace">
        <aside class="topic-panel">
          <div class="panel-heading">
            <div><span class="eyebrow">浏览</span><h2>主题目录</h2></div>
            <SlidersHorizontal size={17} />
          </div>
          <button
            class={`topic-row ${filters.topic === "" ? "active" : ""}`}
            type="button"
            onClick={() => updateFilter("topic", "")}
          >
            <span>全部主题</span><strong>{data.memories.length}</strong>
          </button>
          <div class="topic-list">
            {topics.map(([topic, count]) => (
              <button
                class={`topic-row ${filters.topic === topic ? "active" : ""}`}
                type="button"
                key={topic}
                onClick={() => updateFilter("topic", topic)}
              >
                <span>{topic}</span>
                <span class="topic-count"><strong>{count.total}</strong>{count.stale > 0 && <em>{count.stale} 过期</em>}</span>
              </button>
            ))}
          </div>

          <div class="filter-stack">
            <label>记忆类型
              <select value={filters.kind} onChange={(event) => updateFilter("kind", event.currentTarget.value)}>
                <option value="">全部类型</option>
                {Object.entries(KIND_LABELS).map(([value, label]) => <option value={value}>{label}</option>)}
              </select>
            </label>
            <label>关系类型
              <select value={filters.relation} onChange={(event) => updateFilter("relation", event.currentTarget.value)}>
                <option value="">全部关系</option>
                {Object.entries(RELATION_META).map(([value, meta]) => <option value={value}>{meta.label}</option>)}
              </select>
            </label>
            <label>有效状态
              <select value={filters.stale} onChange={(event) => updateFilter("stale", event.currentTarget.value as GraphFilters["stale"])}>
                <option value="all">全部状态</option>
                <option value="active">仅有效</option>
                <option value="stale">仅过期</option>
              </select>
            </label>
          </div>

          <div class="memory-index-heading">
            <span>当前记忆</span><strong>{memories.length}/{data.memories.length}</strong>
          </div>
          <div class="memory-index">
            {memories.map((memory) => (
              <button
                type="button"
                key={memory.id}
                class={focusMemoryId === memory.id ? "active" : ""}
                onClick={() => focusGraphNode(memory.id)}
              >
                <span class={`memory-dot ${memory.stale ? "stale" : ""}`} />
                <span><strong>{memory.title}</strong><small>{memorySummary(memory)}</small></span>
              </button>
            ))}
          </div>
        </aside>

        <section class="graph-panel">
          <div class="graph-toolbar">
            <SegmentedControl value={filters.focusDepth} onChange={(value) => updateFilter("focusDepth", value)} />
            <div class="toolbar-divider" />
            <IconButton label={topicsOpen ? "关闭主题导航" : "打开主题导航"} onClick={() => setTopicsOpen((current) => !current)} pressed={topicsOpen}><PanelLeft size={17} /></IconButton>
            <IconButton label={sourcesExpanded ? "关闭证据图层" : "打开证据图层"} onClick={() => setSourcesExpanded((current) => !current)} pressed={sourcesExpanded} disabled={!focusMemoryId}><Layers3 size={17} /></IconButton>
            <IconButton label={showSuggestions ? "隐藏关联线索" : "显示关联线索"} onClick={() => setShowSuggestions((current) => !current)} pressed={showSuggestions}><Route size={17} /></IconButton>
            <IconButton label="放大" onClick={() => cyRef.current?.zoom({ level: Math.min(2.5, (cyRef.current?.zoom() ?? 1) * 1.18), renderedPosition: { x: (graphRoot.current?.clientWidth ?? 0) / 2, y: (graphRoot.current?.clientHeight ?? 0) / 2 } })}><ZoomIn size={17} /></IconButton>
            <IconButton label="缩小" onClick={() => cyRef.current?.zoom({ level: Math.max(0.28, (cyRef.current?.zoom() ?? 1) / 1.18), renderedPosition: { x: (graphRoot.current?.clientWidth ?? 0) / 2, y: (graphRoot.current?.clientHeight ?? 0) / 2 } })}><ZoomOut size={17} /></IconButton>
            <IconButton label="适配全部" onClick={() => cyRef.current?.fit(undefined, 52)}><Maximize2 size={17} /></IconButton>
            <IconButton label="重新居中" onClick={() => {
              const cy = cyRef.current;
              const selectedId = selection?.type === "memory" ? selection.id : focusMemoryId;
              const node = selectedId ? cy?.getElementById(selectedId) : null;
              if (node?.nonempty()) cy?.animate({ center: { eles: node }, duration: 260 }); else cy?.center();
            }}><LocateFixed size={17} /></IconButton>
            <IconButton label="重新布局" onClick={() => {
              const cy = cyRef.current;
              if (!cy) return;
              initialized.current = false;
              const layout = cy.layout((viewMode === "immersive"
                ? { name: "fcose", quality: "default", randomize: true, animate: !motionPaused, animationDuration: 700, fit: false, padding: 72, nodeRepulsion: 5200, idealEdgeLength: 170, edgeElasticity: 0.45, gravity: 0.22, numIter: 600 }
                : { name: "dagre", rankDir: "TB", rankSep: 82, nodeSep: 48, edgeSep: 24, animate: false, fit: false, padding: 42 }) as unknown as cytoscape.LayoutOptions);
              layout.one("layoutstop", () => cy.fit(undefined, 72));
              layout.one("layoutstop", () => {
                cy.nodes().forEach((node) => {
                  positionsRef.current.set(node.id(), node.position());
                });
                initialized.current = true;
                layoutModeRef.current = viewMode;
              });
              layout.run();
            }}><Sparkles size={17} /></IconButton>
            <IconButton label="重置筛选" onClick={resetFilters}><RotateCcw size={17} /></IconButton>
          </div>
          <div class="graph-context" aria-label="当前图谱上下文">
            <span>主题</span><strong>{filters.topic || "全部主题"}</strong>
            <i />
            <span>模式</span><strong>{viewMode === "immersive" ? "沉浸网络" : "阅读布局"}</strong>
          </div>
          <div class="graph-stage" ref={graphRoot} role="img" aria-label={`${data.projectName} 记忆知识图谱`} />
          {memories.length === 0 && (
            <div class="graph-empty"><FileSearch size={28} /><strong>没有符合筛选条件的记忆</strong><button type="button" onClick={resetFilters}>清除筛选</button></div>
          )}
          <div class="graph-status">
            <span><i class="status-dot active" />{memories.length} 条记忆</span>
            <span><i class="status-line" />{elements.filter((element) => element.group === "edges" && element.data.edgeType === "relation").length} 条关系</span>
            <span><i class="status-line suggestion" />{showSuggestions ? data.guide.relationSuggestions.length : 0} 条线索</span>
            <span><Activity size={12} />{motionPaused ? "动态已暂停" : "网络运行中"}</span>
            {sourcesExpanded && <span><i class="status-line citation" />证据图层</span>}
          </div>
          <div class="relation-legend" aria-label="关系图例">
            {Object.entries(RELATION_META).map(([type, meta]) => (
              <span key={type}><i class={`legend-line relation-${type}`} />{meta.label}</span>
            ))}
            {showSuggestions && <span><i class="legend-line relation-suggestion" />待审核线索</span>}
          </div>
        </section>

        <aside class="detail-panel">
          <div class="panel-heading detail-panel-heading">
            <div><span class="eyebrow">阅读</span><h2>知识详情</h2></div>
            {selection?.type === "memory" && <Focus size={17} />}
          </div>
          <div class="detail-scroll">
            {!selection && <EmptyDetail />}
            {selection?.type === "memory" && selectedMemory && (
              <MemoryDetail
                memory={selectedMemory}
                relations={data.relations}
                data={data}
                sourcesExpanded={sourcesExpanded && focusMemoryId === selectedMemory.id}
                onToggleSources={() => setSourcesExpanded((current) => !current)}
                onSelectMemory={focusGraphNode}
                onSelectCitation={chooseCitation}
                onSelectRelation={chooseRelation}
              />
            )}
            {selection?.type === "citation" && selectedMemory && (
              <CitationDetail memory={selectedMemory} citationIndex={selection.citationIndex} onBack={() => chooseMemory(selectedMemory.id)} />
            )}
            {selection?.type === "relation" && selectedRelation && (
              <RelationDetail relation={selectedRelation} data={data} onSelectMemory={focusGraphNode} />
            )}
            {selection?.type === "suggestion" && selectedSuggestion && (
              <SuggestionDetail suggestion={selectedSuggestion} data={data} onSelectMemory={focusGraphNode} />
            )}
          </div>
        </aside>
      </main>
      )}
    </div>
  );
}

const dataTemplate = document.getElementById("graph-data") as HTMLTemplateElement | null;
const root = document.getElementById("app");
if (!dataTemplate || !root) throw new Error("Knowledge graph data is unavailable.");
const data = JSON.parse(dataTemplate.content.textContent ?? "{}") as GraphViewData;
render(<App data={data} />, root);
