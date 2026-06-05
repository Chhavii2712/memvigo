export function zScoreAnalysis(readings, current) {
  if (readings.length < 10) return null; // not enough data yet

  const metrics = ['fragRatio', 'ioWaitMs', 'pageFaultRate', 'activeProcesses'];
  let maxZScore = 0;
  let anomalousMetric = null;

  for (const metric of metrics) {
    const values = readings.map(r => r[metric]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
    if (std === 0) continue;
    const zScore = Math.abs((current[metric] - mean) / std);
    if (zScore > maxZScore) {
      maxZScore = zScore;
      anomalousMetric = metric;
    }
  }

  return {
    zScore: maxZScore,
    anomalousMetric,
    isAnomaly: maxZScore > 2,
    isCritical: maxZScore > 3,
  };
}