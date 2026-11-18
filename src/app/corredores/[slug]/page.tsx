import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PropertyCard } from "@/components/PropertyCard";
import { TrackOnMount } from "@/components/TrackOnMount";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { es } from "@/content/es";
import { catalogRepo, propertyRepo } from "@/lib/repository";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogRepo.agents().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = catalogRepo.getAgent(slug);
  if (!a) return {};
  return pageMeta(`${a.name} · ${a.agencyName}`, a.bio, `/corredores/${a.slug}/`);
}

export default async function BrokerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = catalogRepo.getAgent(slug);
  if (!a) notFound();

  const props = propertyRepo.listByAgent(a.id);
  const zoneNames = catalogRepo
    .zones()
    .filter((z) => a.zoneIds.includes(z.id))
    .map((z) => z.name);
  const crumbs = [
    { name: es.nav.brokers, path: "/corredores/" },
    { name: a.name, path: `/corredores/${a.slug}/` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <TrackOnMount name="agent_profile_view" params={{ agent_id: a.id }} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={[{ name: es.nav.brokers, href: "/corredores/" }, { name: a.name }]} />

      <section className="mt-10 grid gap-10 md:grid-cols-[320px_1fr]">
        <Image
          src={a.photo}
          alt={`Foto de ${a.name}`}
          width={640}
          height={640}
          priority
          className="aspect-square w-full rounded-[var(--radius)] object-cover"
        />
        <div className="self-center">
          <h1 className="text-4xl sm:text-6xl">{a.name}</h1>
          <p className="mt-4 max-w-prose text-lg text-[var(--color-muted)]">{a.bio}</p>
          <dl className="mt-6 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--color-muted)]">{es.brokers.license}</dt>
              <dd className="font-medium">{a.licenseNumber}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">{es.brokers.zonesLabel}</dt>
              <dd className="font-medium">{zoneNames.join(", ")}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Image
              src={a.agencyLogo}
              alt={`Logo de ${a.agencyName}`}
              width={160}
              height={80}
              className="h-12 w-auto"
            />
            <p className="text-sm text-[var(--color-muted)]">{es.brokers.networkBy}</p>
          </div>
          <WhatsAppLink
            message={`Hola! Quiero consultar por propiedades de ${a.name}.`}
            label={es.cta.whatsapp}
            placement="broker_profile"
            agentId={a.id}
            className="mt-8"
          />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="mb-8 text-3xl">{es.brokers.propertiesOf(a.name)}</h2>
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
          <p className="text-[var(--color-muted)]">{es.brokers.noProperties}</p>
        )}
      </section>
    </main>
  );
}
