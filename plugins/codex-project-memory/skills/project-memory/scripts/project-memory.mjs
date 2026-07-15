#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pluginRoot = path.resolve(skillDir, "../..");
const cliPath = path.join(pluginRoot, "dist", "project-memory.mjs");
const result = spawnSync(process.execPath, [cliPath, ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
});

process.exitCode = result.status ?? 1;
