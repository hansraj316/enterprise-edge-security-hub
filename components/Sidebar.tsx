"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Network, 
  AlertTriangle, 
  Settings, 
  LogOut,
  Zap,
  Globe,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Edge Network", href: "/network", icon: Globe },
  { name: "Threat Analysis", href: "/threats", icon: AlertTriangle },
  { name: "Database", href: "/database", icon: Database },
  { name: "Real-time Edge", href: "/realtime", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 glass border-r">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">EdgeShield</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium border border-blue-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-all duration-200">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
