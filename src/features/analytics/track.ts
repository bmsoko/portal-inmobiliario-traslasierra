import { z } from "zod";

// Typed analytics entry point. Prototype: pushes to window.dataLayer only.
// v1 adds sinks (first-party store, GA4, Meta Pixel) behind consent, without touching callers.

const id = z.string();
export const eventSchemas = {
  view_item: z.object({
    property_id: id,
    type: z.string(),
    zone: z.string(),
    locality: z.string(),
    price_usd: z.number(),
    agent_id: id,
  }),
  view_item_list: z.object({
    list_name: z.string(),
    results_count: z.number().int().nonnegative(),
  }),
  search: z.object({
    zone: z.string().optional(),
    locality: z.string().optional(),
    type: z.string().optional(),
    price_min: z.number().optional(),
    price_max: z.number().optional(),
  }),
  filter_apply: z.object({
    filter_name: z.string(),
    value: z.union([z.string(), z.number(), z.boolean()]),
  }),
  map_toggle: z.object({ view: z.enum(["list", "map"]) }),
  media_open: z.object({
    property_id: id,
    format: z.enum([
      "gallery",
      "tour_360",
      "floor_plan",
      "matterport",
      "video",
      "drone",
      "lot_map",
      "access_road",
      "nearby",
      "sun",
    ]),
  }),
  whatsapp_click: z.object({
    property_id: id.optional(),
    agent_id: id.optional(),
    placement: z.string(),
  }),
  generate_lead: z.object({
    channel: z.enum(["contact", "video_visit", "valuation"]),
    property_id: id.optional(),
  }),
  download_ficha: z.object({ property_id: id }),
  agent_profile_view: z.object({ agent_id: id }),
} as const;

export type EventName = keyof typeof eventSchemas;
export type EventParams<N extends EventName> = z.infer<(typeof eventSchemas)[N]>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track<N extends EventName>(name: N, params: EventParams<N>): void {
  const parsed = eventSchemas[name].safeParse(params);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production")
      console.warn(`[track] invalid "${name}"`, parsed.error.issues);
    return;
  }
  if (typeof window === "undefined") return;
  (window.dataLayer ??= []).push({ event: name, ...parsed.data });
  if (process.env.NODE_ENV === "development") console.debug("[track]", name, parsed.data);
}
