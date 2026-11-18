"use client";
import dynamic from "next/dynamic";

export interface MapItem {
  slug: string;
  title: string;
  price: number | string | null; // number = USD amount, formatted by the map
  lat: number;
  lng: number;
}
export interface MapViewProps {
  items: MapItem[];
  height?: string;
}

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-[var(--color-river)]" aria-hidden />
  ),
});

// Leaflet is client-only and lazy-loaded.
export default function MapView({ items, height = "70vh" }: MapViewProps) {
  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-[var(--radius)]"
      data-testid="map-view"
      role="region"
      aria-label="Mapa de propiedades"
    >
      <MapInner items={items} />
    </div>
  );
}
