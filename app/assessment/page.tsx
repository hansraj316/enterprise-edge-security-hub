"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Calculator, CalendarCheck2, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { isWorkEmail, LeadPayload } from "@/lib/lead";

const BOOKING_URL = process.env.NEXT_PUBLIC_ASSESSMENT_BOOKING_URL ?? "https://calendly.com";

type LeadForm = Omit<LeadPayload, "estimatedAnnualSavingsInr" | "estimatedRoiPercent">;

const initialForm: LeadForm = {
  fullName: "",
  workEmail: "",
  company: "",
  role: "",
  companySize: "51-200",
  monthlyTrafficGb: 300,
  annualSecuritySpendInr: 3000000,
  estimatedIncidentsPerMonth: 2,
  assessmentFocus: "Managed WAF + DDoS",
  timeline: "This quarter",
  notes: "",
  sourcePage: "/assessment",
  referral: "Website",
  website: "",
  startedAt: new Date().toISOString(),
};

export default function AssessmentPage() {
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const roi = useMemo(() => {
    const optimizedAnnualSpend = form.annualSecuritySpendInr * 0.68;
    const riskReduction = form.estimatedIncidentsPerMonth * 12 * 75000;
    const annualSavings = Math.round(form.annualSecuritySpendInr - optimizedAnnualSpend + riskReduction);
    const roiPercent = Math.round((annualSavings / Math.max(form.annualSecuritySpendInr, 1)) * 100);
    return { annualSavings, roiPercent };
  }, [form.annualSecuritySpendInr, form.estimatedIncidentsPerMonth]);

  function onRoiCalculate() {
    trackEvent("roi_calculated", {
      estimatedAnnualSavingsInr: roi.annualSavings,
      estimatedRoiPercent: roi.roiPercent,
      companySize: form.companySize,
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.fullName || !form.company || !form.role || !form.timeline || !form.assessmentFocus) {
      setStatus("error");
      setMessage("Please fill all required fields.");
      return;
    }

    if (!isWorkEmail(form.workEmail)) {
      setStatus("error");
      setMessage("Please use your work email (no free inbox domains).");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const payload: LeadPayload = {
      ...form,
      estimatedAnnualSavingsInr: roi.annualSavings,
      estimatedRoiPercent: roi.roiPercent,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("error");
        setMessage("Could not submit right now. Please book directly and our team will follow up.");
        return;
      }

      trackEvent("lead_submitted", {
        company: form.company,
        companySize: form.companySize,
        estimatedRoiPercent: roi.roiPercent,
      });

      setStatus("success");
      setMessage("Thanks. Your assessment request is in. You can now book a slot below.");
    } catch {
      setStatus("error");
      setMessage("Network issue while submitting. Please use Book Assessment below.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-2xl border border-slate-800/50 glass p-8">
        <h1 className="text-3xl font-bold text-white">Enterprise Security Assessment</h1>
        <p className="mt-2 text-slate-400">Estimate ROI in 30 seconds, then submit your qualification details.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/50 glass p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-400"><Calculator className="w-4 h-4" /> ROI Calculator</div>
          <label className="text-sm text-slate-300 block">Current annual security spend (INR)</label>
          <input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" type="number" min={0} value={form.annualSecuritySpendInr} onChange={(e) => setForm({ ...form, annualSecuritySpendInr: Number(e.target.value) })} />
          <label className="text-sm text-slate-300 block">Incidents per month</label>
          <input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" type="number" min={0} value={form.estimatedIncidentsPerMonth} onChange={(e) => setForm({ ...form, estimatedIncidentsPerMonth: Number(e.target.value) })} />
          <button onClick={onRoiCalculate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold">Calculate ROI</button>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-xs text-emerald-300">Estimated annual savings</p>
            <p className="text-2xl font-bold text-white">₹{roi.annualSavings.toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-400">Estimated ROI: {roi.roiPercent}%</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800/50 glass p-6 space-y-3">
          <div className="flex items-center gap-2 text-blue-400"><ShieldCheck className="w-4 h-4" /> Qualification Form</div>
          <input required placeholder="Full name" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input required type="email" placeholder="Work email" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.workEmail} onChange={(e) => setForm({ ...form, workEmail: e.target.value })} />
          <input required placeholder="Company" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input required placeholder="Role" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
            <option>11-50</option><option>51-200</option><option>201-1000</option><option>1000+</option>
          </select>
          <input required placeholder="Assessment focus" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.assessmentFocus} onChange={(e) => setForm({ ...form, assessmentFocus: e.target.value })} />
          <select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
            <option>This month</option><option>This quarter</option><option>Next quarter</option>
          </select>
          <textarea placeholder="Notes (optional)" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <input tabIndex={-1} autoComplete="off" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} aria-hidden />
          <button disabled={status === "submitting"} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold disabled:opacity-50">{status === "submitting" ? "Submitting..." : "Submit Assessment Request"}</button>
          {message && <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-amber-300"}`}>{message}</p>}
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800/50 glass p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Book your assessment call</h2>
          <p className="text-slate-400 text-sm">Prefer direct scheduling? Pick a slot with our solutions team.</p>
        </div>
        <Link
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("assessment_book_clicked", { sourcePage: "/assessment" })}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold"
        >
          <CalendarCheck2 className="w-4 h-4" /> Book Assessment
        </Link>
      </section>
    </div>
  );
}
