export function recalculateGroundwaterLevel(
  nearRiver,
  raiseHeight = 0,
  minDist = 0.0,
  maxDist = 1943.6237978835534
) {
  const distanceScore = 1.0 - (nearRiver - minDist) / (maxDist - minDist + 1e-8);

  const heightBoost = Math.min(raiseHeight / 150, 0.1); 

  const adjustedScore = Math.min(distanceScore + heightBoost, 1.0); 
  return parseFloat(adjustedScore.toFixed(4));
}