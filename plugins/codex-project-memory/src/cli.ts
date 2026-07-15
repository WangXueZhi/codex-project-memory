import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { normalizeError, ProjectMemoryError } from "./errors.js";
import { ensureDataDir, resolveDataDir } from "./paths.js";
import { ProjectMemoryService } from "./service.js";
import { MemoryStore } from "./store.js";
import type {
  MemoryCandidate,
  MemoryRelationCandidate,
  MemoryUpdateCandidate,
  RelationDirection,
  RelationType,
} from "./types.js";

interface ParsedArgs {
  command: string;
  options: Map<string, string>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command = "help", ...rest] = argv;
  const options = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token?.startsWith("--")) {
      throw new ProjectMemoryError("INVALID_INPUT", `Unexpected argument: ${token ?? ""}`);
    }
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) {
      options.set(token.slice(2), "true");
      continue;
    }
    options.set(token.slice(2), value);
    index += 1;
  }
  return { command, options };
}

function option(args: ParsedArgs, name: string, fallback?: string): string {
  const value = args.options.get(name) ?? fallback;
  if (value === undefined) {
    throw new ProjectMemoryError("INVALID_INPUT", `Missing required option --${name}.`);
  }
  return value;
}

function integerOption(args: ParsedArgs, name: string, fallback: number): number {
  const value = Number(args.options.get(name) ?? fallback);
  if (!Number.isInteger(value) || value < 1) {
    throw new ProjectMemoryError("INVALID_INPUT", `--${name} must be a positive integer.`);
  }
  return value;
}

function listOption(args: ParsedArgs, name: string): string[] {
  return (args.options.get(name) ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function jsonInput(args: ParsedArgs): unknown {
  const inline = args.options.get("json");
  const filePath = args.options.get("json-file");
  const raw = inline ?? (filePath ? readFileSync(filePath, "utf8") : readFileSync(0, "utf8"));
  if (!raw.trim()) {
    throw new ProjectMemoryError(
      "INVALID_INPUT",
      "Provide JSON with --json, --json-file, or stdin.",
    );
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch (error) {
    throw new ProjectMemoryError("INVALID_INPUT", "Input JSON is invalid.", {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

function createService(): ProjectMemoryService {
  const dataDir = ensureDataDir(resolveDataDir());
  return new ProjectMemoryService(new MemoryStore(dataDir), dataDir);
}

function openLocalFile(filePath: string): void {
  const command =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const commandArgs = process.platform === "win32" ? ["/c", "start", "", filePath] : [filePath];
  const result = spawnSync(command, commandArgs, { stdio: "ignore" });
  if (result.status !== 0) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Unable to open generated graph view.", {
      path: filePath,
    });
  }
}

function registeredProjectId(service: ProjectMemoryService, pathValue: string): string {
  const detected = service.detectProject(pathValue);
  if (!detected.registeredProject) {
    throw new ProjectMemoryError("PROJECT_NOT_REGISTERED", "Project is not registered.", {
      rootPath: detected.rootPath,
      relocationCandidates: detected.relocationCandidates,
    });
  }
  return detected.registeredProject.id;
}

function help(): Record<string, unknown> {
  return {
    usage: "project-memory <command> [options]",
    graphView:
      "HTML opens with a knowledge guide; use graph and reading modes for relationship exploration.",
    commands: {
      detect: "detect [--path PATH]",
      register: "register [--path PATH] [--name NAME] [--relink-project-id ID]",
      status: "status [--path PATH]",
      load: "load [--path PATH] [--limit N]",
      search: "search --query TEXT [--path PATH] [--include-linked true] [--limit N]",
      propose: "propose [--path PATH] [--json JSON|--json-file FILE|stdin]",
      commit:
        "commit --proposal-id ID [--accepted-item-ids ID,ID] [--accepted-update-ids ID,ID] [--accepted-relation-ids ID,ID]",
      reject: "reject --proposal-id ID",
      link: "link --source-project-id ID --target-project-id ID",
      unlink: "unlink --source-project-id ID --target-project-id ID",
      links: "links [--path PATH]",
      "search-files": "search-files --target-project-id ID --query TEXT [--path PATH]",
      "read-file": "read-file --target-project-id ID --relative-path PATH [--path PATH]",
      relations:
        "relations --memory-id ID [--direction in|out|both] [--types CSV] [--include-linked true]",
      path: "path --from-memory-id ID --to-memory-id ID [--max-depth N] [--include-linked true]",
      graph:
        "graph [--memory-id ID] [--depth N] [--include-linked true] [--format json|mermaid|markdown|html] [--output PATH] [--open true]",
      guide: "guide [--path PATH] [--include-linked true] [--limit N]",
      export: "export [--path PATH]",
      forget: "forget --memory-ids ID,ID [--path PATH]",
      "forget-relations": "forget-relations --relation-ids ID,ID [--path PATH]",
      doctor: "doctor",
      binding: "binding",
    },
  };
}

export function runCommand(argv: string[]): unknown {
  const args = parseArgs(argv);
  if (args.command === "help" || args.options.has("help")) {
    return help();
  }
  const service = createService();
  try {
    const pathValue = args.options.get("path") ?? process.cwd();
    switch (args.command) {
      case "detect":
        return service.detectProject(pathValue);
      case "register":
        return service.registerProject(
          pathValue,
          args.options.get("name"),
          args.options.get("relink-project-id"),
        );
      case "status": {
        const detected = service.detectProject(pathValue);
        return detected.registeredProject
          ? service.projectStatus(detected.registeredProject.id)
          : { registered: false, detection: detected };
      }
      case "load":
        return {
          memories: service.getContext(
            registeredProjectId(service, pathValue),
            integerOption(args, "limit", 30),
          ),
        };
      case "search":
        return {
          memories: service.searchMemory(
            registeredProjectId(service, pathValue),
            option(args, "query"),
            args.options.get("include-linked") === "true",
            integerOption(args, "limit", 30),
          ),
        };
      case "propose": {
        const input = jsonInput(args) as
          | {
              candidates?: MemoryCandidate[];
              updates?: MemoryUpdateCandidate[];
              relations?: MemoryRelationCandidate[];
            }
          | MemoryCandidate[];
        const candidates = Array.isArray(input) ? input : input.candidates;
        const updates = Array.isArray(input) ? [] : input.updates;
        const relations = Array.isArray(input) ? [] : input.relations;
        if (candidates !== undefined && !Array.isArray(candidates)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Proposal candidates must be an array.");
        }
        if (relations !== undefined && !Array.isArray(relations)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Proposal relations must be an array.");
        }
        if (updates !== undefined && !Array.isArray(updates)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Proposal updates must be an array.");
        }
        return service.proposeMemory(
          registeredProjectId(service, pathValue),
          candidates ?? [],
          relations ?? [],
          updates ?? [],
        );
      }
      case "commit":
        return service.commitMemory(
          option(args, "proposal-id"),
          listOption(args, "accepted-item-ids"),
          listOption(args, "accepted-relation-ids"),
          listOption(args, "accepted-update-ids"),
        );
      case "reject":
        return service.rejectMemory(option(args, "proposal-id"));
      case "link":
        return service.linkProjects(
          option(args, "source-project-id"),
          option(args, "target-project-id"),
        );
      case "unlink":
        return service.unlinkProjects(
          option(args, "source-project-id"),
          option(args, "target-project-id"),
        );
      case "links":
        return {
          links: service.store.listLinks(registeredProjectId(service, pathValue)),
        };
      case "search-files": {
        const sourceProjectId = registeredProjectId(service, pathValue);
        return service.searchFiles(
          sourceProjectId,
          option(args, "target-project-id"),
          option(args, "query"),
        );
      }
      case "read-file": {
        const sourceProjectId = registeredProjectId(service, pathValue);
        return service.readFile(
          sourceProjectId,
          option(args, "target-project-id"),
          option(args, "relative-path"),
        );
      }
      case "relations": {
        const direction = option(args, "direction", "both") as RelationDirection;
        if (!["in", "out", "both"].includes(direction)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Direction must be in, out, or both.");
        }
        return service.listMemoryRelations(
          registeredProjectId(service, pathValue),
          option(args, "memory-id"),
          direction,
          listOption(args, "types") as RelationType[],
          args.options.get("include-linked") === "true",
        );
      }
      case "path":
        return service.findRelationPath(
          registeredProjectId(service, pathValue),
          option(args, "from-memory-id"),
          option(args, "to-memory-id"),
          integerOption(args, "max-depth", 4),
          args.options.get("include-linked") === "true",
        );
      case "guide": {
        const projectId = registeredProjectId(service, pathValue);
        const graph = service.buildGraph(
          projectId,
          null,
          1,
          args.options.get("include-linked") === "true",
        );
        return service.buildGraphGuide(projectId, graph, integerOption(args, "limit", 12));
      }
      case "graph": {
        const projectId = registeredProjectId(service, pathValue);
        const graph = service.buildGraph(
          projectId,
          args.options.get("memory-id") ?? null,
          integerOption(args, "depth", 1),
          args.options.get("include-linked") === "true",
        );
        const format = option(args, "format", "json");
        if (format === "json") return graph;
        if (format === "mermaid") return service.renderGraphMermaid(graph);
        if (format === "markdown") return service.renderGraphMarkdown(projectId, graph);
        if (format === "html") {
          const result = service.writeGraphHtml(projectId, graph, args.options.get("output"));
          if (args.options.get("open") === "true") {
            openLocalFile(result.outputPath as string);
          }
          return result;
        }
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Graph format must be json, mermaid, markdown, or html.",
        );
      }
      case "export":
        return service.exportProject(registeredProjectId(service, pathValue));
      case "forget":
        return {
          forgottenMemoryIds: service.store.forgetMemories(
            registeredProjectId(service, pathValue),
            option(args, "memory-ids")
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
          ),
        };
      case "forget-relations":
        return {
          forgottenRelationIds: service.store.forgetRelations(
            registeredProjectId(service, pathValue),
            listOption(args, "relation-ids"),
          ),
        };
      case "doctor":
        return service.store.doctor();
      case "binding":
        return service.bindingSnippet();
      default:
        throw new ProjectMemoryError("INVALID_INPUT", `Unknown command: ${args.command}`);
    }
  } finally {
    service.store.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = runCommand(process.argv.slice(2));
    process.stdout.write(
      typeof result === "string" ? result : `${JSON.stringify(result, null, 2)}\n`,
    );
  } catch (error) {
    process.stderr.write(`${JSON.stringify(normalizeError(error), null, 2)}\n`);
    process.exitCode = 1;
  }
}
