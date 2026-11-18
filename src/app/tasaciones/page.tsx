import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { es } from "@/content/es";
import { catalogRepo } from "@/lib/repository";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(es.valuation.title, es.valuation.subtitle, "/tasaciones/");

export default function ValuationPage() {
  const fields: LeadField[] = [
    { name: "name", label: es.forms.name, required: true },
    { name: "phone", label: es.forms.phone, type: "tel", required: true },
    { name: "email", label: es.forms.email, type: "email" },
    {
      name: "kind",
      label: es.valuation.kind,
      type: "select",
      options: Object.values(es.enums.type),
      required: true,
    },
    {
      name: "locality",
      label: es.valuation.locality,
      type: "select",
      options: catalogRepo.localities().map((l) => l.name),
      required: true,
    },
    { name: "address", label: es.valuation.address },
    { name: "size", label: es.valuation.size },
    { name: "notes", label: es.valuation.notes, type: "textarea" },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <JsonLd data={breadcrumbLd([{ name: es.valuation.title, path: "/tasaciones/" }])} />
      <Breadcrumbs items={[{ name: es.valuation.title }]} />
      <div className="mt-8 grid gap-12 md:grid-cols-[2fr_3fr]">
        <div>
          <h1 className="text-5xl sm:text-6xl">{es.valuation.title}</h1>
          <p className="mt-4 text-lg text-[var(--color-muted)]">{es.valuation.subtitle}</p>
        </div>
        <LeadForm channel="valuation" intro="Hola! Quiero pedir una tasación." fields={fields} />
      </div>
    </main>
  );
}
