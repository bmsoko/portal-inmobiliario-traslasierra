"use client";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { track } from "@/features/analytics/track";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface Props {
  message: string;
  label: string;
  placement: string;
  propertyId?: string;
  agentId?: string;
  className?: string;
}

// Every inquiry goes to the central broker's number (see src/config/site.ts).
export function WhatsAppLink({ message, label, placement, propertyId, agentId, className }: Props) {
  return (
    <a
      href={buildWhatsAppUrl(siteConfig.centralWhatsApp, message)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-link"
      onClick={() =>
        track("whatsapp_click", { placement, property_id: propertyId, agent_id: agentId })
      }
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[var(--color-accent-fg)] transition hover:opacity-90",
        className,
      )}
    >
      <MessageCircle size={18} aria-hidden /> {label}
    </a>
  );
}
