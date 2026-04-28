import { NextRequest, NextResponse } from "next/server";

const DEFAULT_EXECUTION_MODE = "read-only";
const WRITE_ENABLED_MODE = "write-enabled";

const PROTECTED_ENV_VARS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "MYSQL_URL",
  "MONGODB_URI",
  "REDIS_URL",
  "S3_BUCKET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "OPENAI_API_KEY",
] as const;

export class DestructiveActionError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = "DestructiveActionError";
    this.status = status;
  }
}

export function getExecutionMode() {
  return process.env.ACTION_EXECUTION_MODE?.trim().toLowerCase() ?? DEFAULT_EXECUTION_MODE;
}

export function assertProtectedEnvOverrides(payload: Record<string, unknown>) {
  const env = payload.env;
  if (!env || typeof env !== "object") return;

  const keys = Object.keys(env as Record<string, unknown>);
  const blocked = keys.filter((key) => PROTECTED_ENV_VARS.includes(key as (typeof PROTECTED_ENV_VARS)[number]));

  if (blocked.length > 0) {
    throw new DestructiveActionError(`Protected env vars cannot be overridden: ${blocked.join(", ")}`, 400);
  }
}

export function assertDestructiveActionAllowed(req: NextRequest, action: "delete" | "drop" | "overwrite") {
  const mode = getExecutionMode();
  if (mode !== WRITE_ENABLED_MODE) {
    throw new DestructiveActionError(
      `Destructive actions are disabled in ${mode} mode. Set ACTION_EXECUTION_MODE=${WRITE_ENABLED_MODE} to enable explicitly.`,
      403,
    );
  }

  const expected = process.env.HUMAN_CONFIRMATION_TOKEN;
  if (!expected) {
    throw new DestructiveActionError("HUMAN_CONFIRMATION_TOKEN is not configured.", 503);
  }

  const confirmation = req.headers.get("x-human-confirmation-token")?.trim();
  if (!confirmation || confirmation !== expected) {
    throw new DestructiveActionError(`Human confirmation required before ${action}.`, 401);
  }
}

export function toGuardrailErrorResponse(error: unknown) {
  if (error instanceof DestructiveActionError) {
    return NextResponse.json({ error: error.message, code: "destructive_action_blocked" }, { status: error.status });
  }

  return null;
}
