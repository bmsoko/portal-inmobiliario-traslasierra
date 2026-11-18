import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm, type LeadField } from "@/components/LeadForm";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { es } from "@/content/es";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta(es.contact.title, es.contact.subtitle, "/contacto/");

const fields: LeadField[] = [
  { name: "name", label: es.forms.name, required: true },
  { name: "phone", label: es.forms.phone, type: "tel", required: true },
  { name: "email", label: es.forms.email, type: "email" },
  {
    name: "message",
    label: es.forms.message,
    type: "textarea",
    required: true,
    placeholder: es.contact.messagePlaceholder,
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <JsonLd data={breadcrumbLd([{ name: es.contact.title, path: "/contacto/" }])} />
      <Breadcrumbs items={[{ name: es.contact.title }]} />
      <div className="mt-8 grid gap-12 md:grid-cols-[2fr_3fr]">
        <div>
          <h1 className="text-5xl sm:text-6xl">{es.contact.title}</h1>
          <p className="mt-4 text-lg text-[var(--color-muted)]">{es.contact.subtitle}</p>
          <WhatsAppLink
            message="Hola! Quiero hacer una consulta."
            label={es.cta.whatsapp}
            placement="contact_page"
            className="mt-8"
          />
        </div>
        <LeadForm channel="contact" intro="Hola! Les escribo desde el sitio." fields={fields} />
      </div>
    </main>
  );
}
