import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ListingClient } from "@/components/ListingClient";
import { es } from "@/content/es";
import { catalogRepo, propertyRepo } from "@/lib/repository";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  es.listing.title,
  "Casas, lotes, cabañas y campos en venta en las sierras de Córdoba.",
  "/propiedades/",
);

export default function PropertiesPage() {
  const zones = catalogRepo.zones();
  const zoneIds = new Set(zones.map((z) => z.id));
  const localities = catalogRepo.localities().filter((l) => zoneIds.has(l.zoneId));
  const localityIds = new Set(localities.map((l) => l.id));
  const properties = propertyRepo.list().filter((p) => localityIds.has(p.localityId));
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10">
      <Breadcrumbs items={[{ name: es.nav.properties }]} />
      <h1 className="mt-4 text-4xl sm:text-6xl">{es.listing.title}</h1>
      <ListingClient
        properties={properties}
        zones={zones.map(({ id, slug, name }) => ({ id, slug, name }))}
        localities={localities.map(({ id, zoneId, slug, name }) => ({ id, zoneId, slug, name }))}
      />
      <JsonLd data={breadcrumbLd([{ name: es.nav.properties, path: "/propiedades/" }])} />
    </main>
  );
}
