"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { es } from "@/content/es";
import { track } from "@/features/analytics/track";
import { filtersToSearchParams } from "@/lib/filters";
import { formatUsd } from "@/lib/format";
import type { Locality } from "@/lib/schemas";
import { PROPERTY_TYPES } from "@/lib/schemas";

const PRICES = [50000, 100000, 200000, 300000, 500000];
// Sentence-style search: "Busco [tipo] en [lugar] hasta [precio]".
const sel =
  "mx-1 cursor-pointer rounded-xl border-b-2 border-[var(--color-accent)] bg-[var(--color-river)]/60 py-1 pr-1 pl-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-accent)] sm:text-2xl";

export function SearchForm({ localities }: { localities: Pick<Locality, "slug" | "name">[] }) {
  const router = useRouter();
  const [type, setType] = useState("");
  const [locality, setLocality] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const sorted = useMemo(
    () => [...localities].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [localities],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const f = {
      ...(type && { type }),
      ...(locality && { locality }),
      ...(maxPrice && { maxPrice: Number(maxPrice) }),
    };
    track("search", {
      type: type || undefined,
      locality: locality || undefined,
      price_max: maxPrice ? Number(maxPrice) : undefined,
    });
    const qs = filtersToSearchParams(f).toString();
    router.push(`/propiedades/${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      data-testid="home-search"
      className="max-w-4xl rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.45)] sm:p-7"
    >
      <p className="flex flex-wrap items-center gap-y-3 text-xl leading-relaxed sm:text-2xl">
        <span className="font-[family-name:var(--font-display)] font-semibold">Busco</span>
        <label>
          <span className="sr-only">{es.search.type}</span>
          <select
            className={sel}
            value={type}
            onChange={(e) => setType(e.target.value)}
            data-testid="search-type"
          >
            <option value="">{es.search.anyType.toLowerCase()}</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {es.enums.type[t].toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <span className="font-[family-name:var(--font-display)] font-semibold">en</span>
        <label>
          <span className="sr-only">{es.search.locality}</span>
          <select
            className={sel}
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            data-testid="search-locality"
          >
            <option value="">las sierras</option>
            {sorted.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <span className="font-[family-name:var(--font-display)] font-semibold">hasta</span>
        <label>
          <span className="sr-only">{es.search.maxPrice}</span>
          <select
            className={sel}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            data-testid="search-price"
          >
            <option value="">sin límite</option>
            {PRICES.map((p) => (
              <option key={p} value={p}>
                {formatUsd(p)}
              </option>
            ))}
          </select>
        </label>
      </p>
      <button
        type="submit"
        data-testid="search-submit"
        className="mt-5 w-full rounded-full bg-[var(--color-accent)] px-8 py-3.5 text-base font-medium text-white transition hover:opacity-90 sm:w-auto"
      >
        {es.home.searchCta}
      </button>
    </form>
  );
}
