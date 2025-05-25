export function isValidLocation(lat, lng) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
}


export function addToCache(cache, item, maxSize = 1000) {
  cache.push(item);

  if (cache.length > maxSize) {
    cache.shift();
  }
}