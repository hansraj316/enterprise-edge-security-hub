import { NextRequest, NextResponse } from "next/server";
import {
  AutonomousAction,
  createSafetyBackup,
  isSafeModeEnabled,
  requireDestructiveConfirmation,
} from "@/lib/ai-safe-mode";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<AutonomousAction>;

    if (!body.workflowId || !body.action || !body.target) {
      return NextResponse.json(
        { error: "workflowId, action, and target are required" },
        { status: 400 },
      );
    }

    const action: AutonomousAction = {
      workflowId: body.workflowId,
      action: body.action,
      target: body.target,
      payload: body.payload ?? {},
      destructive: Boolean(body.destructive),
      confirmationToken: body.confirmationToken,
      requestedBy: body.requestedBy,
    };

    requireDestructiveConfirmation(action);

    const backup = await createSafetyBackup(action);

    return NextResponse.json(
      {
        ok: true,
        safeMode: isSafeModeEnabled(),
        backupPath: backup.filePath,
        status: "queued",
      },
      { status: 200 },
    );
  } catch (error) {
    const code = (error as Error & { code?: string })?.code;
    if (code === "ai_safe_confirmation_required") {
      return NextResponse.json({ error: (error as Error).message, code }, { status: 403 });
    }

    console.error("Autonomous workflow action failed", error);
    return NextResponse.json(
      { error: "Failed to queue autonomous workflow action", code: "workflow_queue_failed" },
      { status: 500 },
    );
  }
}
