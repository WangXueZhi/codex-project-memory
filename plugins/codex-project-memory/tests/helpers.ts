import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { ProjectMemoryService } from "../src/service.js";
import { MemoryStore } from "../src/store.js";

export interface TestContext {
  root: string;
  dataDir: string;
  service: ProjectMemoryService;
  cleanup: () => void;
}

export function createTestContext(): TestContext {
  const root = mkdtempSync(path.join(tmpdir(), "codex-project-memory-"));
  const dataDir = path.join(root, "data");
  const store = new MemoryStore(dataDir);
  return {
    root,
    dataDir,
    service: new ProjectMemoryService(store, dataDir),
    cleanup: () => {
      store.close();
      rmSync(root, { recursive: true, force: true });
    },
  };
}

export function makeProject(root: string, name: string): string {
  const projectPath = path.join(root, name);
  mkdirSync(projectPath, { recursive: true });
  return projectPath;
}

export function writeProjectFile(projectPath: string, relativePath: string, content: string): void {
  const target = path.join(projectPath, relativePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}

export function initGitRepo(projectPath: string): void {
  execFileSync("git", ["init", "-b", "main"], { cwd: projectPath, stdio: "ignore" });
  writeProjectFile(projectPath, "README.md", "# Test project\n");
  execFileSync("git", ["add", "README.md"], { cwd: projectPath, stdio: "ignore" });
  execFileSync(
    "git",
    ["-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "init"],
    { cwd: projectPath, stdio: "ignore" },
  );
}
