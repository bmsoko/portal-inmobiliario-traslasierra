import Image from "next/image";
import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchForm } from "@/components/SearchForm";
import { TrackOnMount } from "@/components/TrackOnMount";
import { es } from "@/content/es";
import { catalogRepo, propertyRepo } from "@/lib/repository";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  `${es.brand.name} · ${es.brand.tagline}`,
  es.home.heroSubtitle,
  "/",
);

export default function Home() {
  const zones = catalogRepo.zones();
  const featured = propertyRepo.featured().slice(0, 4);
  const locs = catalogRepo.localities();
  const locName = (id: string) => catalogRepo.getLocality(id)?.name ?? "";
  const zoneCount = (slug: string) => propertyRepo.listByZone(slug).length;

  return (
    <main>
      <TrackOnMount
        name="view_item_list"
        params={{ list_name: "home", results_count: featured.length }}
      />
      {/* Hero: full-bleed landscape, sentence search is the one bold element */}
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-[var(--color-accent)] pb-14 sm:pb-20">
        <Image
          src={zones[0]?.heroImage ?? ""}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(6_32_29/0.92),rgb(6_32_29/0.55)_55%,rgb(6_32_29/0.25)),linear-gradient(to_right,rgb(6_32_29/0.55),transparent_70%)]" />
        <div className="mx-auto w-full max-w-6xl px-4">
          <h1 className="hero-settle max-w-3xl text-5xl text-white sm:text-7xl">
            {es.home.heroTitle}
          </h1>
          <p
            className="hero-settle mt-5 max-w-xl text-lg text-white/85"
            style={{ animationDelay: "120ms" }}
          >
            {es.home.heroSubtitle}
          </p>
          <div className="hero-settle mt-10" style={{ animationDelay: "240ms" }}>
            <SearchForm localities={locs.map((l) => ({ slug: l.slug, name: l.name }))} />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl sm:text-5xl">{es.home.featuredTitle}</h2>
          <Link
            href="/propiedades/"
            className="shrink-0 text-sm font-medium underline underline-offset-4"
          >
            {es.home.featuredAll}
          </Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <div key={p.id} className={i === 0 ? "sm:col-span-2" : ""}>
              <PropertyCard p={p} localityName={locName(p.localityId)} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-4">
        <h2 className="text-3xl sm:text-5xl">{es.home.zonesTitle}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-6">
          {zones.map((z, i) => (
            <Link
              key={z.id}
              href={`/zonas/${z.slug}/`}
              data-testid="zone-tile"
              className={`group relative isolate flex min-h-64 items-end overflow-hidden rounded-[var(--radius)] p-6 text-white ${i === 0 ? "sm:col-span-4 sm:row-span-2 sm:min-h-[34rem]" : i === 3 ? "sm:col-span-6 sm:min-h-48" : "sm:col-span-2"}`}
            >
              <Image
                src={z.heroImage}
                alt=""
                fill
                sizes="(min-width:640px) 50vw, 100vw"
                className="-z-20 object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-transparent" />
              <div>
                <h3 className="text-2xl sm:text-3xl">{z.name}</h3>
                <p className="mt-1 text-sm text-white/85">{zoneCount(z.slug)} propiedades</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-4">
        <h2 className="text-3xl sm:text-5xl">{es.home.howTitle}</h2>
        <p className="mt-4 max-w-xl text-[var(--color-muted)]">{es.home.howSubtitle}</p>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {es.home.how.map((h) => (
            <div key={h.title} className="border-l-2 border-[var(--color-accent)] pl-5">
              <h3 className="text-xl">{h.title}</h3>
              <p className="mt-2 text-[var(--color-muted)]">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-28 rounded-[32px] bg-[var(--color-accent)] px-6 py-16 text-white sm:mx-auto sm:max-w-6xl sm:px-14">
        <h2 className="max-w-2xl text-3xl sm:text-5xl">{es.home.valuationTitle}</h2>
        <p className="mt-4 max-w-lg text-white/80">{es.home.valuationBody}</p>
        <Link
          href="/tasaciones/"
          className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--color-accent)] hover:opacity-90"
        >
          {es.cta.valuation}
        </Link>
      </section>
    </main>
  );
}
