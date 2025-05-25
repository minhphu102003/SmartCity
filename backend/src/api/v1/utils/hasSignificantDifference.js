export function hasSignificantDifference(coords1, coords2, tolerance = 0.0001) {
  const middleCoords2 = coords2.slice(1, coords2.length - 1);

  for (const [lat1, lng1] of coords1) {
    for (const [lat2, lng2] of middleCoords2) {
      const latDiff = Math.abs(lat1 - lat2);
      const lngDiff = Math.abs(lng1 - lng2);
      if (latDiff < tolerance && lngDiff < tolerance) {
        return false;
      }
    }
  }

  return true; 
}