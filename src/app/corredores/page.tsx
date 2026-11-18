import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { es } from "@/content/es";
import { catalogRepo } from "@/lib/repository";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(es.brokers.title, es.brokers.subtitle, "/corredores/");

export default function BrokersPage() {
  const all = catalogRepo.agents();
  const central = all.find((a) => a.id === "agent-central");
  const allies = all.filter((a) => a.id !== "agent-central");
  const zoneName = (id: string) => catalogRepo.zones().find((z) => z.id === id)?.name;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <JsonLd data={breadcrumbLd([{ name: es.nav.brokers, path: "/corredores/" }])} />
      <Breadcrumbs items={[{ name: es.nav.brokers }]} />
      <div className="mt-8 grid gap-10 md:grid-cols-[3fr_2fr] md:items-end">
        <h1 className="text-5xl sm:text-6xl">{es.brokers.title}</h1>
        <p className="text-lg text-[var(--color-muted)]">{es.brokers.subtitle}</p>
      </div>

      {central && (
        <section className="mt-12 rounded-[var(--radius)] bg-[var(--color-accent)] p-8 text-white sm:p-12">
          <h2 className="text-3xl">{central.name}</h2>
          <p className="mt-3 max-w-xl text-white/85">{central.bio}</p>
          <WhatsAppLink
            message="Hola! Quiero consultar a la red de corredores."
            label={es.brokers.askCentral}
            placement="brokers_central"
            agentId={central.id}
            className="mt-6 !bg-white !text-[var(--color-accent)]"
          />
        </section>
      )}

      <ul className="mt-16 divide-y divide-[var(--color-stone)]">
        {allies.map((a) => (
          <li key={a.id}>
            <Link
              href={`/corredores/${a.slug}/`}
              className="group grid items-center gap-6 py-8 sm:grid-cols-[96px_1fr_auto]"
            >
              <Image
                src={a.photo}
                alt={`Foto de ${a.name}`}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl group-hover:text-[var(--color-accent)]">{a.name}</h2>
                <p className="text-[var(--color-muted)]">
                  {a.agencyName} · {a.zoneIds.map(zoneName).filter(Boolean).join(", ")}
                </p>
              </div>
              <Image
                src={a.agencyLogo}
                alt={`Logo de ${a.agencyName}`}
                width={120}
                height={60}
                className="hidden h-12 w-auto sm:block"
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
