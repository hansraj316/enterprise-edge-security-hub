"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  color?: string;
}

export function StatCard({ title, value, subValue, icon: Icon, trend, color = "blue" }: StatCardProps) {
  const isUp = trend === "up";
  
  const colorMap: Record<string, { bg: string, text: string, hoverBg: string, hoverText: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", hoverBg: "group-hover:bg-blue-500", hoverText: "group-hover:text-white" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", hoverBg: "group-hover:bg-rose-500", hoverText: "group-hover:text-white" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", hoverBg: "group-hover:bg-amber-500", hoverText: "group-hover:text-white" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", hoverBg: "group-hover:bg-emerald-500", hoverText: "group-hover:text-white" },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 relative group overflow-hidden"
    >
      <div className={cn(
        "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-5 blur-3xl transition-all duration-500 group-hover:opacity-10",
        color === "blue" ? "bg-blue-500" : color === "rose" ? "bg-rose-500" : color === "amber" ? "bg-amber-500" : "bg-emerald-500"
      )} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
          colors.bg, colors.text, colors.hoverBg, colors.hoverText
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold",
          isUp ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"
        )}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {subValue}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-slate-400 text-sm font-medium tracking-wide uppercase">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
