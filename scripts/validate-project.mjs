import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pluginRoot = path.join(root, "plugins", "codex-project-memory");

function fail(message) {
  process.stderr.write(`validation failed: ${message}\n`);
  process.exitCode = 1;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

const plugin = readJson("plugins/codex-project-memory/.codex-plugin/plugin.json");
if (plugin.name !== "codex-project-memory") fail("plugin name must match directory");
if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(plugin.version)) {
  fail("plugin version must be semver");
}
if (plugin.mcpServers !== undefined) fail("plugin must not require an MCP server");
if (existsSync(path.join(pluginRoot, ".mcp.json"))) fail("legacy .mcp.json must be removed");
if (!existsSync(path.join(pluginRoot, "dist", "project-memory.mjs"))) {
  fail("dist/project-memory.mjs is missing");
}
if (!existsSync(path.join(pluginRoot, "dist", "hook-stop.mjs"))) {
  fail("dist/hook-stop.mjs is missing");
}
if (!existsSync(path.join(pluginRoot, "dist", "browser", "graph-app.js"))) {
  fail("dist/browser/graph-app.js is missing");
}
if (!existsSync(path.join(pluginRoot, "dist", "browser", "graph-app.css"))) {
  fail("dist/browser/graph-app.css is missing");
}
if (!existsSync(path.join(pluginRoot, "skills", "project-memory", "SKILL.md"))) {
  fail("project-memory skill is missing");
}
if (!existsSync(path.join(pluginRoot, "skills", "project-memory", "scripts", "project-memory.mjs"))) {
  fail("project-memory Skill script is missing");
}
if (!existsSync(path.join(pluginRoot, "hooks", "hooks.json"))) {
  fail("Stop Hook config is missing");
}

const marketplace = readJson(".agents/plugins/marketplace.json");
if (marketplace.name !== "codex-project-memory") fail("marketplace name is not unique");
const entry = marketplace.plugins?.find((item) => item.name === "codex-project-memory");
if (entry?.source?.path !== "./plugins/codex-project-memory") {
  fail("marketplace source path is invalid");
}
if (!entry?.policy?.installation || !entry?.policy?.authentication || !entry?.category) {
  fail("marketplace policy metadata is incomplete");
}

const skill = readFileSync(
  path.join(pluginRoot, "skills", "project-memory", "SKILL.md"),
  "utf8",
);
if (!skill.startsWith("---\nname: project-memory\ndescription:")) {
  fail("skill frontmatter is invalid");
}
if (/\[TODO:/.test(skill)) fail("skill contains TODO placeholders");

if (!process.exitCode) process.stdout.write("project validation passed\n");
