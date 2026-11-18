import { es } from "@/content/es";
import { catalogRepo, propertyRepo } from "@/lib/repository";

// Step 1 shell. Public pages arrive in step 2.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6">
      <p className="text-sm font-medium tracking-widest text-[var(--color-accent)] uppercase">
        {es.brand.name}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{es.home.heroTitle}</h1>
      <p className="text-[var(--color-muted)]">{es.home.heroSubtitle}</p>
      <p data-testid="shell-stats" className="text-sm text-[var(--color-muted)]">
        {catalogRepo.zones().length} zonas · {propertyRepo.list().length} propiedades de
        demostración
      </p>
    </main>
  );
}
