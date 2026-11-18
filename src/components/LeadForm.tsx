"use client";
import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { es } from "@/content/es";
import { track } from "@/features/analytics/track";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/whatsapp";

export interface LeadField {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea" | "select" | "datetime-local";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

interface Props {
  channel: "contact" | "video_visit" | "valuation";
  intro: string;
  fields: LeadField[];
  propertyId?: string;
}

const inputCls =
  "mt-1 w-full rounded-xl border border-[var(--color-stone)] bg-white px-3 py-2.5 text-sm focus:outline-2 focus:outline-[var(--color-accent)]";

// No backend: builds a prefilled WhatsApp message to the central number (mailto fallback).
export function LeadForm({ channel, intro, fields, propertyId }: Props) {
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const missing: Record<string, boolean> = {};
    const lines: string[] = [intro];
    for (const f of fields) {
      const v = String(data.get(f.name) ?? "").trim();
      if (f.required && !v) missing[f.name] = true;
      if (v) lines.push(`${f.label}: ${v}`);
    }
    setErrors(missing);
    if (Object.keys(missing).length) return;
    track("generate_lead", { channel, property_id: propertyId });
    window.open(
      buildWhatsAppUrl(siteConfig.centralWhatsApp, lines.join("\n")),
      "_blank",
      "noopener",
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate data-testid={`lead-form-${channel}`} className="space-y-4">
      {fields.map((f) => {
        const id = `${channel}-${f.name}`;
        const common = {
          id,
          name: f.name,
          className: inputCls,
          "aria-invalid": errors[f.name] || undefined,
          "aria-describedby": errors[f.name] ? `${id}-err` : undefined,
        };
        return (
          <div key={f.name}>
            <label htmlFor={id} className="text-sm font-medium">
              {f.label}
              {f.required && <span aria-hidden> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={4} placeholder={f.placeholder} />
            ) : f.type === "select" ? (
              <select {...common} defaultValue="">
                <option value="">—</option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input {...common} type={f.type ?? "text"} placeholder={f.placeholder} />
            )}
            {errors[f.name] && (
              <p id={`${id}-err`} className="mt-1 text-sm text-red-700">
                {es.forms.required}
              </p>
            )}
          </div>
        );
      })}
      <button
        type="submit"
        className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-fg)] hover:opacity-90"
      >
        {es.forms.send}
      </button>
      <p className="text-xs text-[var(--color-muted)]">
        {es.forms.demoNote}{" "}
        <a className="underline" href={buildMailtoUrl(siteConfig.centralEmail, intro, "")}>
          {es.forms.emailFallback}
        </a>
      </p>
    </form>
  );
}
