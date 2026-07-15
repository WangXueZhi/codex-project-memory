import { existsSync, readFileSync } from "node:fs";
import { ensureDataDir, resolveDataDir } from "./paths.js";
import { ProjectMemoryService } from "./service.js";
import { MemoryStore } from "./store.js";

export interface StopHookInput {
  cwd: string;
  hook_event_name: "Stop";
  last_assistant_message: string | null;
  session_id: string;
  stop_hook_active: boolean;
  transcript_path: string | null;
  turn_id: string;
}

interface StopHookOutput {
  decision: "block";
  reason: string;
}

function turnHasToolUse(transcriptPath: string | null, turnId: string): boolean {
  if (!transcriptPath || !existsSync(transcriptPath)) {
    return false;
  }
  for (const line of readFileSync(transcriptPath, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line) as {
        type?: string;
        payload?: {
          type?: string;
          turn_id?: string;
          internal_chat_message_metadata_passthrough?: { turn_id?: string };
        };
      };
      const payload = event.payload;
      const eventTurnId =
        payload?.turn_id ?? payload?.internal_chat_message_metadata_passthrough?.turn_id;
      if (eventTurnId !== turnId || event.type !== "response_item") continue;
      if (
        payload?.type &&
        ["custom_tool_call", "function_call", "mcp_tool_call", "command_execution"].includes(
          payload.type,
        )
      ) {
        return true;
      }
    } catch {}
  }
  return false;
}

function hasValidReceipt(message: string): boolean {
  const noUpdates = message.match(/^Project memory: no durable updates - (.+)$/im);
  if (noUpdates?.[1]?.trim()) return true;

  return /^(Project memory: committed \d+ items?|Project memory: auto-committed \d+ items? - request_user_input unavailable|Project memory: rejected proposal [0-9a-f-]{36})$/im.test(
    message,
  );
}

export function evaluateStopHook(
  input: StopHookInput,
  service: ProjectMemoryService,
): StopHookOutput | null {
  if (input.stop_hook_active || input.hook_event_name !== "Stop") return null;

  let detected: ReturnType<ProjectMemoryService["detectProject"]>;
  try {
    detected = service.detectProject(input.cwd);
  } catch {
    return null;
  }
  const project = detected.registeredProject;
  if (!project || !turnHasToolUse(input.transcript_path, input.turn_id)) return null;
  if (hasValidReceipt(input.last_assistant_message ?? "")) return null;

  return {
    decision: "block",
    reason:
      "Before finishing this tool-using task in a registered project, run the $project-memory end-of-task workflow. If durable facts, enrichments, or high-confidence relationships exist, create a proposal and show every item in Chinese. When `request_user_input` is available, use it to offer 保存全部, 选择保存, or 暂不保存 and resolve the proposal in the same turn. When it is unavailable, immediately commit all proposal memory, update, and relation item IDs. A pending proposal receipt is not sufficient. End with `Project memory: committed <n> items`, `Project memory: auto-committed <n> items - request_user_input unavailable`, or `Project memory: rejected proposal <proposal-id>`. If nothing is durable, end with `Project memory: no durable updates - <reason>`.",
  };
}

function main(): void {
  const input = JSON.parse(readFileSync(0, "utf8")) as StopHookInput;
  const dataDir = ensureDataDir(resolveDataDir());
  const service = new ProjectMemoryService(new MemoryStore(dataDir), dataDir);
  try {
    const output = evaluateStopHook(input, service);
    if (output) process.stdout.write(`${JSON.stringify(output)}\n`);
  } finally {
    service.store.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch {
    process.exitCode = 0;
  }
}
