"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  Server, 
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Info
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const initialEvents: LogEntry[] = [];
const eventTemplates: any[] = [];

import { TrafficChart } from "@/components/TrafficChart";
import { ThreatMap } from "@/components/ThreatMap";
import { edgeShield, LogEntry } from "@/lib/edge-shield";

export default function DashboardPage() {
  const [events, setEvents] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Initial logs
    setEvents(edgeShield.getRecentLogs(10));

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
              {events.map((event, idx) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-4 hover:bg-slate-800/20 transition-colors group cursor-pointer overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mt-1 shrink-0",
                      event.type === 'blocked' ? "bg-rose-500/10 text-rose-500" : 
                      event.type === 'anomaly' ? "bg-amber-500/10 text-amber-500" : 
                      "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {event.type === 'blocked' ? <ShieldAlert className="w-4 h-4" /> : 
                       event.type === 'anomaly' ? <AlertTriangle className="w-4 h-4" /> : 
                       <ShieldCheck className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate pr-2">{event.title}</p>
                        <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider shrink-0">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 truncate">{event.ip} • {event.node}</p>
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          event.severity === 'high' ? "bg-rose-500" : 
                          event.severity === 'medium' ? "bg-amber-500" : 
                          "bg-emerald-500"
                        )} />
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
