import type { Property } from "./schemas";

export interface PropertyFilters {
  zone?: string; // zone slug
  locality?: string; // locality slug
  type?: string;
  maxPrice?: number;
  water?: string;
  electricity?: boolean;
  gas?: boolean;
  internet?: boolean;
  road?: string;
  maxKmToTown?: number;
  maxKmToCordoba?: number;
  mountainView?: boolean;
  nearRiver?: boolean;
  slope?: string;
  title?: string;
  credit?: boolean;
  swap?: boolean; // accepts swap or financing
  sort?: "recent" | "price-asc" | "price-desc";
}

export interface FilterContext {
  zoneSlugByLocalityId: Record<string, string>;
  localitySlugById: Record<string, string>;
}

export function matchesFilters(p: Property, f: PropertyFilters, ctx: FilterContext): boolean {
  if (f.zone && ctx.zoneSlugByLocalityId[p.localityId] !== f.zone) return false;
  if (f.locality && ctx.localitySlugById[p.localityId] !== f.locality) return false;
  if (f.type && p.type !== f.type) return false;
  if (f.maxPrice !== undefined && p.amountUsd > f.maxPrice) return false;
  if (f.water && p.waterSource !== f.water) return false;
  if (f.electricity && !p.electricity) return false;
  if (f.gas && !p.gas) return false;
  if (f.internet && !p.internet) return false;
  if (f.road && p.roadAccess !== f.road) return false;
  if (f.maxKmToTown !== undefined && p.kmToTown > f.maxKmToTown) return false;
  if (f.maxKmToCordoba !== undefined && p.kmToCordoba > f.maxKmToCordoba) return false;
  if (f.mountainView && !p.mountainView) return false;
  if (f.nearRiver && !p.nearRiver) return false;
  if (f.slope && p.slope !== f.slope) return false;
  if (f.title && p.titleStatus !== f.title) return false;
  if (f.credit && !p.creditEligible) return false;
  if (f.swap && !(p.acceptsSwap || p.financing)) return false;
  return true;
}

export function sortProperties(
  list: Property[],
  sort: PropertyFilters["sort"] = "recent",
): Property[] {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.amountUsd - b.amountUsd);
  else if (sort === "price-desc") copy.sort((a, b) => b.amountUsd - a.amountUsd);
  else copy.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return copy;
}

const BOOL_KEYS = [
  "electricity",
  "gas",
  "internet",
  "mountainView",
  "nearRiver",
  "credit",
  "swap",
] as const;
const STR_KEYS = ["zone", "locality", "type", "water", "road", "slope", "title", "sort"] as const;
const NUM_KEYS = ["maxPrice", "maxKmToTown", "maxKmToCordoba"] as const;

export function filtersToSearchParams(f: PropertyFilters): URLSearchParams {
  const sp = new URLSearchParams();
  for (const k of STR_KEYS) if (f[k]) sp.set(k, String(f[k]));
  for (const k of NUM_KEYS) if (f[k] !== undefined) sp.set(k, String(f[k]));
  for (const k of BOOL_KEYS) if (f[k]) sp.set(k, "1");
  return sp;
}

export function searchParamsToFilters(sp: URLSearchParams): PropertyFilters {
  const f: Record<string, unknown> = {};
  for (const k of STR_KEYS) {
    const v = sp.get(k);
    if (v) f[k] = v;
  }
  for (const k of NUM_KEYS) {
    const v = sp.get(k);
    if (v !== null && v !== "" && Number.isFinite(Number(v))) f[k] = Number(v);
  }
  for (const k of BOOL_KEYS) if (sp.get(k) === "1") f[k] = true;
  return f as PropertyFilters;
}
