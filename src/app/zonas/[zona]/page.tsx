import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import MapView from "@/components/MapView";
import { PropertyCard } from "@/components/PropertyCard";
import { TrackOnMount } from "@/components/TrackOnMount";
import { es } from "@/content/es";
import { formatUsd } from "@/lib/format";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { catalogRepo, propertyRepo } from "@/lib/repository";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogRepo.zones().map((z) => ({ zona: z.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ zona: string }>;
}): Promise<Metadata> {
  const { zona } = await params;
  const zone = catalogRepo.getZone(zona);
  if (!zone) return {};
  return pageMeta(`Propiedades en ${zone.name}`, zone.description, `/zonas/${zone.slug}/`);
}

export default async function ZonePage({ params }: { params: Promise<{ zona: string }> }) {
  const { zona } = await params;
  const zone = catalogRepo.getZone(zona);
  if (!zone) notFound();

  const locs = catalogRepo.localities(zone.id);
  const props = propertyRepo.listByZone(zone.slug);
  const brokers = catalogRepo
    .agents()
    .filter((a) => a.zoneIds.includes(zone.id) && a.id !== "agent-central");
  const crumbs = [
    { name: es.zones.title, path: "/zonas/" },
    { name: zone.name, path: `/zonas/${zone.slug}/` },
  ];

  return (
    <main>
      <TrackOnMount
        name="view_item_list"
        params={{ list_name: `zona:${zone.slug}`, results_count: props.length }}
      />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden bg-[var(--color-ink)]">
        <Image
          src={zone.heroImage}
          alt={`Paisaje de ${zone.name}`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-80"
        />
        <div className="mx-auto w-full max-w-6xl px-4 pt-32 pb-12 text-white">
          <h1 className="hero-settle text-5xl sm:text-7xl">{zone.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{zone.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 pt-6">
        <Breadcrumbs items={[{ name: es.zones.title, href: "/zonas/" }, { name: zone.name }]} />

        <section className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl">{es.zones.localities}</h2>
          <ul className="divide-y divide-[var(--color-stone)]">
            {locs.map((l) => (
              <li key={l.id} className="py-4">
                <Link
                  href={`/propiedades/?locality=${l.slug}`}
                  className="text-lg font-medium hover:text-[var(--color-accent)]"
                >
                  {l.name}
                </Link>
                <p className="mt-1 max-w-prose text-[var(--color-muted)]">{l.shortGuide}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-8 text-3xl">{es.zones.properties}</h2>
          {props.length ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {props.map((p) => (
                <PropertyCard
                  key={p.id}
                  p={p}
                  localityName={catalogRepo.getLocality(p.localityId)?.name ?? ""}
                />
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-muted)]">{es.zones.noProperties}</p>
          )}
        </section>

        {props.length > 0 && (
          <section>
            <h2 className="mb-6 text-3xl">{es.zones.mapTitle}</h2>
            <MapView
              height="420px"
              items={props.map((p) => ({
                slug: p.slug,
                title: p.title,
                price: p.showPrice ? formatUsd(p.amountUsd) : es.card.consult,
                lat: p.lat,
                lng: p.lng,
              }))}
            />
          </section>
        )}

        {brokers.length > 0 && (
          <section className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <h2 className="text-3xl">{es.zones.brokers}</h2>
            <ul className="space-y-6">
              {brokers.map((a) => (
                <li key={a.id} className="flex items-center gap-4">
                  <Image
                    src={a.photo}
                    alt={`Foto de ${a.name}`}
                    width={72}
                    height={72}
                    className="h-18 w-18 rounded-full object-cover"
                  />
                  <div>
                    <Link
                      href={`/corredores/${a.slug}/`}
                      className="font-medium hover:text-[var(--color-accent)]"
                    >
                      {a.name}
                    </Link>
                    <p className="text-sm text-[var(--color-muted)]">{a.agencyName}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
