import { NextRequest, NextResponse } from "next/server";
import { isWorkEmail, LeadPayload } from "@/lib/lead";

const REQUIRED_FIELDS: Array<keyof LeadPayload> = [
  "fullName",
  "workEmail",
  "company",
  "role",
  "companySize",
  "assessmentFocus",
  "timeline",
  "sourcePage",
];

const WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;
const MAX_ATTEMPTS = Number(process.env.LEAD_WEBHOOK_MAX_ATTEMPTS ?? 3);
const BASE_DELAY_MS = Number(process.env.LEAD_WEBHOOK_RETRY_BASE_MS ?? 500);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPayloadValid(payload: Partial<LeadPayload>) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field] || String(payload[field]).trim().length === 0) return false;
  }

  if (!payload.workEmail || !isWorkEmail(payload.workEmail)) return false;

  return true;
}

async function postWithRetry(body: Record<string, unknown>) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(WEBHOOK_URL as string, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) return true;

      lastError = new Error(`Webhook error: ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) {
      await wait(BASE_DELAY_MS * Math.pow(2, attempt - 1));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Webhook failed");
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Partial<LeadPayload>;

    if ((payload.website ?? "").toString().trim()) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!isPayloadValid(payload)) {
      return NextResponse.json(
        { error: "Invalid lead payload. Use required fields and a valid work email." },
        { status: 400 },
      );
    }

    const startedAt = payload.startedAt ? Date.parse(payload.startedAt) : NaN;
    if (!Number.isNaN(startedAt) && Date.now() - startedAt < 3000) {
      return NextResponse.json({ error: "Submission blocked." }, { status: 429 });
    }

    if (!WEBHOOK_URL) {
      console.error("CONTACT_WEBHOOK_URL not configured");
      return NextResponse.json(
        {
          error: "Lead capture is temporarily unavailable.",
          code: "lead_capture_unavailable",
        },
        { status: 503 },
      );
    }

    const enrichedLead = {
      type: "enterprise_assessment_lead",
      submittedAt: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
      userAgent: req.headers.get("user-agent") ?? "unknown",
      payload,
    };

    await postWithRetry(enrichedLead);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Lead submission failed", error);
    return NextResponse.json(
      {
        error: "Failed to process lead.",
        code: "lead_webhook_failed",
      },
      { status: 502 },
    );
  }
}
