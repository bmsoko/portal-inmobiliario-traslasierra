const EARTH_RADIUS_M = 6_371_008.8;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in km between two lat/lng points (haversine). */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return (2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))) / 1000;
}

/** Area in m² of a GeoJSON polygon ring ([lng, lat] pairs) using an equirectangular projection. */
export function polygonAreaM2(ring: [number, number][]): number {
  if (ring.length < 4) return 0;
  const lat0 = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const mPerDegLat = (Math.PI / 180) * EARTH_RADIUS_M;
  const mPerDegLng = mPerDegLat * Math.cos(rad(lat0));
  const pts = ring.map(([lng, lat]) => [lng * mPerDegLng, lat * mPerDegLat] as const);
  let sum = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    sum += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1];
  }
  return Math.abs(sum) / 2;
}
