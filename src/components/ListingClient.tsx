"use client";
import { SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import MapView from "@/components/MapView";
import { PropertyCard } from "@/components/PropertyCard";
import { es } from "@/content/es";
import { track } from "@/features/analytics/track";
import {
  filtersToSearchParams,
  matchesFilters,
  searchParamsToFilters,
  sortProperties,
  type PropertyFilters,
} from "@/lib/filters";
import { formatUsd } from "@/lib/format";
import { PROPERTY_TYPES, ROAD_ACCESS, SLOPES, TITLE_STATUS, WATER_SOURCES } from "@/lib/schemas";
import type { Locality, Property, Zone } from "@/lib/schemas";

interface Props {
  properties: Property[];
  zones: Pick<Zone, "id" | "slug" | "name">[];
  localities: Pick<Locality, "id" | "zoneId" | "slug" | "name">[];
}

const field =
  "mt-1 w-full rounded-xl border border-[var(--color-stone)] bg-white px-3 py-2 text-sm";
const BOOLS = [
  ["electricity", es.listing.electricity],
  ["gas", es.listing.gas],
  ["internet", es.listing.internet],
  ["mountainView", es.listing.mountainView],
  ["nearRiver", es.listing.nearRiver],
  ["credit", es.listing.credit],
  ["swap", es.listing.swap],
] as const;

export function ListingClient({ properties, zones, localities }: Props) {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [view, setView] = useState<"list" | "map">("list");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // Restore filters from the URL (static host: read on the client).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setFilters(searchParamsToFilters(sp));
    if (sp.get("view") === "map") setView("map");
    setReady(true);
  }, []);

  const ctx = useMemo(() => {
    const zoneSlug = Object.fromEntries(zones.map((z) => [z.id, z.slug]));
    return {
      zoneSlugByLocalityId: Object.fromEntries(localities.map((l) => [l.id, zoneSlug[l.zoneId]])),
      localitySlugById: Object.fromEntries(localities.map((l) => [l.id, l.slug])),
    };
  }, [zones, localities]);
  const locName = useMemo(
    () => Object.fromEntries(localities.map((l) => [l.id, l.name])),
    [localities],
  );

  const results = useMemo(
    () =>
      sortProperties(
        properties.filter((p) => matchesFilters(p, filters, ctx)),
        filters.sort,
      ),
    [properties, filters, ctx],
  );

  // Keep the URL in sync with filters and view.
  useEffect(() => {
    if (!ready) return;
    const sp = filtersToSearchParams(filters);
    if (view === "map") sp.set("view", "map");
    const qs = sp.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [filters, view, ready]);

  useEffect(() => {
    if (ready) track("view_item_list", { list_name: "listing", results_count: results.length });
  }, [results.length, ready]);

  const set = useCallback(
    <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K] | "") => {
      setFilters((f) => {
        const next = { ...f };
        if (value === "" || value === undefined || value === false) delete next[key];
        else next[key] = value as PropertyFilters[K];
        if (key === "zone") delete next.locality;
        return next;
      });
      track("filter_apply", {
        filter_name: key,
        value: value === "" ? "" : (value as string | number | boolean),
      });
    },
    [],
  );

  const visibleLocalities = localities.filter(
    (l) => !filters.zone || zones.find((z) => z.id === l.zoneId)?.slug === filters.zone,
  );
  const activeCount = Object.keys(filters).filter((k) => k !== "sort").length;

  const select = (key: keyof PropertyFilters, label: string, options: [string, string][]) => (
    <label className="block text-sm font-medium">
      {label}
      <select
        className={field}
        value={(filters[key] as string | undefined) ?? ""}
        onChange={(e) => set(key, e.target.value as never)}
        data-testid={`filter-${key}`}
      >
        <option value="">{es.listing.anyValue}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="mt-8 lg:grid lg:grid-cols-[18rem_1fr] lg:gap-10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-testid="filters-toggle"
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-stone)] bg-white px-4 py-2 text-sm font-medium lg:hidden"
      >
        <SlidersHorizontal size={16} aria-hidden /> {es.listing.filters}
        {activeCount > 0 && (
          <span className="rounded-full bg-[var(--color-accent)] px-2 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      <aside
        aria-label={es.listing.filters}
        className={`${open ? "block" : "hidden"} space-y-4 lg:block`}
        data-testid="filters"
      >
        {select(
          "zone",
          es.search.zone,
          zones.map((z) => [z.slug, z.name]),
        )}
        {select(
          "locality",
          es.search.locality,
          visibleLocalities.map((l) => [l.slug, l.name]),
        )}
        {select(
          "type",
          es.search.type,
          PROPERTY_TYPES.map((t) => [t, es.enums.type[t]]),
        )}
        <label className="block text-sm font-medium">
          {es.search.maxPrice}
          <input
            type="number"
            min={0}
            step={5000}
            className={field}
            value={filters.maxPrice ?? ""}
            onChange={(e) => set("maxPrice", e.target.value === "" ? "" : Number(e.target.value))}
            data-testid="filter-maxPrice"
          />
        </label>
        <p className="pt-2 font-[family-name:var(--font-display)] text-lg font-semibold">
          {es.listing.sierras}
        </p>
        {select(
          "water",
          es.listing.water,
          WATER_SOURCES.map((v) => [v, es.enums.water[v]]),
        )}
        {select(
          "road",
          es.listing.road,
          ROAD_ACCESS.map((v) => [v, es.enums.road[v]]),
        )}
        {select(
          "slope",
          es.listing.slope,
          SLOPES.map((v) => [v, es.enums.slope[v]]),
        )}
        {select(
          "title",
          es.listing.titleStatus,
          TITLE_STATUS.map((v) => [v, es.enums.title[v]]),
        )}
        {(["maxKmToTown", "maxKmToCordoba"] as const).map((k) => (
          <label key={k} className="block text-sm font-medium">
            {es.listing[k]}
            <input
              type="number"
              min={0}
              className={field}
              value={filters[k] ?? ""}
              onChange={(e) => set(k, e.target.value === "" ? "" : Number(e.target.value))}
              data-testid={`filter-${k}`}
            />
          </label>
        ))}
        <fieldset className="space-y-2">
          {BOOLS.map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--color-accent)]"
                checked={!!filters[k]}
                onChange={(e) => set(k, e.target.checked)}
                data-testid={`filter-${k}`}
              />
              {label}
            </label>
          ))}
        </fieldset>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => setFilters({})}
            className="text-sm underline underline-offset-4"
            data-testid="filters-clear"
          >
            {es.listing.clear}
          </button>
        )}
      </aside>

      <section aria-label="Resultados">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-medium" data-testid="results-count" aria-live="polite">
            {es.listing.results(results.length)}
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm">
              <span className="sr-only">{es.listing.sortLabel}</span>
              <select
                className="rounded-full border border-[var(--color-stone)] bg-white px-3 py-2 text-sm"
                value={filters.sort ?? "recent"}
                onChange={(e) => set("sort", e.target.value as PropertyFilters["sort"])}
                data-testid="sort"
              >
                {(Object.keys(es.listing.sort) as (keyof typeof es.listing.sort)[]).map((k) => (
                  <option key={k} value={k}>
                    {es.listing.sort[k]}
                  </option>
                ))}
              </select>
            </label>
            <div
              role="group"
              aria-label="Vista"
              className="flex rounded-full border border-[var(--color-stone)] bg-white p-1 text-sm"
            >
              {(["list", "map"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  data-testid={`view-${v}`}
                  onClick={() => {
                    setView(v);
                    track("map_toggle", { view: v });
                  }}
                  className={`rounded-full px-4 py-1.5 ${view === v ? "bg-[var(--color-accent)] text-white" : ""}`}
                >
                  {v === "list" ? es.listing.viewList : es.listing.viewMap}
                </button>
              ))}
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="rounded-[var(--radius)] bg-[var(--color-river)] p-8" data-testid="empty">
            {es.listing.empty}
          </p>
        ) : view === "map" ? (
          <MapView
            height="70vh"
            items={results.map((p) => ({
              slug: p.slug,
              title: p.title,
              price: p.showPrice ? formatUsd(p.amountUsd) : "Consultar",
              lat: p.lat,
              lng: p.lng,
            }))}
          />
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <PropertyCard key={p.id} p={p} localityName={locName[p.localityId] ?? ""} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
