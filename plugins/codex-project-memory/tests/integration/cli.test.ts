import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";

const cleanups: Array<() => void> = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
});

function runCli(
  cwd: string,
  dataDir: string,
  args: string[],
  input?: unknown,
): Record<string, unknown> {
  const result = spawnSync(process.execPath, [path.resolve("dist/project-memory.mjs"), ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, CODEX_PROJECT_MEMORY_HOME: dataDir },
    input: input === undefined ? undefined : JSON.stringify(input),
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return JSON.parse(result.stdout) as Record<string, unknown>;
}

function runCliText(cwd: string, dataDir: string, args: string[]): string {
  const result = spawnSync(process.execPath, [path.resolve("dist/project-memory.mjs"), ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, CODEX_PROJECT_MEMORY_HOME: dataDir },
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
}

describe("Skill CLI", () => {
  test("completes registration, linking, read-only search, and reviewed commit", () => {
    const root = mkdtempSync(path.join(tmpdir(), "codex-project-memory-cli-"));
    cleanups.push(() => rmSync(root, { recursive: true, force: true }));
    const pluginRoot = path.resolve(".");
    const dataDir = path.join(root, "data");
    const projectAPath = path.join(root, "a");
    const projectBPath = path.join(root, "b");
    mkdirSync(projectAPath);
    mkdirSync(projectBPath);
    writeFileSync(path.join(projectAPath, "README.md"), "shared protocol lives here\n");

    const projectA = runCli(pluginRoot, dataDir, ["register", "--path", projectAPath]);
    const projectB = runCli(pluginRoot, dataDir, ["register", "--path", projectBPath]);
    runCli(pluginRoot, dataDir, [
      "link",
      "--source-project-id",
      projectB.id as string,
      "--target-project-id",
      projectA.id as string,
    ]);
    const search = runCli(pluginRoot, dataDir, [
      "search-files",
      "--path",
      projectBPath,
      "--target-project-id",
      projectA.id as string,
      "--query",
      "protocol",
    ]);
    expect(search.results).toHaveLength(1);

    const proposal = runCli(pluginRoot, dataDir, ["propose", "--path", projectBPath], {
      candidates: [
        {
          ref: "protocol-source",
          kind: "architecture",
          title: "Protocol source",
          content: "Project A documents the shared protocol.",
          sourceProjectId: projectA.id,
          sourcePath: "README.md",
        },
        {
          ref: "verification-flow",
          kind: "workflow",
          title: "Protocol verification",
          content: "Verify the shared protocol before release.",
        },
      ],
      relations: [
        {
          from: { candidateRef: "verification-flow" },
          to: { candidateRef: "protocol-source" },
          type: "depends_on",
          rationale: "验证流程依赖协议来源",
          confidence: "verified",
        },
      ],
    });
    const items = proposal.items as Array<{ id: string }>;
    const relationItems = proposal.relationItems as Array<{ id: string }>;
    const committed = runCli(pluginRoot, dataDir, [
      "commit",
      "--proposal-id",
      proposal.id as string,
      "--accepted-item-ids",
      items.map((item) => item.id).join(","),
      "--accepted-relation-ids",
      relationItems[0]?.id ?? "",
    ]);
    const context = runCli(pluginRoot, dataDir, ["load", "--path", projectBPath]);
    expect(context.memories).toHaveLength(2);
    const committedMemories = committed.memories as Array<{ id: string }>;
    const updateProposal = runCli(pluginRoot, dataDir, ["propose", "--path", projectBPath], {
      updates: [
        {
          memoryId: committedMemories[0]?.id ?? "",
          summary: "The shared protocol is traceable to project A.",
          topic: "Protocol",
          citations: [
            {
              sourceProjectId: projectA.id as string,
              sourcePath: "README.md",
              role: "reference",
            },
          ],
        },
      ],
    });
    const updateItems = updateProposal.updateItems as Array<{ id: string }>;
    const updated = runCli(pluginRoot, dataDir, [
      "commit",
      "--proposal-id",
      updateProposal.id as string,
      "--accepted-update-ids",
      updateItems[0]?.id ?? "",
    ]);
    expect(updated.updatedMemories).toHaveLength(1);
    const graph = runCli(pluginRoot, dataDir, [
      "graph",
      "--path",
      projectBPath,
      "--memory-id",
      committedMemories[0]?.id ?? "",
      "--depth",
      "1",
    ]);
    expect(graph.nodes).toHaveLength(2);
    expect(graph.relations).toHaveLength(1);
    const guide = runCli(pluginRoot, dataDir, ["guide", "--path", projectBPath]);
    expect(guide.summary).toMatchObject({ memoryCount: 2, formalRelationCount: 1 });
    expect(guide).toHaveProperty("suggestedQuestions");
    expect(guide).toHaveProperty("relationSuggestions");
    const mermaid = runCliText(pluginRoot, dataDir, [
      "graph",
      "--path",
      projectBPath,
      "--format",
      "mermaid",
    ]);
    expect(mermaid).toContain("graph TD");
    const markdown = runCliText(pluginRoot, dataDir, [
      "graph",
      "--path",
      projectBPath,
      "--format",
      "markdown",
    ]);
    expect(markdown).toContain("## 主题概览");
    expect(markdown).toContain("## 知识概况");
    expect(markdown).toContain("README.md");
    const htmlView = runCli(pluginRoot, dataDir, [
      "graph",
      "--path",
      projectBPath,
      "--format",
      "html",
    ]);
    expect(htmlView.outputPath).toContain("KNOWLEDGE_GRAPH.html");
    const html = readFileSync(htmlView.outputPath as string, "utf8");
    expect(html).toContain('id="app"');
    expect(html).toContain('id="graph-data"');
    expect(html).toContain("script-src 'sha256-");
    const exported = runCli(pluginRoot, dataDir, ["export", "--path", projectBPath]);
    expect(exported.relations).toHaveLength(1);
    const committedRelations = committed.relations as Array<{ id: string }>;
    const forgotten = runCli(pluginRoot, dataDir, [
      "forget-relations",
      "--path",
      projectBPath,
      "--relation-ids",
      committedRelations[0]?.id ?? "",
    ]);
    expect(forgotten.forgottenRelationIds).toHaveLength(1);
  });
});
