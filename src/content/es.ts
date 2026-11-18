// All user-facing strings (es-AR, voseo). v1 can move these into an i18n library.
export const es = {
  brand: { name: "Propiedades Sierras Cordobesas", tagline: "Tu lugar en las sierras de Córdoba" },
  nav: {
    properties: "Propiedades",
    zones: "Zonas",
    brokers: "Corredores",
    valuation: "Tasaciones",
    contact: "Contacto",
  },
  home: {
    heroTitle: "Buscá tu lugar en las sierras",
    heroSubtitle:
      "Casas, lotes y campos en Traslasierra, Punilla, Sierras Chicas y Córdoba Capital.",
    searchCta: "Buscar",
  },
  cta: {
    whatsapp: "Consultá por WhatsApp",
    videoVisit: "Pedir videollamada",
    valuation: "Pedí una tasación",
  },
  demoNote: "Prototipo: este formulario abre WhatsApp con tu mensaje listo para enviar.",
  notFound: { title: "No encontramos esa página", body: "Probá buscando una propiedad." },
} as const;
