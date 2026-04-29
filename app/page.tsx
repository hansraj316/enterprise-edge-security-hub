import Link from "next/link";
import { ShieldCheck, Lock, FileCheck2, FlaskConical, ClipboardCheck } from "lucide-react";

const guardrails = [
  {
    title: "Sandbox by default",
    description:
      "All new integrations run in isolated sandbox mode first. No production write paths are enabled until explicit promotion.",
    proof: "Sandbox environment ID, run log, and test evidence attached before release.",
  },
  {
    title: "Approval gate before impact",
    description:
      "Any high impact action, policy change, or data export is blocked behind a human approval gate.",
    proof: "Approver identity, timestamp, and action hash recorded in immutable audit trail.",
  },
  {
    title: "Audit log is mandatory",
    description:
      "Every admin action and automation decision emits structured, queryable audit events.",
    proof: "Event schema validation plus retention policy checks pass before rollout.",
  },
];

const checklist = [
  "Sandbox run completed with no production writes",
  "Approval gate tested for allow and deny paths",
  "Audit events verified for actor, action, scope, and timestamp",
  "Rollback procedure tested and documented",
  "Security signoff attached with release artifact",
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-12 text-slate-100">
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Secure by default</p>
        <h1 className="mt-2 text-3xl font-bold">Enterprise Edge Security Hub</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          This landing page enforces three non negotiable guardrails: sandbox first execution, human approval gates for risky actions, and full audit logging for accountability.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {guardrails.map((item, idx) => (
          <article key={item.title} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
            <div className="mb-3 flex items-center gap-2 text-emerald-300">
              {idx === 0 && <FlaskConical className="h-4 w-4" />}
              {idx === 1 && <Lock className="h-4 w-4" />}
              {idx === 2 && <FileCheck2 className="h-4 w-4" />}
              <h2 className="text-sm font-semibold uppercase tracking-wide">{item.title}</h2>
            </div>
            <p className="text-sm text-slate-300">{item.description}</p>
            <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-900/10 p-3 text-xs text-emerald-200">
              Proof required: {item.proof}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6">
        <div className="mb-3 flex items-center gap-2 text-blue-300">
          <ClipboardCheck className="h-4 w-4" />
          <h2 className="text-sm font-semibold uppercase tracking-widest">Release proof checklist</h2>
        </div>
        <ul className="space-y-2 text-sm text-slate-200">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-sm text-slate-400">
        Need implementation evidence? Review the <Link href="/network" className="text-blue-300 hover:text-blue-200">network controls</Link> and <Link href="/realtime" className="text-blue-300 hover:text-blue-200">realtime audit stream</Link> pages.
      </section>
    </main>
  );
}
