/**
 * EdgeShield Anomaly Engine
 * 
 * Simple statistical model to detect zero-day traffic spikes at the edge.
 */

export interface TrafficData {
  timestamp: number;
  requestCount: number;
  nodeId: string;
}

export class AnomalyEngine {
  private history: TrafficData[] = [];
  private readonly thresholdFactor = 2.5; // Sensitivity: 2.5x standard deviation

  addMetric(data: TrafficData) {
    this.history.push(data);
    // Keep only the last 100 metrics per node
    if (this.history.length > 500) {
      this.history.shift();
    }
  }

  isAnomaly(data: TrafficData): { isAnomaly: boolean; score: number } {
    const nodeHistory = this.history.filter(h => h.nodeId === data.nodeId);
    
    if (nodeHistory.length < 10) {
      return { isAnomaly: false, score: 0 };
    }

    const avg = nodeHistory.reduce((acc, h) => acc + h.requestCount, 0) / nodeHistory.length;
    const variance = nodeHistory.reduce((acc, h) => acc + Math.pow(h.requestCount - avg, 2), 0) / nodeHistory.length;
    const stdDev = Math.sqrt(variance);

    const score = (data.requestCount - avg) / (stdDev || 1);
    
    return {
      isAnomaly: score > this.thresholdFactor,
      score: Math.max(0, score)
    };
  }
}

export const anomalyEngine = new AnomalyEngine();
