import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { catalogRepo, propertyRepo } from "@/lib/repository";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/propiedades/",
    "/corredores/",
    "/tasaciones/",
    "/contacto/",
    ...catalogRepo.zones().map((z) => `/zonas/${z.slug}/`),
    ...catalogRepo.agents().map((a) => `/corredores/${a.slug}/`),
    ...propertyRepo.list().map((p) => `/propiedad/${p.slug}/`),
  ];
  return paths.map((p) => ({ url: `${siteConfig.baseUrl}${p}` }));
}
