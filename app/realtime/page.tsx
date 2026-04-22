"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  MoreHorizontal,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  Trash2,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { edgeShield, LogEntry } from "@/lib/edge-shield";

export default function RealtimePage() {
  const [events, setEvents] = useState<LogEntry[]>(() => edgeShield.getRecentLogs(20));
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      // The edgeShield is shared, so we just poll for its logs
      setEvents(edgeShield.getRecentLogs(20));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Real-time Edge Stream</h1>
          <p className="text-sm text-slate-400">Live feed from 128 global edge nodes</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border",
              isPaused 
                ? "bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600/20" 
                : "bg-amber-600/10 text-amber-400 border-amber-500/20 hover:bg-amber-600/20"
            )}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? "Resume Stream" : "Pause Stream"}
          </button>
          <button 
            onClick={() => setEvents([])}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-2xl border border-slate-800/50 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Global Log Console</span>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[500px] bg-black/40 p-2 font-mono">
              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {events.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-600 text-sm italic py-20">
                      Waiting for incoming traffic stream...
                    </div>
                  ) : (
                    events.map((event) => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs flex items-start gap-4 p-2 rounded hover:bg-slate-800/30 group"
                      >
                        <span className="text-slate-600 shrink-0">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                        <span className={cn(
                          "shrink-0 font-bold uppercase tracking-tighter",
                          event.type === 'blocked' ? "text-rose-500" : 
                          event.type === 'anomaly' ? "text-amber-500" : 
                          "text-emerald-500"
                        )}>
                          {event.type}
                        </span>
                        <span className="text-slate-300 font-bold shrink-0">{event.node}</span>
                        <span className="text-slate-500 shrink-0">IP:{event.ip}</span>
                        <span className="text-white flex-1">{event.title}</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 border",
                          event.severity === 'high' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
                          event.severity === 'medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {event.severity}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-slate-800/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Stream Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-500">CONNECTED</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Latency</span>
                <span className="text-xs font-bold text-white">12ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Traffic (PPS)</span>
                <span className="text-xs font-bold text-white">1,245 pps</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-800/50 bg-gradient-to-br from-indigo-900/10 to-transparent">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Live Insights</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-amber-400 font-bold">ANOMALY:</span> 15% traffic increase from <span className="text-white font-mono">Mumbai Region</span>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-rose-400 font-bold">ATTACK:</span> SQLi burst blocked at <span className="text-white font-mono">Delhi-Edge-01</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
