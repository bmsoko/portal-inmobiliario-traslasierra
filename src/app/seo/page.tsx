import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SeoInspector } from "@/components/SeoInspector";
import { catalogRepo } from "@/lib/repository";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Cómo te encuentra Google",
  "Vista previa de cómo aparece cada página del sitio en Google: título, descripción y datos estructurados.",
  "/seo/",
);

export default function SeoPage() {
  const paths = [
    "/",
    "/propiedades/",
    ...catalogRepo.zones().map((z) => `/zonas/${z.slug}/`),
    "/corredores/",
    ...catalogRepo.agents().map((a) => `/corredores/${a.slug}/`),
    "/tasaciones/",
    "/contacto/",
  ];
  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <Breadcrumbs items={[{ name: "SEO" }]} />
      <h1 className="mt-4 text-4xl sm:text-6xl">Cómo te encuentra Google</h1>
      <p className="mt-5 max-w-2xl text-lg text-[var(--color-muted)]">
        Cada página ya sale preparada para buscadores: título y descripción propios, dirección
        canónica y datos estructurados que Google usa para mostrar precio, ubicación y la red de
        corredores. Esta vista lee las páginas reales del sitio.
      </p>
      <div className="mt-8 rounded-[var(--radius)] bg-[var(--color-river)] p-6 text-sm leading-relaxed">
        <p>
          <strong>Mientras sea una demo, el sitio está oculto a Google.</strong> Al lanzar, quitamos
          esa marca, conectamos Google Search Console y enviamos el{" "}
          <a href="/sitemap.xml" className="underline underline-offset-4">
            mapa del sitio
          </a>
          , que ya lista todas las propiedades, zonas y corredores.
        </p>
      </div>
      <SeoInspector paths={paths} />
      <JsonLd data={breadcrumbLd([{ name: "SEO", path: "/seo/" }])} />
    </main>
  );
}
