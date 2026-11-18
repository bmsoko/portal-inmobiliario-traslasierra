import { describe, expect, it } from "vitest";
import { agents, localities, properties, zones } from "@/lib/data";
import { PROPERTY_TYPES } from "@/lib/schemas";

describe("seed data", () => {
  it("covers every property type", () => {
    const types = new Set(properties.map((p) => p.type));
    for (const t of PROPERTY_TYPES) expect(types.has(t)).toBe(true);
  });
  it("has referential integrity", () => {
    const loc = new Set(localities.map((l) => l.id));
    const ag = new Set(agents.map((a) => a.id));
    const zn = new Set(zones.map((z) => z.id));
    expect(properties.every((p) => loc.has(p.localityId) && ag.has(p.agentId))).toBe(true);
    expect(localities.every((l) => zn.has(l.zoneId))).toBe(true);
  });
  it("keeps Calamuchita and Paravachasca inactive", () => {
    expect(
      zones
        .filter((z) => !z.isActive)
        .map((z) => z.slug)
        .sort(),
    ).toEqual(["valle-de-calamuchita", "valle-de-paravachasca"]);
  });
  it("has two hero properties and at least two minimal ones", () => {
    const rich = properties.filter((p) => p.panoramas.length && p.lotPolygon && p.nearby.length);
    const minimal = properties.filter((p) => !p.panoramas.length && !p.videoId && !p.nearby.length);
    expect(rich.length).toBe(2);
    expect(minimal.length).toBeGreaterThanOrEqual(2);
  });
});
