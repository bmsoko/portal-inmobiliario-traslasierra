import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import photos from "@/data/photos.json";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Créditos de fotos",
  "Autores y licencias de las fotografías usadas en este sitio de demostración.",
  "/creditos/",
);

export default function CreditsPage() {
  const entries = Object.values(
    photos as Record<string, { title: string; author: string; license: string; source: string }>,
  );
  return (
    <main className="mx-auto max-w-3xl px-4 pt-10">
      <Breadcrumbs items={[{ name: "Créditos de fotos" }]} />
      <h1 className="mt-4 text-4xl sm:text-5xl">Créditos de fotos</h1>
      <p className="mt-4 text-[var(--color-muted)]">
        Las fotos de esta demostración son de Wikimedia Commons y se usan según su licencia.
        Muestran las zonas de las sierras como referencia: no son las propiedades publicadas.
      </p>
      <ul className="mt-8 divide-y divide-[var(--color-stone)] text-sm">
        {entries.map((e) => (
          <li key={e.source} className="py-3">
            <a
              href={e.source}
              className="font-medium underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {e.title.replace(/^File:/, "").replace(/\.(jpe?g)$/i, "")}
            </a>
            <span className="text-[var(--color-muted)]">
              {" "}
              por {e.author}, {e.license}
            </span>
          </li>
        ))}
      </ul>
      <JsonLd data={breadcrumbLd([{ name: "Créditos de fotos", path: "/creditos/" }])} />
    </main>
  );
}
