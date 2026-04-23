"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Calculator, CalendarCheck2, ShieldCheck, BadgeIndianRupee } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { isWorkEmail, LeadPayload } from "@/lib/lead";

const BOOKING_URL = process.env.NEXT_PUBLIC_ASSESSMENT_BOOKING_URL ?? "https://calendly.com";
const SALES_EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL ?? "sales@example.com";

type LeadForm = Omit<LeadPayload, "estimatedAnnualSavingsInr" | "estimatedRoiPercent">;

type PricingPlan = {
  name: string;
  monthlyPriceInr: number;
  idealFor: string;
  features: string[];
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter SOC",
    monthlyPriceInr: 69999,
    idealFor: "Fast-moving teams up to 50 members",
    features: [
      "Managed WAF and bot mitigation",
      "24x7 alerting with SOC triage",
      "Monthly risk and posture review",
    ],
  },
  {
    name: "Growth Shield",
    monthlyPriceInr: 149999,
    idealFor: "Scaling teams with multi-region traffic",
    features: [
      "Everything in Starter SOC",
      "DDoS burst protection + API security",
      "SIEM integrations and playbook tuning",
    ],
  },
  {
    name: "Enterprise Fortress",
    monthlyPriceInr: 329999,
    idealFor: "Large enterprises with strict compliance",
    features: [
      "Everything in Growth Shield",
      "Dedicated security architect",
      "Custom SLA, audit support, executive reporting",
    ],
  },
];

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
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PRICING_PLANS[1]);
  const [teamSize, setTeamSize] = useState(120);
  const [currentToolingCostInr, setCurrentToolingCostInr] = useState(250000);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const roi = useMemo(() => {
    const teamSavingsFactor = Math.min(0.42, 0.16 + teamSize * 0.0015);
    const platformSavings = Math.round(currentToolingCostInr * teamSavingsFactor);
    const operationsSavings = teamSize * 1200;
    const planEfficiencyDelta = Math.max(0, currentToolingCostInr - selectedPlan.monthlyPriceInr);
    const monthlySavings = Math.max(0, platformSavings + operationsSavings + Math.round(planEfficiencyDelta * 0.35));
    const roiPercent = Math.round((monthlySavings / Math.max(currentToolingCostInr, 1)) * 100);

    return {
      monthlySavings,
      annualSavings: monthlySavings * 12,
      roiPercent,
    };
  }, [currentToolingCostInr, selectedPlan.monthlyPriceInr, teamSize]);

  function onRoiCalculate() {
    trackEvent("roi_calculated", {
      selectedPlan: selectedPlan.name,
      teamSize,
      currentToolingCostInr,
      estimatedMonthlySavingsInr: roi.monthlySavings,
      estimatedRoiPercent: roi.roiPercent,
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
      annualSecuritySpendInr: currentToolingCostInr * 12,
      estimatedAnnualSavingsInr: roi.annualSavings,
      estimatedRoiPercent: roi.roiPercent,
      notes: [
        `Plan: ${selectedPlan.name}`,
        `Team size: ${teamSize}`,
        `Current monthly tooling cost: ₹${currentToolingCostInr.toLocaleString("en-IN")}`,
        `Estimated monthly savings: ₹${roi.monthlySavings.toLocaleString("en-IN")}`,
        form.notes?.trim() ? `Additional notes: ${form.notes.trim()}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("error");
        setMessage(`Could not submit right now. Use Book Demo fallback: ${SALES_EMAIL}`);
        return;
      }

      trackEvent("lead_submitted", {
        company: form.company,
        companySize: form.companySize,
        selectedPlan: selectedPlan.name,
        teamSize,
        estimatedMonthlySavingsInr: roi.monthlySavings,
      });

      setStatus("success");
      setMessage("Thanks. Your demo request is in. You can also book a slot below.");
    } catch {
      setStatus("error");
      setMessage(`Network issue while submitting. Use Book Demo fallback: ${SALES_EMAIL}`);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-2xl border border-slate-800/50 glass p-8">
        <h1 className="text-3xl font-bold text-white">Enterprise Security Assessment</h1>
        <p className="mt-2 text-slate-400">India-focused pricing, quick ROI estimate, and direct lead capture for your security demo.</p>
      </section>

      <section className="rounded-2xl border border-slate-800/50 glass p-6 space-y-5">
        <div className="flex items-center gap-2 text-blue-400"><BadgeIndianRupee className="w-4 h-4" /> India Pricing Plans</div>
        <div className="grid gap-4 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const active = selectedPlan.name === plan.name;
            return (
              <button
                key={plan.name}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={`text-left rounded-xl border p-4 transition ${active ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900/30 hover:border-slate-500"}`}
              >
                <p className="text-sm font-semibold text-white">{plan.name}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-400">₹{plan.monthlyPriceInr.toLocaleString("en-IN")}<span className="text-xs text-slate-400">/month</span></p>
                <p className="mt-1 text-xs text-slate-400">{plan.idealFor}</p>
                <ul className="mt-3 space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/50 glass p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-400"><Calculator className="w-4 h-4" /> ROI Calculator (Monthly)</div>
          <label className="text-sm text-slate-300 block">Team size</label>
          <input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" type="number" min={1} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} />
          <label className="text-sm text-slate-300 block">Current tooling cost per month (INR)</label>
          <input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" type="number" min={0} value={currentToolingCostInr} onChange={(e) => setCurrentToolingCostInr(Number(e.target.value))} />
          <label className="text-sm text-slate-300 block">Selected EdgeShield plan</label>
          <p className="text-sm text-white font-semibold">{selectedPlan.name} • ₹{selectedPlan.monthlyPriceInr.toLocaleString("en-IN")}/month</p>
          <button onClick={onRoiCalculate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold">Calculate Savings</button>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-xs text-emerald-300">Estimated monthly savings</p>
            <p className="text-2xl font-bold text-white">₹{roi.monthlySavings.toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-400">Annualized: ₹{roi.annualSavings.toLocaleString("en-IN")} • Estimated ROI: {roi.roiPercent}%</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800/50 glass p-6 space-y-3">
          <div className="flex items-center gap-2 text-blue-400"><ShieldCheck className="w-4 h-4" /> Book Demo Lead Form</div>
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
          <button disabled={status === "submitting"} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold disabled:opacity-50">{status === "submitting" ? "Submitting..." : "Book Demo"}</button>
          <Link
            href={`mailto:${SALES_EMAIL}?subject=Book%20EdgeShield%20Demo&body=Hi%20team%2C%20I%20want%20to%20book%20a%20demo.`}
            className="inline-flex text-xs text-emerald-300 hover:text-emerald-200"
          >
            Fallback: email sales directly
          </Link>
          {message && <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-amber-300"}`}>{message}</p>}
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800/50 glass p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Prefer direct scheduling?</h2>
          <p className="text-slate-400 text-sm">Pick a slot with our solutions team.</p>
        </div>
        <Link
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("assessment_book_clicked", { sourcePage: "/assessment", selectedPlan: selectedPlan.name })}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold"
        >
          <CalendarCheck2 className="w-4 h-4" /> Book Assessment
        </Link>
      </section>
    </div>
  );
}
