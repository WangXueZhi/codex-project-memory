import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";
import type { MemoryRecord, MemoryRelationRecord } from "../../src/types.js";
import { renderGraphHtml } from "../../src/view.js";

const root = path.resolve(import.meta.dirname, "../..");
const fixturePath = path.join(root, "test-results", "knowledge-graph-fixture.html");

function memory(
  id: string,
  title: string,
  topic: string,
  overrides: Partial<MemoryRecord> = {},
): MemoryRecord {
  return {
    id,
    projectId: "amazon-project",
    projectName: "示例电商项目",
    kind: "decision",
    title,
    summary: `${title}的摘要用于快速理解结论、证据边界和下一步行动。`,
    topic,
    content:
      `${title}的完整内容。这里使用足够长的中文段落验证详情区域能够自然换行，并且不会覆盖来源、关系或状态信息。` +
      "结论必须能够脱离原始对话独立理解，同时保留证据文件和报告定位。",
    tags: ["第一批货", "诊断"],
    sourceProjectId: null,
    sourcePath: null,
    sourceCommit: null,
    sourceFileHash: null,
    citations: [],
    confidence: "verified",
    status: "active",
    createdAt: "2026-07-14T00:00:00.000Z",
    updatedAt: "2026-07-14T01:00:00.000Z",
    stale: false,
    staleReason: null,
    ...overrides,
  };
}

const memories: MemoryRecord[] = [
  memory("m1", "第一批产品非广告诊断结论", "第一批货诊断", {
    kind: "status",
    citations: [
      {
        sourceProjectId: "amazon-project",
        sourceProjectName: "示例电商项目",
        sourcePath: "第一批货/输出/非广告诊断报告.md",
        role: "report",
        locator: "结论与建议",
        note: "完整诊断报告",
        sourceCommit: null,
        sourceFileHash: "hash-report",
        stale: false,
        staleReason: null,
        accessible: true,
        fileUrl: "file:///tmp/final-report.md",
      },
      {
        sourceProjectId: "amazon-project",
        sourceProjectName: "示例电商项目",
        sourcePath: "第一批货/数据/商品汇总.csv",
        role: "evidence",
        locator: "全部商品行",
        note: "诊断输入数据",
        sourceCommit: null,
        sourceFileHash: "hash-data",
        stale: false,
        staleReason: null,
        accessible: true,
        fileUrl: "file:///tmp/products.csv",
      },
    ],
  }),
  memory("m2", "非广告诊断的证据边界", "第一批货诊断", {
    kind: "pitfall",
    stale: true,
    staleReason: "第一批货/数据/流量来源.xlsx 的文件哈希已变化",
    citations: [
      {
        sourceProjectId: "amazon-project",
        sourceProjectName: "示例电商项目",
        sourcePath: "第一批货/数据/流量来源.xlsx",
        role: "evidence",
        locator: "流量来源列",
        note: "只能支持非广告流量层面的判断",
        sourceCommit: null,
        sourceFileHash: "old-hash",
        stale: true,
        staleReason: "文件内容已变化",
        accessible: true,
        fileUrl: "file:///tmp/traffic.xlsx",
      },
    ],
  }),
  memory("m3", "商品信息整理流程", "数据准备", { kind: "workflow" }),
  memory("m4", "库存字段采用统一口径", "数据准备", { kind: "convention" }),
  memory("m5", "诊断报告是后续复盘入口", "复盘", { kind: "architecture" }),
];

const relations: MemoryRelationRecord[] = [
  {
    id: "r1",
    ownerProjectId: "amazon-project",
    fromMemoryId: "m2",
    fromProjectId: "amazon-project",
    toMemoryId: "m1",
    toProjectId: "amazon-project",
    type: "supports",
    rationale: "证据边界限定了诊断结论可以覆盖的范围。",
    confidence: "verified",
    sourceProposalId: "proposal",
    status: "active",
    createdAt: "2026-07-14T00:00:00.000Z",
    updatedAt: "2026-07-14T00:00:00.000Z",
  },
  {
    id: "r2",
    ownerProjectId: "amazon-project",
    fromMemoryId: "m1",
    fromProjectId: "amazon-project",
    toMemoryId: "m5",
    toProjectId: "amazon-project",
    type: "derived_from",
    rationale: "复盘入口来源于已验证的诊断结论和报告。",
    confidence: "verified",
    sourceProposalId: "proposal",
    status: "active",
    createdAt: "2026-07-14T00:00:00.000Z",
    updatedAt: "2026-07-14T00:00:00.000Z",
  },
];

test.beforeAll(() => {
  mkdirSync(path.dirname(fixturePath), { recursive: true });
  writeFileSync(
    fixturePath,
    renderGraphHtml("示例电商项目", { nodes: memories, relations }, "2026-07-14T02:00:00.000Z"),
    { mode: 0o600 },
  );
});

test("renders and operates the offline knowledge workspace", async ({ page }, testInfo) => {
  const networkRequests: string[] = [];
  const pageErrors: string[] = [];
  page.on("request", (request) => {
    if (/^https?:/u.test(request.url())) networkRequests.push(request.url());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(pathToFileURL(fixturePath).href);

  await expect(page.getByRole("heading", { name: "示例电商项目" })).toBeVisible();
  await expect(page.locator(".app-shell")).toHaveClass(/mode-guide/u);
  await expect(page.getByRole("heading", { name: "先读结论，再沿关系和证据深入" })).toBeVisible();
  await expect(page.getByTestId("guide-highlights")).toBeVisible();
  await expect(page.getByTestId("relation-suggestions")).toBeVisible();
  await page.screenshot({
    path: path.join(root, "test-results", `knowledge-guide-${testInfo.project.name}.png`),
    fullPage: false,
  });
  const copyQuestion = page.getByRole("button", { name: "复制问题" }).first();
  if (await copyQuestion.count()) {
    await copyQuestion.click();
    await expect(page.getByRole("button", { name: "已复制" }).first()).toBeVisible();
  }
  await page.getByRole("button", { name: "图谱", exact: true }).click();
  await expect(page.getByRole("img", { name: "示例电商项目 记忆知识图谱" })).toBeVisible();
  await expect(page.locator(".app-shell")).toHaveClass(/mode-immersive/u);
  await expect(page.locator(".app-shell")).toHaveClass(/inspector-closed/u);
  await expect(page.getByLabel("关系图例")).toContainText("支持");
  const graphBackground = await page
    .locator(".graph-panel")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(graphBackground).toBe("rgb(9, 13, 24)");
  expect(await page.locator("canvas").count()).toBeGreaterThan(0);
  expect(networkRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
  await expect(page.getByRole("button", { name: "隐藏关联线索" })).toBeVisible();
  await page.getByRole("button", { name: "隐藏关联线索" }).click();
  await expect(page.getByRole("button", { name: "显示关联线索" })).toBeVisible();
  await page.getByRole("button", { name: "显示关联线索" }).click();

  const search = page.getByRole("searchbox", { name: "搜索知识图谱" });
  await search.fill("第一批产品");
  await page.getByRole("option", { name: /第一批产品非广告诊断结论/u }).click();
  await search.fill("");
  await expect(page.locator(".app-shell")).toHaveClass(/inspector-open/u);

  if (testInfo.project.name.startsWith("mobile")) {
    await expect(page.getByRole("button", { name: "图谱", exact: true })).toHaveClass(/active/u);
    await page.getByRole("button", { name: "详情", exact: true }).click();
    await expect(page.getByRole("heading", { name: "第一批产品非广告诊断结论" })).toBeVisible();
    await page.getByRole("button", { name: "导览", exact: true }).click();
    await expect(page.getByRole("heading", { name: "先读结论，再沿关系和证据深入" })).toBeVisible();
    await page.getByRole("button", { name: "图谱", exact: true }).click();
  } else {
    await expect(page.getByRole("heading", { name: "主题目录" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "第一批产品非广告诊断结论" })).toBeVisible();
    await page.getByRole("button", { name: "阅读", exact: true }).click();
    await expect(page.locator(".app-shell")).toHaveClass(/mode-reading/u);
    await page.getByRole("button", { name: "图谱", exact: true }).click();
    await expect(page.locator(".app-shell")).toHaveClass(/mode-immersive/u);
    await page.getByRole("button", { name: "暂停动态" }).click();
    await expect(page.getByText("动态已暂停")).toBeVisible();
    await page.getByRole("button", { name: "恢复动态" }).click();
    await expect(page.getByText("网络运行中")).toBeVisible();
    await page.getByRole("button", { name: "收起详情面板" }).click();
    await expect(page.locator(".app-shell")).toHaveClass(/inspector-closed/u);
    await page.getByRole("button", { name: "打开详情面板" }).click();
  }

  await search.fill("流量来源.xlsx");
  await expect(page.getByRole("option", { name: /非广告诊断的证据边界/u })).toBeVisible();
  await search.fill("");

  if (testInfo.project.name.startsWith("mobile")) {
    await page.getByRole("button", { name: "详情", exact: true }).click();
  }
  await page.getByRole("button", { name: "在图中展开" }).click();
  await expect(page.getByRole("button", { name: "收起图中来源" })).toBeVisible();
  if (testInfo.project.name.startsWith("mobile")) {
    await page.getByRole("button", { name: "图谱" }).click();
  }
  await expect(page.getByText("证据图层")).toBeVisible();
  await page.getByRole("button", { name: "适配全部" }).click();

  const viewport = page.viewportSize();
  const bodyMetrics = await page.locator("body").evaluate((body) => ({
    scrollWidth: body.scrollWidth,
    clientWidth: body.clientWidth,
    scrollHeight: body.scrollHeight,
    clientHeight: body.clientHeight,
  }));
  expect(bodyMetrics.scrollWidth).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
  expect(bodyMetrics.scrollHeight).toBeLessThanOrEqual((viewport?.height ?? 0) + 1);

  await page.screenshot({
    path: path.join(root, "test-results", `knowledge-graph-${testInfo.project.name}.png`),
    fullPage: false,
  });
});
