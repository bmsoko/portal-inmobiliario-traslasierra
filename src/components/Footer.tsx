import { es } from "@/content/es";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-stone)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[var(--color-muted)]">
        <p className="font-medium text-[var(--color-ink)]">{es.brand.name}</p>
        <p className="mt-1">{es.footer.about}</p>
        <p className="mt-4">
          {es.footer.demo} © 2026 {es.brand.name}. {es.footer.rights}
        </p>
      </div>
    </footer>
  );
}
