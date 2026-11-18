import Link from "next/link";
import { es } from "@/content/es";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-[var(--color-muted)]">
      <ol className="flex flex-wrap gap-2">
        <li>
          <Link href="/" className="hover:underline">
            {es.nav.home}
          </Link>
        </li>
        {items.map((it) => (
          <li key={it.name} className="flex gap-2">
            <span aria-hidden>/</span>
            {it.href ? (
              <Link href={it.href} className="hover:underline">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
