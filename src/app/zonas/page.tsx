import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { es } from "@/content/es";
import { catalogRepo, propertyRepo } from "@/lib/repository";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(es.zones.title, es.zones.subtitle, "/zonas/");

export default function ZonesIndex() {
  const zones = catalogRepo.zones();
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <JsonLd data={breadcrumbLd([{ name: es.zones.title, path: "/zonas/" }])} />
      <Breadcrumbs items={[{ name: es.zones.title }]} />
      <h1 className="mt-8 text-5xl sm:text-6xl">{es.zones.title}</h1>
      <p className="mt-4 max-w-xl text-lg text-[var(--color-muted)]">{es.zones.subtitle}</p>
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        {zones.map((z, i) => (
          <Link
            key={z.id}
            href={`/zonas/${z.slug}/`}
            className={`group relative isolate flex min-h-72 items-end overflow-hidden rounded-[var(--radius)] ${i === 0 ? "md:col-span-4 md:min-h-96" : i === 1 ? "md:col-span-2 md:min-h-96" : "md:col-span-3"}`}
          >
            <Image
              src={z.heroImage}
              alt={`Paisaje de ${z.name}`}
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="-z-10 object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
              <h2 className="text-3xl">{z.name}</h2>
              <p className="text-sm text-white/85">
                {propertyRepo.listByZone(z.slug).length} propiedades
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
