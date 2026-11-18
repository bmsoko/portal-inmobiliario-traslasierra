import { z } from "zod";

// Domain schemas. Shapes mirror what v1 will store in Postgres.

export const PROPERTY_TYPES = [
  "CASA",
  "CABANA",
  "LOTE",
  "CAMPO",
  "DEPARTAMENTO",
  "LOCAL",
  "HOTEL",
] as const;
export const OPERATIONS = ["VENTA", "EMPRENDIMIENTO"] as const;
export const STATUSES = ["DISPONIBLE", "RESERVADA", "VENDIDA"] as const;
export const WATER_SOURCES = ["RED", "POZO", "VERTIENTE", "RIO", "NINGUNA"] as const;
export const ROAD_ACCESS = ["ASFALTO", "RIPIO", "TIERRA"] as const;
export const SLOPES = ["PLANO", "SUAVE", "PRONUNCIADA"] as const;
export const TITLE_STATUS = ["ESCRITURA", "BOLETO", "POSESION", "SUCESION"] as const;
export const NEARBY_TYPES = ["ESCUELA", "SALUD", "COMERCIO", "RIO", "CENTRO"] as const;

const id = z.string().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");

export const ZoneSchema = z.object({
  id,
  name: z.string(),
  slug,
  description: z.string(),
  heroImage: z.string(),
  isActive: z.boolean(),
  order: z.number().int(),
});

export const LocalitySchema = z.object({
  id,
  zoneId: id,
  name: z.string(),
  slug,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  shortGuide: z.string(),
});

export const AgentSchema = z.object({
  id,
  name: z.string(),
  slug,
  photo: z.string(),
  licenseNumber: z.string(),
  agencyName: z.string(),
  agencyLogo: z.string(),
  zoneIds: z.array(id).min(1),
  bio: z.string(),
  isActive: z.boolean(),
});

export const HotspotSchema = z.object({
  pitch: z.number(),
  yaw: z.number(),
  text: z.string(),
  targetIndex: z.number().int().min(0),
});

export const PropertyImageSchema = z.object({
  src: z.string(),
  alt: z.string().min(1),
  cover: z.boolean().optional(),
});

export const PanoramaSchema = z.object({
  src: z.string(),
  title: z.string(),
  hotspots: z.array(HotspotSchema).default([]),
});

const PositionSchema = z.tuple([z.number(), z.number()]);
export const LotPolygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(PositionSchema).min(4)).min(1),
});

export const NearbySchema = z.object({
  type: z.enum(NEARBY_TYPES),
  name: z.string(),
  km: z.number().nonnegative(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const PropertySchema = z.object({
  id,
  slug,
  title: z.string(),
  description: z.string(),
  operation: z.enum(OPERATIONS),
  type: z.enum(PROPERTY_TYPES),
  status: z.enum(STATUSES),
  featured: z.boolean(),
  publishedAt: z.string(),
  agentId: id,

  amountUsd: z.number().nonnegative(),
  showPrice: z.boolean(),
  acceptsSwap: z.boolean(),
  financing: z.boolean(),
  creditEligible: z.boolean(),

  coveredM2: z.number().nonnegative().nullable(),
  landM2: z.number().nonnegative().nullable(),
  hectares: z.number().nonnegative().nullable(),
  bedrooms: z.number().int().nullable(),
  bathrooms: z.number().int().nullable(),
  garage: z.number().int().nullable(),

  waterSource: z.enum(WATER_SOURCES),
  electricity: z.boolean(),
  gas: z.boolean(),
  internet: z.boolean(),
  roadAccess: z.enum(ROAD_ACCESS),
  kmToTown: z.number().nonnegative(),
  kmToCordoba: z.number().nonnegative(),
  mountainView: z.boolean(),
  nearRiver: z.boolean(),
  slope: z.enum(SLOPES),
  titleStatus: z.enum(TITLE_STATUS),

  localityId: id,
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  lotPolygon: LotPolygonSchema.optional(),

  images: z.array(PropertyImageSchema).min(1),
  panoramas: z.array(PanoramaSchema).default([]),
  tourEmbedUrl: z.string().url().optional(),
  videoId: z.string().optional(),
  droneImages: z.array(PropertyImageSchema).default([]),
  droneVideoId: z.string().optional(),
  accessRoadVideoId: z.string().optional(),
  floorPlanImages: z.array(PropertyImageSchema).default([]),
  orientationDeg: z.number().min(0).max(360).optional(),

  nearby: z.array(NearbySchema).default([]),
});

export type Zone = z.infer<typeof ZoneSchema>;
export type Locality = z.infer<typeof LocalitySchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type Hotspot = z.infer<typeof HotspotSchema>;
