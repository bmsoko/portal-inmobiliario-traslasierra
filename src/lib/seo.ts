import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function pageMeta(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path } };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.baseUrl,
  description: "Red de corredores matriculados de las sierras de Córdoba.",
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteConfig.baseUrl}${it.path}`,
    })),
  };
}
