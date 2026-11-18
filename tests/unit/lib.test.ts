import { describe, expect, it } from "vitest";
import { formatUsd } from "@/lib/format";
import { distanceKm, polygonAreaM2 } from "@/lib/geo";
import { filtersToSearchParams, searchParamsToFilters } from "@/lib/filters";
import { JsonPropertyRepository, propertyRepo } from "@/lib/repository";
import { buildPropertyMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("format", () => {
  it("formats USD for es-AR", () => {
    expect(formatUsd(285000)).toMatch(/285\.000/);
    expect(formatUsd(285000)).toMatch(/US\$|USD/);
  });
});
describe("geo", () => {
  it("computes haversine distance (Córdoba to Carlos Paz ≈ 36 km)", () => {
    const d = distanceKm(-31.4201, -64.1888, -31.4241, -64.4978);
    expect(d).toBeGreaterThan(28);
    expect(d).toBeLessThan(34);
  });
  it("computes polygon area of a ~100 m square", () => {
    const d = 0.0009; // ≈ 100 m of latitude
    const lat = -31;
    const dLng = d / Math.cos((lat * Math.PI) / 180);
    const ring: [number, number][] = [
      [0, lat],
      [dLng, lat],
      [dLng, lat + d],
      [0, lat + d],
      [0, lat],
    ];
    expect(polygonAreaM2(ring)).toBeGreaterThan(9500);
    expect(polygonAreaM2(ring)).toBeLessThan(10500);
  });
});
describe("filters", () => {
  it("round-trips filters through URL params", () => {
    const f = {
      zone: "traslasierra",
      maxPrice: 200000,
      nearRiver: true,
      sort: "price-asc" as const,
    };
    expect(searchParamsToFilters(filtersToSearchParams(f))).toEqual(f);
  });
  it("ignores invalid numbers", () => {
    expect(searchParamsToFilters(new URLSearchParams("maxPrice=abc"))).toEqual({});
  });
  it("filters by locality and Sierras fields", () => {
    const res = propertyRepo.list({ locality: "nono", nearRiver: true });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((p) => p.nearRiver)).toBe(true);
  });
  it("sorts by price", () => {
    const r = new JsonPropertyRepository().list({ sort: "price-asc" });
    expect(r[0].amountUsd).toBeLessThanOrEqual(r[1].amountUsd);
  });
});
describe("whatsapp", () => {
  it("builds a link with the central number and property title", () => {
    const url = buildWhatsAppUrl(
      "+54 9 3544 000000",
      buildPropertyMessage("Casa en Nono", "https://x.test/p"),
    );
    expect(url).toContain("wa.me/5493544000000");
    expect(decodeURIComponent(url)).toContain("Casa en Nono");
  });
});
