import Link from "next/link";
import { es } from "@/content/es";
import { catalogRepo } from "@/lib/repository";

export default function NotFound() {
  const locs = catalogRepo
    .localities()
    .filter((l) => catalogRepo.zones().some((z) => z.id === l.zoneId));
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-5xl sm:text-6xl">{es.notFound.title}</h1>
      <p className="mt-4 text-lg text-[var(--color-muted)]">{es.notFound.body}</p>
      <Link
        href="/propiedades/"
        className="mt-8 inline-flex rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-fg)]"
      >
        {es.notFound.cta}
      </Link>
      <p className="mt-12 text-sm text-[var(--color-muted)]">{es.search.locality}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {locs.map((l) => (
          <li key={l.id}>
            <Link
              href={`/propiedades/?locality=${l.slug}`}
              className="inline-block rounded-full border border-[var(--color-stone)] px-4 py-2 text-sm hover:border-[var(--color-accent)]"
            >
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
