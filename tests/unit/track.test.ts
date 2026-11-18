import { beforeEach, describe, expect, it, vi } from "vitest";
import { eventSchemas, track } from "@/features/analytics/track";

describe("analytics schemas", () => {
  it("accepts valid events", () => {
    expect(eventSchemas.whatsapp_click.safeParse({ placement: "sticky_bar" }).success).toBe(true);
    expect(eventSchemas.map_toggle.safeParse({ view: "map" }).success).toBe(true);
  });
  it("rejects invalid events", () => {
    expect(eventSchemas.map_toggle.safeParse({ view: "grid" }).success).toBe(false);
    expect(eventSchemas.media_open.safeParse({ property_id: "p", format: "bogus" }).success).toBe(
      false,
    );
    expect(eventSchemas.view_item.safeParse({ property_id: "p" }).success).toBe(false);
  });
});
describe("track()", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { dataLayer: undefined });
  });
  it("pushes valid events to dataLayer", () => {
    track("map_toggle", { view: "list" });
    expect((window.dataLayer ?? [])[0]).toEqual({ event: "map_toggle", view: "list" });
  });
  it("drops invalid events", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    // @ts-expect-error invalid on purpose
    track("map_toggle", { view: "x" });
    expect(window.dataLayer).toBeUndefined();
  });
});
