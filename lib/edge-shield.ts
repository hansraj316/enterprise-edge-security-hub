import { anomalyEngine, TrafficData } from "./anomaly-engine";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "blocked" | "anomaly" | "success";
  title: string;
  ip: string;
  node: string;
  severity: "high" | "medium" | "low";
}

export interface NodeStats {
  id: string;
  name: string;
  status: "online" | "maintenance" | "offline";
  latency: number;
  trafficPps: number;
  threatsBlocked: number;
}

export const NODES: NodeStats[] = [
  { id: "Delhi-Edge-01", name: "Delhi-Edge-01", status: "online", latency: 8, trafficPps: 1245, threatsBlocked: 4501 },
  { id: "Mumbai-Edge-04", name: "Mumbai-Edge-04", status: "online", latency: 12, trafficPps: 2102, threatsBlocked: 8201 },
  { id: "Bangalore-Edge-02", name: "Bangalore-Edge-02", status: "online", latency: 15, trafficPps: 845, threatsBlocked: 1204 },
  { id: "Chennai-Edge-03", name: "Chennai-Edge-03", status: "online", latency: 11, trafficPps: 1542, threatsBlocked: 3201 },
  { id: "Hyderabad-Edge-01", name: "Hyderabad-Edge-01", status: "online", latency: 10, trafficPps: 1245, threatsBlocked: 4501 },
];

export const WAF_RULES = [
  { id: "SQLI-01", name: "SQL Injection Filter", pattern: /SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR 1=1/i },
  { id: "XSS-01", name: "Cross-Site Scripting Filter", pattern: /<script|javascript:|on\w+=/i },
  { id: "PT-01", name: "Path Traversal Filter", pattern: /\.\.\/|\.\.\\/ },
];

export class EdgeShield {
  private logs: LogEntry[] = [];
  private static instance: EdgeShield;

  static getInstance() {
    if (!EdgeShield.instance) {
      EdgeShield.instance = new EdgeShield();
    }
    return EdgeShield.instance;
  }

  processRequest(ip: string, nodeId: string, payload: string): LogEntry {
    const node = NODES.find(n => n.id === nodeId) || NODES[0];
    const timestamp = new Date().toISOString();
    
    // Check WAF rules
    for (const rule of WAF_RULES) {
      if (rule.pattern.test(payload)) {
        const entry: LogEntry = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp,
          type: "blocked",
          title: rule.name,
          ip,
          node: node.name,
          severity: "high"
        };
        this.addLog(entry);
        return entry;
      }
    }

    // Check Anomaly Engine
    const metric: TrafficData = {
      timestamp: Date.now(),
      requestCount: Math.random() * 1000, // Simulated count
      nodeId
    };
    anomalyEngine.addMetric(metric);
    const anomalyResult = anomalyEngine.isAnomaly(metric);

    if (anomalyResult.isAnomaly) {
      const entry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
        type: "anomaly",
        title: "Unusual Traffic Spike Detected",
        ip,
        node: node.name,
        severity: "medium"
      };
      this.addLog(entry);
      return entry;
    }

    // Success log (optional, only store a few)
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp,
      type: "success",
      title: "Clean Traffic Handshake",
      ip,
      node: node.name,
      severity: "low"
    };
    this.addLog(entry);
    return entry;
  }

  private addLog(entry: LogEntry) {
    this.logs = [entry, ...this.logs.slice(0, 99)];
  }

  getRecentLogs(limit = 10) {
    return this.logs.slice(0, limit);
  }

  getNodeStats() {
    return NODES;
  }
}

export const edgeShield = EdgeShield.getInstance();
