"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import Link from "next/link";
import {
  Zap,
  ShieldAlert,
  Activity,
  Server,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  BadgeIndianRupee,
  Calculator,
  CalendarCheck2,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { TrafficChart } from "@/components/TrafficChart";
import { ThreatMap } from "@/components/ThreatMap";
import { edgeShield, LogEntry } from "@/lib/edge-shield";
import { trackEvent } from "@/lib/analytics";
import { isWorkEmail, LeadPayload } from "@/lib/lead";

const INDIA_PLANS = [
  {
    name: "Starter",
    price: "₹69,999/mo",
    features: ["Managed WAF + bot defense", "24x7 SOC triage", "Monthly risk report"],
  },
  {
    name: "Growth",
    price: "₹1,49,999/mo",
    features: ["DDoS + API protection", "SIEM integrations", "Priority response SLA"],
  },
  {
    name: "Enterprise",
    price: "₹3,29,999/mo",
    features: ["Dedicated architect", "Compliance and audit support", "Custom SLA"],
  },
];

const SALES_EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL ?? "sales@example.com";

type QuickLeadForm = Pick<LeadPayload, "fullName" | "workEmail" | "company">;

export default function DashboardPage() {
  const [events, setEvents] = useState<LogEntry[]>(() => edgeShield.getRecentLogs(10));
  const [teamSize, setTeamSize] = useState(80);
  const [toolingCostInr, setToolingCostInr] = useState(180000);
  const [selectedPlanName, setSelectedPlanName] = useState(INDIA_PLANS[1].name);
  const [quickLead, setQuickLead] = useState<QuickLeadForm>({ fullName: "", workEmail: "", company: "" });
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [leadMessage, setLeadMessage] = useState("");

  const selectedPlan = INDIA_PLANS.find((plan) => plan.name === selectedPlanName) ?? INDIA_PLANS[1];

  const roi = useMemo(() => {
    const teamSavingsFactor = Math.min(0.42, 0.16 + teamSize * 0.0015);
    const platformSavings = Math.round(toolingCostInr * teamSavingsFactor);
    const operationsSavings = teamSize * 1200;
    const selectedPlanPrice = Number(selectedPlan.price.replace(/[^\d]/g, ""));
    const planEfficiencyDelta = Math.max(0, toolingCostInr - selectedPlanPrice);
    const monthlySavings = Math.max(0, platformSavings + operationsSavings + Math.round(planEfficiencyDelta * 0.35));
    const roiPercent = Math.round((monthlySavings / Math.max(toolingCostInr, 1)) * 100);

    return {
      monthlySavings,
      annualSavings: monthlySavings * 12,
      roiPercent,
    };
  }, [teamSize, toolingCostInr, selectedPlan]);

  const fallbackMailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Book EdgeShield Demo - ${selectedPlan.name}`);
    const body = encodeURIComponent(
      [
        "Hi EdgeShield team,",
        "",
        `Please schedule a demo for ${selectedPlan.name}.`,
        `Name: ${quickLead.fullName || ""}`,
        `Email: ${quickLead.workEmail || ""}`,
        `Company: ${quickLead.company || ""}`,
        `Team size: ${teamSize}`,
        `Current monthly tooling cost: ₹${toolingCostInr.toLocaleString("en-IN")}`,
        `Estimated monthly savings: ₹${roi.monthlySavings.toLocaleString("en-IN")}`,
      ].join("\n"),
    );

    return `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;
  }, [quickLead, roi.monthlySavings, selectedPlan.name, teamSize, toolingCostInr]);

  function onRoiCalculate() {
    trackEvent("roi_calculated", {
      sourcePage: "/",
      selectedPlan: selectedPlan.name,
      teamSize,
      currentToolingCostInr: toolingCostInr,
      estimatedMonthlySavingsInr: roi.monthlySavings,
      estimatedRoiPercent: roi.roiPercent,
    });
  }

  async function onQuickBookDemo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!quickLead.fullName || !quickLead.company) {
      setLeadStatus("error");
      setLeadMessage("Enter name and company to continue.");
      return;
    }

    if (!isWorkEmail(quickLead.workEmail)) {
      setLeadStatus("error");
      setLeadMessage("Use your work email.");
      return;
    }

    const payload: LeadPayload = {
      fullName: quickLead.fullName,
      workEmail: quickLead.workEmail,
      company: quickLead.company,
      role: "Security Lead",
      companySize: teamSize <= 50 ? "11-50" : teamSize <= 200 ? "51-200" : teamSize <= 1000 ? "201-1000" : "1000+",
      monthlyTrafficGb: 300,
      annualSecuritySpendInr: toolingCostInr * 12,
      estimatedIncidentsPerMonth: 2,
      estimatedAnnualSavingsInr: roi.annualSavings,
      estimatedRoiPercent: roi.roiPercent,
      assessmentFocus: "Managed WAF + DDoS",
      timeline: "This quarter",
      notes: `Quick home CTA lead | Plan: ${selectedPlan.name} | Team size: ${teamSize} | Monthly cost: ₹${toolingCostInr.toLocaleString("en-IN")} | Est monthly savings: ₹${roi.monthlySavings.toLocaleString("en-IN")}`,
      sourcePage: "/",
      referral: "Homepage",
      website: "",
      startedAt: new Date(Date.now() - 10000).toISOString(),
    };

    setLeadStatus("submitting");
    setLeadMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("lead_failed");
      }

      trackEvent("lead_submitted", {
        sourcePage: "/",
        selectedPlan: selectedPlan.name,
        teamSize,
        estimatedMonthlySavingsInr: roi.monthlySavings,
      });

      setLeadStatus("success");
      setLeadMessage("Demo request received. We'll reach out shortly.");
    } catch {
      setLeadStatus("error");
      setLeadMessage(`Lead endpoint unavailable. Use fallback email: ${SALES_EMAIL}`);

      if (typeof window !== "undefined") {
        window.location.href = fallbackMailtoHref;
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = edgeShield.getNodeStats();
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];

      // Simulate traffic with random IPs and payloads
      const ips = ["192.168.1.1", "45.12.33.102", "103.21.11.45", "112.55.22.90", "203.44.11.23"];
      const payloads = ["SELECT * FROM users", "<script>alert(1)</script>", "../../etc/passwd", "normal traffic", "another normal request"];

      const randomIp = ips[Math.floor(Math.random() * ips.length)];
      const randomPayload = payloads[Math.floor(Math.random() * payloads.length)];

      edgeShield.processRequest(randomIp, randomNode.id, randomPayload);
      setEvents(edgeShield.getRecentLogs(10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <section className="glass rounded-2xl border border-blue-500/20 p-6 md:p-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Enterprise Security Assessment</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">Get your Edge ROI and custom hardening plan</h2>
            <p className="text-slate-300 text-sm mt-2">Calculate savings, qualify in minutes, and book a technical assessment.</p>
          </div>
          <a
            href="#book-demo"
            onClick={() => trackEvent("book_demo_clicked", { sourcePage: "/", placement: "hero" })}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors"
          >
            Book Demo
          </a>
        </div>
      </section>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Edge Traffic"
          value="1.24 TB"
          subValue="+12.5%"
          trend="up"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Threats Blocked"
          value="45,201"
          subValue="+8.2%"
          trend="up"
          icon={ShieldAlert}
          color="rose"
        />
        <StatCard
          title="Active Edge Nodes"
          value="128"
          subValue="Stable"
          trend="neutral"
          icon={Server}
          color="emerald"
        />
        <StatCard
          title="Mean Anomaly Score"
          value="0.12"
          subValue="-14.2%"
          trend="down"
          icon={Zap}
          color="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Threat Map Placeholder */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden border border-slate-800/50 flex flex-col min-h-[400px]">
          <div className="px-6 py-5 border-b border-slate-800/50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Global Edge Threat Map</h2>
              <p className="text-xs text-slate-500">Real-time threat detection across global nodes</p>
            </div>
            <button className="text-slate-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-slate-900/40 relative flex items-center justify-center p-6">
            <div className="w-full h-full flex flex-col gap-6">
              <div className="flex-1 rounded-xl overflow-hidden border border-slate-800/50 bg-slate-900/20">
                <ThreatMap />
              </div>
              <div className="h-[300px] rounded-xl overflow-hidden border border-slate-800/50 bg-slate-900/20 px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Traffic (Requests/Blocked)</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Blocked</span>
                    </div>
                  </div>
                </div>
                <TrafficChart />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events List */}
        <div className="glass rounded-2xl border border-slate-800/50 flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800/50">
            <h2 className="text-lg font-bold text-white tracking-tight">Live Security Logs</h2>
            <p className="text-xs text-slate-500">Real-time event stream from the edge</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/30">
            <AnimatePresence initial={false}>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-4 hover:bg-slate-800/20 transition-colors group cursor-pointer overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center mt-1 shrink-0",
                        event.type === "blocked" ? "bg-rose-500/10 text-rose-500" : event.type === "anomaly" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500",
                      )}
                    >
                      {event.type === "blocked" ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : event.type === "anomaly" ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate pr-2">{event.title}</p>
                        <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider shrink-0">{new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 truncate">{event.ip} • {event.node}</p>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            event.severity === "high" ? "bg-rose-500" : event.severity === "medium" ? "bg-amber-500" : "bg-emerald-500",
                          )}
                        />
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{event.severity} SEVERITY</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700 mt-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 shrink-0" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="p-4 bg-slate-900/50 border-t border-slate-800/50">
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-all uppercase tracking-widest border border-slate-700/50">
              View All Logs
            </button>
          </div>
        </div>
      </div>

      <section className="glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-r from-emerald-900/10 to-blue-900/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Enterprise Pricing Fit Check</h3>
            <p className="text-sm text-slate-400">See if EdgeShield can cut your security spend by up to 67% with better SLA coverage.</p>
          </div>
          <a
            href="#roi-calculator"
            onClick={() => trackEvent("roi_section_clicked", { sourcePage: "/", placement: "pricing" })}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
          >
            Check ROI & Pricing
          </a>
        </div>
      </section>

      <section id="roi-calculator" className="glass rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-r from-slate-900/60 to-blue-950/30 space-y-5">
        <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest">
          <BadgeIndianRupee className="w-4 h-4" /> India Pricing + ROI
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {INDIA_PLANS.map((plan) => (
            <div key={plan.name} className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
              <p className="text-sm font-semibold text-white">{plan.name}</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">{plan.price}</p>
              <ul className="mt-2 text-xs text-slate-300 space-y-1 list-disc list-inside">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 space-y-3">
            <p className="text-sm text-slate-300 inline-flex items-center gap-2"><Calculator className="w-4 h-4 text-blue-400" />ROI calculator (monthly)</p>
            <label className="text-xs text-slate-400">Team size</label>
            <input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm" type="number" min={1} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value) || 1)} />
            <label className="text-xs text-slate-400">Current tooling cost per month (INR)</label>
            <input className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm" type="number" min={0} value={toolingCostInr} onChange={(e) => setToolingCostInr(Number(e.target.value) || 0)} />
            <label className="text-xs text-slate-400">Plan</label>
            <select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm" value={selectedPlan.name} onChange={(e) => setSelectedPlanName(e.target.value)}>
              {INDIA_PLANS.map((plan) => (
                <option key={plan.name} value={plan.name}>{plan.name}</option>
              ))}
            </select>
            <button onClick={onRoiCalculate} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">Calculate Savings</button>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-xs text-emerald-300">Estimated monthly savings</p>
              <p className="text-2xl font-bold text-white">₹{roi.monthlySavings.toLocaleString("en-IN")}</p>
              <p className="text-xs text-slate-400">Annualized: ₹{roi.annualSavings.toLocaleString("en-IN")} • ROI: {roi.roiPercent}%</p>
            </div>
          </div>

          <form id="book-demo" onSubmit={onQuickBookDemo} className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 space-y-3">
            <p className="text-sm text-slate-300">Book Demo</p>
            <input required placeholder="Full name" value={quickLead.fullName} onChange={(e) => setQuickLead({ ...quickLead, fullName: e.target.value })} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm" />
            <input required type="email" placeholder="Work email" value={quickLead.workEmail} onChange={(e) => setQuickLead({ ...quickLead, workEmail: e.target.value })} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm" />
            <input required placeholder="Company" value={quickLead.company} onChange={(e) => setQuickLead({ ...quickLead, company: e.target.value })} className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm" />
            <button disabled={leadStatus === "submitting"} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors disabled:opacity-50">
              <CalendarCheck2 className="w-4 h-4" /> {leadStatus === "submitting" ? "Submitting..." : "Book Demo"}
            </button>
            <Link href={fallbackMailtoHref} className="inline-flex text-xs text-emerald-300 hover:text-emerald-200">Fallback: email sales</Link>
            {leadMessage && <p className={`text-xs ${leadStatus === "success" ? "text-emerald-300" : "text-amber-300"}`}>{leadMessage}</p>}
          </form>
        </div>
      </section>

      {/* Analytics Insight */}
      <div className="glass rounded-2xl p-6 border border-blue-500/10 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
          <Zap className="w-24 h-24 text-blue-400" />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Info className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white tracking-tight mb-1">Weekly Threat Insight</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Our edge nodes in <span className="text-white font-semibold italic">Mumbai Region</span> have seen a 24% increase in suspicious SQL injection probes. Recommending dynamic WAF rule upgrade to policy <span className="text-blue-400 font-mono">v2.4.1-edge</span>.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 uppercase tracking-widest">
            Apply Patch
          </button>
        </div>
      </div>
    </div>
  );
}
