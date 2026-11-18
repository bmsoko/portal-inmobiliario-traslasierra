import { agents, localities, properties, zones } from "./data";
import {
  matchesFilters,
  sortProperties,
  type FilterContext,
  type PropertyFilters,
} from "./filters";
import type { Agent, Locality, Property, Zone } from "./schemas";

// Pages talk to these interfaces only. v1 swaps the JSON implementation for Supabase.
export interface PropertyRepository {
  list(filters?: PropertyFilters): Property[];
  getBySlug(slug: string): Property | undefined;
  listByZone(zoneSlug: string): Property[];
  listByAgent(agentId: string): Property[];
  featured(): Property[];
}
export interface CatalogRepository {
  zones(): Zone[];
  getZone(slug: string): Zone | undefined;
  localities(zoneId?: string): Locality[];
  getLocality(id: string): Locality | undefined;
  agents(): Agent[];
  getAgent(slug: string): Agent | undefined;
  getAgentById(id: string): Agent | undefined;
}

export class JsonPropertyRepository implements PropertyRepository {
  private ctx: FilterContext;
  constructor(
    private readonly items: Property[] = properties,
    locs: Locality[] = localities,
    zs: Zone[] = zones,
  ) {
    const zoneSlug = Object.fromEntries(zs.map((z) => [z.id, z.slug]));
    this.ctx = {
      zoneSlugByLocalityId: Object.fromEntries(locs.map((l) => [l.id, zoneSlug[l.zoneId]])),
      localitySlugById: Object.fromEntries(locs.map((l) => [l.id, l.slug])),
    };
  }
  list(filters: PropertyFilters = {}) {
    return sortProperties(
      this.items.filter((p) => matchesFilters(p, filters, this.ctx)),
      filters.sort,
    );
  }
  getBySlug(slug: string) {
    return this.items.find((p) => p.slug === slug);
  }
  listByZone(zoneSlug: string) {
    return this.list({ zone: zoneSlug });
  }
  listByAgent(agentId: string) {
    return sortProperties(this.items.filter((p) => p.agentId === agentId));
  }
  featured() {
    return sortProperties(this.items.filter((p) => p.featured && p.status === "DISPONIBLE"));
  }
}

export class JsonCatalogRepository implements CatalogRepository {
  zones = () => zones.filter((z) => z.isActive).sort((a, b) => a.order - b.order);
  getZone = (slug: string) => this.zones().find((z) => z.slug === slug);
  localities = (zoneId?: string) => localities.filter((l) => !zoneId || l.zoneId === zoneId);
  getLocality = (id: string) => localities.find((l) => l.id === id);
  agents = () => agents.filter((a) => a.isActive);
  getAgent = (slug: string) => agents.find((a) => a.slug === slug);
  getAgentById = (id: string) => agents.find((a) => a.id === id);
}

export const propertyRepo: PropertyRepository = new JsonPropertyRepository();
export const catalogRepo: CatalogRepository = new JsonCatalogRepository();
