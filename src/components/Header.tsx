import Link from "next/link";
import { Menu } from "lucide-react";
import { es } from "@/content/es";

const links = [
  { href: "/propiedades/", label: es.nav.properties },
  { href: "/zonas/traslasierra/", label: es.nav.zones },
  { href: "/corredores/", label: es.nav.brokers },
  { href: "/tasaciones/", label: es.nav.valuation },
  { href: "/contacto/", label: es.nav.contact },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-stone)] bg-[var(--color-bg)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {/* TODO(client): logo */}
          Sierras <span className="text-[var(--color-accent)]">Cordobesas</span>
        </Link>
        <nav aria-label="Principal" className="hidden gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--color-accent)]">
              {l.label}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary
            aria-label={es.nav.menu}
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--color-stone)]"
          >
            <Menu size={20} aria-hidden />
          </summary>
          <nav
            aria-label="Principal móvil"
            className="absolute right-0 mt-2 flex w-56 flex-col rounded-2xl border border-[var(--color-stone)] bg-white p-2 shadow-lg"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 hover:bg-[var(--color-bg)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
