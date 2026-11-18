import Image from "next/image";
import Link from "next/link";
import { es } from "@/content/es";
import { formatUsd } from "@/lib/format";
import type { Property } from "@/lib/schemas";

export function PropertyCard({ p, localityName }: { p: Property; localityName: string }) {
  const cover = p.images.find((i) => i.cover) ?? p.images[0];
  const size = p.hectares
    ? `${p.hectares} ${es.card.ha}`
    : p.landM2
      ? `${p.landM2.toLocaleString("es-AR")} ${es.card.m2}`
      : p.coveredM2
        ? `${p.coveredM2} ${es.card.m2}`
        : null;
  return (
    <article
      data-testid="property-card"
      className="group overflow-hidden rounded-[var(--radius)] border border-[var(--color-stone)] bg-white"
    >
      <Link href={`/propiedad/${p.slug}/`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-stone)]">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium">
            {es.enums.type[p.type]}
          </span>
          {p.status !== "DISPONIBLE" && (
            <span className="absolute top-3 right-3 rounded-full bg-[var(--color-ink)] px-3 py-1 text-xs font-medium text-white">
              {p.status === "RESERVADA" ? es.card.reserved : es.card.sold}
            </span>
          )}
        </div>
        <div className="space-y-2 p-4">
          <p className="text-xl font-semibold">
            {p.showPrice ? formatUsd(p.amountUsd) : es.card.consult}
          </p>
          <h3 className="leading-snug font-medium">{p.title}</h3>
          <p className="text-sm text-[var(--color-muted)]">{localityName}</p>
          <p className="flex flex-wrap gap-x-3 text-xs text-[var(--color-muted)]">
            {size && <span>{size}</span>}
            {p.bedrooms ? (
              <span>
                {p.bedrooms} {es.card.bedrooms}
              </span>
            ) : null}
            {p.nearRiver && <span>{es.card.nearRiver}</span>}
            {p.mountainView && <span>{es.card.view}</span>}
          </p>
        </div>
      </Link>
    </article>
  );
}
