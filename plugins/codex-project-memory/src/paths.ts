import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import picomatch from "picomatch";

export interface LocalConfig {
  denyPatterns: string[];
}

export function resolveDataDir(): string {
  const explicit = process.env.CODEX_PROJECT_MEMORY_HOME;
  if (explicit) {
    return path.resolve(explicit);
  }

  const codexHome = process.env.CODEX_HOME
    ? path.resolve(process.env.CODEX_HOME)
    : path.join(homedir(), ".codex");
  return path.join(codexHome, "project-memory", "v1");
}

export function ensureDataDir(dataDir = resolveDataDir()): string {
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  return dataDir;
}

export function loadLocalConfig(dataDir: string): LocalConfig {
  const configPath = path.join(dataDir, "config.json");
  if (!existsSync(configPath)) {
    return { denyPatterns: [] };
  }

  const raw = JSON.parse(readFileSync(configPath, "utf8")) as { denyPatterns?: unknown };
  return {
    denyPatterns: Array.isArray(raw.denyPatterns)
      ? raw.denyPatterns.filter((value): value is string => typeof value === "string")
      : [],
  };
}

export function matchesCustomDeny(relativePath: string, patterns: string[]): boolean {
  return patterns.some((pattern) => picomatch.isMatch(relativePath, pattern, { dot: true }));
}
