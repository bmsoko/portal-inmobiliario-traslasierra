"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatUsd } from "@/lib/format";
import type { MapItem } from "./MapView";

export default function MapInner({ items }: { items: MapItem[] }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    const map = L.map(el.current, { scrollWheelZoom: false }).setView([-31.5, -64.6], 8);
    // OSM standard tiles: fine for a private demo; see docs/COSTS.md for the production plan.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    const pts: L.LatLngTuple[] = [];
    for (const it of items) {
      const icon = L.divIcon({
        className: "",
        html: `<div class="price-pill">${typeof it.price === "number" ? formatUsd(it.price) : (it.price ?? "Consultar")}</div>`,
        iconSize: undefined,
        iconAnchor: [28, 14],
      });
      const m = L.marker([it.lat, it.lng], { icon, title: it.title }).addTo(map);
      const a = document.createElement("a");
      a.href = `/propiedad/${it.slug}/`;
      a.textContent = it.title;
      m.bindPopup(a);
      pts.push([it.lat, it.lng]);
    }
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 13 });
    return () => {
      map.remove();
    };
  }, [items]);

  return <div ref={el} className="h-full w-full" />;
}
