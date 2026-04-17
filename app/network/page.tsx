"use client";

import { Globe, MapPin, Server, Activity } from "lucide-react";

const nodes = [
  { id: 1, name: "Mumbai-Edge-01", status: "online", latency: "8ms", traffic: "1.2 Gbps" },
  { id: 2, name: "Delhi-Edge-01", status: "online", latency: "12ms", traffic: "0.8 Gbps" },
  { id: 3, name: "Bangalore-Edge-01", status: "online", latency: "15ms", traffic: "2.1 Gbps" },
  { id: 4, name: "Chennai-Edge-01", status: "maintenance", latency: "--", traffic: "0 Gbps" },
  { id: 5, name: "Hyderabad-Edge-01", status: "online", latency: "11ms", traffic: "1.5 Gbps" },
];

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Global Edge Network</h1>
        <p className="text-sm text-slate-400">Status and metrics of geographically distributed nodes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass rounded-2xl border border-slate-800/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/50">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Active Edge Nodes</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-900/30 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/30">
              <tr>
                <th className="px-6 py-4 font-bold">Node Name</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Latency</th>
                <th className="px-6 py-4 font-bold">Current Traffic</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {nodes.map(node => (
                <tr key={node.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-white">{node.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${node.status === 'online' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {node.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-mono">{node.latency}</td>
                  <td className="px-6 py-4 text-sm text-white font-mono">{node.traffic}</td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">DIAGNOSE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-slate-800/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Network Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Global Uptime</span>
                <span className="text-xs font-bold text-emerald-500">99.999%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Average Latency</span>
                <span className="text-xs font-bold text-white">14ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Throttled Requests</span>
                <span className="text-xs font-bold text-white">142</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
