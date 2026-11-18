"use client";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

interface Report {
  path: string;
  title: string;
  description: string;
  canonical: string | null;
  h1Count: number;
  jsonLdTypes: string[];
  jsonLdRaw: string[];
  jsonLdValid: boolean;
  noindex: boolean;
}

// Reads the real <head> of every built page, so the demo shows what Google would receive.
async function inspect(path: string): Promise<Report> {
  const html = await fetch(path).then((r) => r.text());
  const doc = new DOMParser().parseFromString(html, "text/html");
  const raw = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(
    (s) => s.textContent ?? "",
  );
  let valid = raw.length > 0;
  const types: string[] = [];
  for (const r of raw) {
    try {
      const j = JSON.parse(r);
      for (const item of Array.isArray(j) ? j : [j]) types.push(String(item["@type"]));
    } catch {
      valid = false;
    }
  }
  return {
    path,
    title: doc.title,
    description: doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    h1Count: doc.querySelectorAll("h1").length,
    jsonLdTypes: types,
    jsonLdRaw: raw,
    jsonLdValid: valid,
    noindex: /noindex/.test(
      doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
    ),
  };
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {ok ? (
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0 text-[var(--color-accent)]"
          aria-hidden
        />
      ) : (
        <CircleAlert size={18} className="mt-0.5 shrink-0 text-amber-700" aria-hidden />
      )}
      <span>
        <span className="sr-only">{ok ? "Correcto: " : "Revisar: "}</span>
        {children}
      </span>
    </li>
  );
}

export function SeoInspector({ paths }: { paths: string[] }) {
  const [reports, setReports] = useState<Report[] | null>(null);

  useEffect(() => {
    Promise.all(paths.map(inspect)).then(setReports);
  }, [paths]);

  if (!reports)
    return <p className="mt-10 text-[var(--color-muted)]">Analizando {paths.length} páginas…</p>;

  const passing = reports.filter(
    (r) => r.title && r.description.length >= 50 && r.canonical && r.h1Count === 1 && r.jsonLdValid,
  ).length;

  return (
    <div className="mt-10 space-y-6" data-testid="seo-inspector">
      <p className="text-lg" data-testid="seo-summary">
        <strong>
          {passing} de {reports.length}
        </strong>{" "}
        páginas cumplen con título, descripción, URL canónica, un único título principal y datos
        estructurados.
      </p>
      {reports.map((r) => {
        const url = r.canonical
          ? new URL(r.canonical, siteConfig.baseUrl).href
          : siteConfig.baseUrl + r.path;
        return (
          <article
            key={r.path}
            className="rounded-[var(--radius)] bg-white p-5 sm:p-7"
            data-testid="seo-report"
          >
            <div className="max-w-2xl">
              <p className="truncate text-sm text-[#4d5156]">
                {url.replace(/\/$/, "").replace("https://", "")}
              </p>
              <h2 className="mt-1 font-sans text-xl leading-snug font-normal tracking-normal text-[#1a0dab]">
                {r.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{r.description}</p>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              <Check ok={r.title.length > 10 && r.title.length <= 70}>
                Título de {r.title.length} caracteres
              </Check>
              <Check ok={r.description.length >= 50 && r.description.length <= 160}>
                Descripción de {r.description.length} caracteres
              </Check>
              <Check ok={!!r.canonical}>URL canónica {r.canonical ? "definida" : "faltante"}</Check>
              <Check ok={r.h1Count === 1}>{r.h1Count} título principal (H1)</Check>
              <Check ok={r.jsonLdValid}>
                Datos estructurados: {r.jsonLdTypes.join(", ") || "ninguno"}
              </Check>
              <Check ok={r.noindex}>
                {r.noindex ? "Oculta a Google mientras es demo" : "Visible para Google"}
              </Check>
            </ul>
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer font-medium">Ver datos estructurados</summary>
              <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-[var(--color-bg)] p-4 text-xs">
                {r.jsonLdRaw.map((j) => JSON.stringify(JSON.parse(j), null, 2)).join("\n\n")}
              </pre>
            </details>
          </article>
        );
      })}
    </div>
  );
}
