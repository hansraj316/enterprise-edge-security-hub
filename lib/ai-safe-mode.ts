import { promises as fs } from "node:fs";
import path from "node:path";

const SAFE_MODE = (process.env.AI_SAFE_MODE ?? "true").toLowerCase() !== "false";
const BACKUP_DIR = process.env.AI_SAFE_BACKUP_DIR ?? path.join(process.cwd(), "data", "ai-safe-backups");

export type AutonomousAction = {
  workflowId: string;
  action: string;
  destructive?: boolean;
  target: string;
  payload?: Record<string, unknown>;
  confirmationToken?: string;
  requestedBy?: string;
};

export async function createSafetyBackup(input: AutonomousAction) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeWorkflow = input.workflowId.replace(/[^a-zA-Z0-9-_]/g, "_");
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const filePath = path.join(BACKUP_DIR, `${timestamp}-${safeWorkflow}.json`);

  const backup = {
    backedUpAt: new Date().toISOString(),
    workflowId: input.workflowId,
    target: input.target,
    action: input.action,
    payload: input.payload ?? {},
    requestedBy: input.requestedBy ?? "autonomous-agent",
  };

  await fs.writeFile(filePath, JSON.stringify(backup, null, 2), "utf8");
  return { filePath, backup };
}

export function requireDestructiveConfirmation(input: AutonomousAction) {
  if (!SAFE_MODE || !input.destructive) return;

  const expected = process.env.AI_SAFE_CONFIRM_TOKEN;
  if (!expected || input.confirmationToken !== expected) {
    const error = new Error("Destructive action blocked: confirmation token required in AI-safe mode.");
    (error as Error & { code?: string }).code = "ai_safe_confirmation_required";
    throw error;
  }
}

export function isSafeModeEnabled() {
  return SAFE_MODE;
}
