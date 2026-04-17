"use client";

import { Bell, Search, User } from "lucide-react";

export function DashboardHeader({ title = "Enterprise Edge Dashboard" }: { title?: string }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
          PRO-PLAN
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search security events..." 
            className="bg-slate-800/50 border border-slate-700/50 rounded-full py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-64 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
          </button>
          
          <button className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50 pr-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-slate-300 font-bold text-xs border border-slate-600/50">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white">Raj Engineer</p>
              <p className="text-[10px] text-slate-500">Principal Architect</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
