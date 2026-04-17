"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: 1, name: "Mumbai", x: 45, y: 70, status: "online", threats: 12 },
  { id: 2, name: "Delhi", x: 48, y: 35, status: "online", threats: 45 },
  { id: 3, name: "Bangalore", x: 52, y: 85, status: "online", threats: 8 },
  { id: 4, name: "Chennai", x: 55, y: 90, status: "online", threats: 21 },
  { id: 5, name: "Hyderabad", x: 53, y: 75, status: "online", threats: 15 },
];

export function ThreatMap() {
  return (
    <div className="relative w-full h-[350px] bg-slate-900/20 overflow-hidden flex items-center justify-center">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      
      {/* Map Illustration SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full max-w-[400px] max-h-[400px] text-slate-800 fill-slate-800/20 stroke-slate-700/50"
      >
        <path d="M48,25 L55,30 L60,40 L65,55 L63,75 L55,95 L45,95 L35,80 L30,60 L32,40 L40,30 Z" />
      </svg>

      {/* Edge Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 * node.id }}
          className="absolute group cursor-pointer"
          style={{ top: `${node.y}%`, left: `${node.x}%` }}
        >
          {/* Pulse Effect */}
          <div className="absolute inset-0 -m-2 bg-blue-500/20 rounded-full animate-ping" />
          
          {/* Node Dot */}
          <div className="relative w-2 h-2 bg-blue-500 rounded-full border border-blue-400" />
          
          {/* Tooltip on Hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            <span className="font-bold">{node.name} Node</span><br />
            <span className="text-slate-400">{node.threats} Threats Blocked</span>
          </div>

          {/* Random Threat Indicators */}
          {node.threats > 20 && (
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          )}
        </motion.div>
      ))}

      {/* Traffic Flow Animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <motion.path
          d="M48,35 Q50,55 45,70"
          stroke="url(#grad1)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.path
          d="M52,85 Q54,78 53,75"
          stroke="url(#grad1)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
