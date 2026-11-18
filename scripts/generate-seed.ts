/* Generates demo seed JSON + placeholder SVG images. Run: pnpm tsx scripts/generate-seed.ts
   All data is clearly fictional. Replace images with licensed photos later (docs/CREDITS.md). */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dataDir = join(root, "src/data");
const imgDir = join(root, "public/images");
mkdirSync(dataDir, { recursive: true });
mkdirSync(imgDir, { recursive: true });

const palettes: Record<string, [string, string, string]> = {
  green: ["#cfe3d2", "#5b8a6a", "#2c4a3a"],
  sand: ["#f1e6d0", "#c9a97a", "#6b5a3e"],
  blue: ["#d5e6ee", "#6f9cb3", "#2e4d5c"],
  stone: ["#e4e1da", "#9a968c", "#4a4740"],
};
function svg(label: string, pal: keyof typeof palettes, w = 1600, h = 1000): string {
  const [a, b, c] = palettes[pal];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><path d="M0 ${h * 0.62} L${w * 0.22} ${h * 0.38} L${w * 0.4} ${h * 0.55} L${w * 0.64} ${h * 0.3} L${w} ${h * 0.6} V${h} H0Z" fill="${b}"/><path d="M0 ${h * 0.78} Q${w * 0.3} ${h * 0.62} ${w * 0.6} ${h * 0.8} T${w} ${h * 0.74} V${h} H0Z" fill="${c}"/><text x="${w / 2}" y="${h * 0.14}" text-anchor="middle" font-family="sans-serif" font-size="${h * 0.045}" fill="${c}" opacity=".8">${label} · imagen de demostración</text></svg>`;
}
function img(name: string, label: string, pal: keyof typeof palettes, w?: number, h?: number) {
  writeFileSync(join(imgDir, `${name}.svg`), svg(label, pal, w, h));
  return `/images/${name}.svg`;
}
const write = (f: string, d: unknown) =>
  writeFileSync(join(dataDir, f), JSON.stringify(d, null, 2) + "\n");

// ---------- Zones ----------
const zones = [
  [
    "zona-traslasierra",
    "Traslasierra",
    "traslasierra",
    "Al oeste de las Altas Cumbres: sol, ríos y valles abiertos frente al Champaquí.",
    "green",
    true,
  ],
  [
    "zona-punilla",
    "Valle de Punilla",
    "valle-de-punilla",
    "El corazón turístico de Córdoba: lago San Roque, Cosquín y La Falda.",
    "blue",
    true,
  ],
  [
    "zona-sierras-chicas",
    "Sierras Chicas",
    "sierras-chicas",
    "Pueblos serranos a minutos de la capital, entre arroyos y bosque nativo.",
    "sand",
    true,
  ],
  [
    "zona-capital",
    "Córdoba Capital",
    "cordoba-capital",
    "Departamentos y locales en la ciudad, a un paso de las sierras.",
    "stone",
    true,
  ],
  [
    "zona-calamuchita",
    "Valle de Calamuchita",
    "valle-de-calamuchita",
    "Próximamente.",
    "green",
    false,
  ],
  [
    "zona-paravachasca",
    "Valle de Paravachasca",
    "valle-de-paravachasca",
    "Próximamente.",
    "sand",
    false,
  ],
] as const;
write(
  "zones.json",
  zones.map(([id, name, slug, description, pal, isActive], i) => ({
    id,
    name,
    slug,
    description,
    heroImage: img(`zona-${slug}`, name, pal),
    isActive,
    order: i + 1,
  })),
);

// ---------- Localities ----------
const L = (
  id: string,
  zoneId: string,
  name: string,
  lat: number,
  lng: number,
  shortGuide: string,
) => ({
  id,
  zoneId,
  name,
  slug: name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-"),
  lat,
  lng,
  shortGuide,
});
const localities = [
  L(
    "loc-mina-clavero",
    "zona-traslasierra",
    "Mina Clavero",
    -31.7223,
    -65.0,
    "Capital turística de Traslasierra: ríos, balnearios y vida de pueblo todo el año.",
  ),
  L(
    "loc-nono",
    "zona-traslasierra",
    "Nono",
    -31.7983,
    -64.9744,
    "Pueblo tranquilo sobre el río Los Sauces, ideal para vivir o desconectar.",
  ),
  L(
    "loc-brochero",
    "zona-traslasierra",
    "Villa Cura Brochero",
    -31.705,
    -65.017,
    "Centro de servicios del valle, con comercios, salud y colegios.",
  ),
  L(
    "loc-san-javier",
    "zona-traslasierra",
    "San Javier",
    -32.03,
    -65.03,
    "Miradores, chacras y atardeceres sobre el Champaquí.",
  ),
  L(
    "loc-carlos-paz",
    "zona-punilla",
    "Villa Carlos Paz",
    -31.4241,
    -64.4978,
    "La ciudad más dinámica de las sierras, frente al lago San Roque.",
  ),
  L(
    "loc-cosquin",
    "zona-punilla",
    "Cosquín",
    -31.2458,
    -64.4656,
    "Cuna del folklore, con sierras y río a pocas cuadras del centro.",
  ),
  L(
    "loc-la-falda",
    "zona-punilla",
    "La Falda",
    -31.0911,
    -64.4906,
    "Arquitectura histórica y barrios serranos con vistas abiertas.",
  ),
  L(
    "loc-unquillo",
    "zona-sierras-chicas",
    "Unquillo",
    -31.2306,
    -64.3167,
    "Pueblo de arroyos y artistas, a 30 minutos de la capital.",
  ),
  L(
    "loc-rio-ceballos",
    "zona-sierras-chicas",
    "Río Ceballos",
    -31.165,
    -64.325,
    "Verde, fresco y con excelente conexión a Córdoba.",
  ),
  L(
    "loc-salsipuedes",
    "zona-sierras-chicas",
    "Salsipuedes",
    -31.1856,
    -64.2967,
    "Barrios cerrados y lotes amplios entre bosque nativo.",
  ),
  L(
    "loc-cordoba",
    "zona-capital",
    "Córdoba",
    -31.4201,
    -64.1888,
    "La capital: universidades, comercio y servicios.",
  ),
  L(
    "loc-villa-allende",
    "zona-sierras-chicas",
    "Villa Allende",
    -31.293,
    -64.295,
    "Ciudad residencial al pie de las sierras.",
  ),
];
write("localities.json", localities);

// ---------- Agents ----------
const agentRows = [
  [
    "agent-central",
    "Corredor central",
    "corredor-central",
    "Red Propiedades Sierras Cordobesas",
    "CPI 0000",
    ["zona-traslasierra", "zona-punilla", "zona-sierras-chicas", "zona-capital"],
    "Corredor matriculado que coordina la red de aliados y deriva cada consulta al corredor de la zona.",
  ],
  [
    "agent-mina-clavero",
    "Corredor aliado – Mina Clavero",
    "corredor-aliado-mina-clavero",
    "Inmobiliaria Traslasierra (demo)",
    "CPI 0001",
    ["zona-traslasierra"],
    "Aliado de la red en Traslasierra. Conoce cada rincón del valle.",
  ],
  [
    "agent-carlos-paz",
    "Corredor aliado – Villa Carlos Paz",
    "corredor-aliado-villa-carlos-paz",
    "Punilla Propiedades (demo)",
    "CPI 0002",
    ["zona-punilla"],
    "Aliado de la red en Punilla. Especialista en lotes con vista al lago.",
  ],
  [
    "agent-sierras-chicas",
    "Lucía Ferreyra (ficticia)",
    "lucia-ferreyra",
    "Sierras Chicas Hogar (demo)",
    "CPI 0003",
    ["zona-sierras-chicas"],
    "Corredora ficticia para la demo, enfocada en Unquillo y Río Ceballos.",
  ],
  [
    "agent-capital",
    "Martín Acosta (ficticio)",
    "martin-acosta",
    "Capital Urbana (demo)",
    "CPI 0004",
    ["zona-capital"],
    "Corredor ficticio para la demo, enfocado en departamentos y locales de la capital.",
  ],
] as const;
write(
  "agents.json",
  agentRows.map(([id, name, slug, agencyName, licenseNumber, zoneIds, bio]) => ({
    id,
    name,
    slug,
    photo: img(`agente-${slug}`, name, "stone", 600, 600),
    licenseNumber,
    agencyName,
    agencyLogo: img(`agencia-${slug}`, agencyName, "green", 600, 300),
    zoneIds,
    bio,
    isActive: true,
  })),
);

// ---------- Properties ----------
type P = Record<string, unknown>;
const loc = (id: string) => localities.find((l) => l.id === id)!;
const pals = ["green", "sand", "blue", "stone"] as const;
const dayAgo = (n: number) => new Date(Date.UTC(2026, 10, 10 - n)).toISOString().slice(0, 10);

function prop(
  i: number,
  o: P & {
    slug: string;
    title: string;
    type: string;
    localityId: string;
    agentId: string;
    amountUsd: number;
    description: string;
  },
): P {
  const l = loc(o.localityId);
  const pal = pals[i % pals.length];
  const rich = !!o.rich;
  const imgs = Array.from({ length: rich ? 5 : 2 }, (_, k) => ({
    src: img(`${o.slug}-${k + 1}`, `${o.title}`, pal),
    alt: `${o.title}, vista ${k + 1}`,
    ...(k === 0 ? { cover: true } : {}),
  }));
  const { rich: _r, ...rest } = o as P;
  void _r;
  const base: P = {
    id: `prop-${String(i).padStart(2, "0")}`,
    operation: "VENTA",
    status: "DISPONIBLE",
    featured: false,
    publishedAt: dayAgo(i * 3),
    showPrice: true,
    acceptsSwap: false,
    financing: false,
    creditEligible: false,
    coveredM2: null,
    landM2: null,
    hectares: null,
    bedrooms: null,
    bathrooms: null,
    garage: null,
    waterSource: "RED",
    electricity: true,
    gas: false,
    internet: true,
    roadAccess: "ASFALTO",
    kmToTown: 2,
    kmToCordoba: 150,
    mountainView: true,
    nearRiver: false,
    slope: "SUAVE",
    titleStatus: "ESCRITURA",
    address: `Cerca del centro de ${l.name}`,
    lat: l.lat + (i % 5) * 0.004,
    lng: l.lng - (i % 4) * 0.004,
    images: imgs,
    panoramas: [],
    droneImages: [],
    floorPlanImages: [],
    nearby: [],
  };
  return { ...base, ...rest };
}
function poly(lat: number, lng: number, dLat = 0.0009, dLng = 0.0011): P {
  return {
    type: "Polygon",
    coordinates: [
      [
        [lng, lat],
        [lng + dLng, lat + 0.0001],
        [lng + dLng * 0.9, lat + dLat],
        [lng - dLng * 0.1, lat + dLat * 0.9],
        [lng, lat],
      ],
    ],
  };
}
const nearbyFor = (n: string): P[] => [
  { type: "ESCUELA", name: `Escuela primaria de ${n}`, km: 1.6 },
  { type: "SALUD", name: `Dispensario de ${n}`, km: 2.1 },
  { type: "COMERCIO", name: "Supermercado", km: 1.8 },
  { type: "RIO", name: "Acceso al río", km: 0.9 },
  { type: "CENTRO", name: `Centro de ${n}`, km: 2.4 },
];

const nono = loc("loc-nono");
const cp = loc("loc-carlos-paz");
const heroNonoLat = nono.lat + 0.006,
  heroNonoLng = nono.lng - 0.008;
const heroCpLat = cp.lat + 0.012,
  heroCpLng = cp.lng - 0.03;

const heroNono = prop(1, {
  slug: "casa-con-vista-al-champaqui-en-nono",
  title: "Casa con vista al Champaquí en Nono",
  type: "CASA",
  localityId: "loc-nono",
  agentId: "agent-mina-clavero",
  amountUsd: 285000,
  rich: true,
  featured: true,
  description:
    "Casa de piedra y madera sobre un lote de 1.800 m² con galería, parrilla y vista abierta al Champaquí. Tres dormitorios, living con estufa a leña y cocina integrada. A pasos del río Los Sauces y a 5 minutos del centro de Nono.",
  coveredM2: 165,
  landM2: 1800,
  bedrooms: 3,
  bathrooms: 2,
  garage: 2,
  gas: false,
  waterSource: "VERTIENTE",
  kmToTown: 1.5,
  kmToCordoba: 165,
  nearRiver: true,
  slope: "SUAVE",
  creditEligible: true,
  acceptsSwap: true,
  financing: true,
  lat: heroNonoLat,
  lng: heroNonoLng,
  address: "Camino a Los Sauces, Nono",
  orientationDeg: 70,
  lotPolygon: poly(heroNonoLat, heroNonoLng, 0.0004, 0.0005),
  panoramas: [
    {
      src: img("nono-pano-living", "Living", "sand", 2000, 1000),
      title: "Living",
      hotspots: [{ pitch: -5, yaw: 90, text: "Ir a la galería", targetIndex: 1 }],
    },
    {
      src: img("nono-pano-galeria", "Galería", "green", 2000, 1000),
      title: "Galería",
      hotspots: [{ pitch: -5, yaw: -90, text: "Volver al living", targetIndex: 0 }],
    },
  ],
  tourEmbedUrl: "https://my.matterport.com/show/?m=SxQL3iGyoDo",
  videoId: "aqz-KE-bpKQ",
  droneVideoId: "aqz-KE-bpKQ",
  accessRoadVideoId: "aqz-KE-bpKQ",
  droneImages: [1, 2].map((k) => ({
    src: img(`nono-drone-${k}`, "Vista aérea", "blue"),
    alt: `Vista aérea del lote en Nono ${k}`,
  })),
  floorPlanImages: [
    {
      src: img("nono-plano", "Plano", "stone", 1600, 1000),
      alt: "Plano de planta con medidas de la casa en Nono",
    },
  ],
  roadAccess: "RIPIO",
  nearby: nearbyFor("Nono"),
});
const heroCp = prop(2, {
  slug: "lote-con-vista-al-lago-en-villa-carlos-paz",
  title: "Lote con vista al lago en Villa Carlos Paz",
  type: "LOTE",
  localityId: "loc-carlos-paz",
  agentId: "agent-carlos-paz",
  amountUsd: 92000,
  rich: true,
  featured: true,
  description:
    "Lote de 1.050 m² en loma, con vista despejada al lago San Roque y a las sierras. Todos los servicios, escritura inmediata y calle asfaltada. Ideal para construir una casa de fin de semana o para vivir.",
  landM2: 1050,
  bedrooms: null,
  kmToTown: 3.2,
  kmToCordoba: 38,
  nearRiver: false,
  slope: "PRONUNCIADA",
  gas: true,
  creditEligible: false,
  financing: true,
  lat: heroCpLat,
  lng: heroCpLng,
  address: "Barrio Loma Alta, Villa Carlos Paz",
  orientationDeg: 120,
  lotPolygon: poly(heroCpLat, heroCpLng),
  panoramas: [
    {
      src: img("cp-pano-lote", "Vista desde el lote", "blue", 2000, 1000),
      title: "Vista desde el lote",
      hotspots: [],
    },
  ],
  tourEmbedUrl: "https://my.matterport.com/show/?m=SxQL3iGyoDo",
  videoId: "aqz-KE-bpKQ",
  droneVideoId: "aqz-KE-bpKQ",
  accessRoadVideoId: "aqz-KE-bpKQ",
  droneImages: [1, 2].map((k) => ({
    src: img(`cp-drone-${k}`, "Vista aérea", "green"),
    alt: `Vista aérea del lote en Carlos Paz ${k}`,
  })),
  floorPlanImages: [
    {
      src: img("cp-plano", "Plano de mensura", "stone", 1600, 1000),
      alt: "Plano de mensura del lote con medidas",
    },
  ],
  nearby: nearbyFor("Villa Carlos Paz"),
});

const others: P[] = [
  {
    slug: "cabana-entre-arroyos-en-mina-clavero",
    title: "Cabaña entre arroyos en Mina Clavero",
    type: "CABANA",
    localityId: "loc-mina-clavero",
    agentId: "agent-mina-clavero",
    amountUsd: 158000,
    description:
      "Cabaña de dos ambientes con deck, quincho y acceso a un arroyo de aguas claras. Apta renta turística.",
    coveredM2: 78,
    landM2: 900,
    bedrooms: 2,
    bathrooms: 1,
    garage: 1,
    nearRiver: true,
    featured: true,
    financing: true,
    kmToTown: 2.8,
    kmToCordoba: 160,
  },
  {
    slug: "complejo-de-cabanas-en-villa-cura-brochero",
    title: "Complejo de 5 cabañas en Villa Cura Brochero",
    type: "CABANA",
    operation: "EMPRENDIMIENTO",
    localityId: "loc-brochero",
    agentId: "agent-mina-clavero",
    amountUsd: 520000,
    description:
      "Complejo en funcionamiento con cinco cabañas, pileta y recepción. Ocupación alta todo el año.",
    coveredM2: 380,
    landM2: 3200,
    bedrooms: 10,
    bathrooms: 6,
    garage: 6,
    acceptsSwap: true,
    kmToTown: 1.2,
    kmToCordoba: 158,
  },
  {
    slug: "campo-de-20-hectareas-en-san-javier",
    title: "Campo de 20 hectáreas en San Javier",
    type: "CAMPO",
    localityId: "loc-san-javier",
    agentId: "agent-mina-clavero",
    amountUsd: 240000,
    description:
      "Campo serrano con arroyo, monte nativo y vista al Champaquí. Apto para emprendimiento turístico o chacra.",
    hectares: 20,
    landM2: 200000,
    waterSource: "RIO",
    electricity: false,
    internet: false,
    roadAccess: "TIERRA",
    kmToTown: 9,
    kmToCordoba: 190,
    nearRiver: true,
    slope: "PRONUNCIADA",
    titleStatus: "BOLETO",
    acceptsSwap: true,
  },
  {
    slug: "chacra-con-frutales-en-nono",
    title: "Chacra con frutales en Nono",
    type: "CAMPO",
    localityId: "loc-nono",
    agentId: "agent-mina-clavero",
    amountUsd: 130000,
    description: "Chacra de 2 hectáreas con casa antigua, frutales y riego por canal.",
    hectares: 2,
    landM2: 20000,
    coveredM2: 90,
    bedrooms: 2,
    bathrooms: 1,
    waterSource: "VERTIENTE",
    roadAccess: "RIPIO",
    kmToTown: 4,
    kmToCordoba: 168,
    titleStatus: "SUCESION",
  },
  {
    slug: "lote-en-barrio-cerrado-de-nono",
    title: "Lote en barrio cerrado de Nono",
    type: "LOTE",
    localityId: "loc-nono",
    agentId: "agent-mina-clavero",
    amountUsd: 45000,
    description: "Lote de 800 m² en barrio cerrado con seguridad y calles consolidadas.",
    landM2: 800,
    creditEligible: true,
    financing: true,
    gas: true,
    kmToTown: 1.8,
  },
  {
    slug: "casa-de-tres-dormitorios-en-cosquin",
    title: "Casa de tres dormitorios en Cosquín",
    type: "CASA",
    localityId: "loc-cosquin",
    agentId: "agent-carlos-paz",
    amountUsd: 135000,
    description: "Casa luminosa a cuatro cuadras de la plaza, con patio, parrilla y cochera.",
    coveredM2: 140,
    landM2: 420,
    bedrooms: 3,
    bathrooms: 2,
    garage: 1,
    gas: true,
    creditEligible: true,
    mountainView: false,
    kmToTown: 0.5,
    kmToCordoba: 60,
  },
  {
    slug: "hotel-boutique-en-la-falda",
    title: "Hotel boutique en La Falda",
    type: "HOTEL",
    operation: "EMPRENDIMIENTO",
    localityId: "loc-la-falda",
    agentId: "agent-carlos-paz",
    amountUsd: 780000,
    showPrice: false,
    description:
      "Hotel de 14 habitaciones en edificio histórico, con parque y pileta. Funcionando.",
    coveredM2: 900,
    landM2: 2800,
    bedrooms: 14,
    bathrooms: 14,
    garage: 8,
    gas: true,
    acceptsSwap: true,
    kmToTown: 0.4,
    kmToCordoba: 80,
  },
  {
    slug: "departamento-con-balcon-en-villa-carlos-paz",
    title: "Departamento con balcón en Villa Carlos Paz",
    type: "DEPARTAMENTO",
    localityId: "loc-carlos-paz",
    agentId: "agent-carlos-paz",
    amountUsd: 78000,
    description: "Departamento de dos ambientes con balcón al lago, a dos cuadras de la costanera.",
    coveredM2: 52,
    bedrooms: 1,
    bathrooms: 1,
    creditEligible: true,
    gas: true,
    kmToTown: 0.3,
    kmToCordoba: 36,
    status: "RESERVADA",
  },
  {
    slug: "lote-en-unquillo-con-arroyo",
    title: "Lote en Unquillo con arroyo",
    type: "LOTE",
    localityId: "loc-unquillo",
    agentId: "agent-sierras-chicas",
    amountUsd: 38000,
    description: "Lote de 1.200 m² con frente a arroyo y bosque nativo.",
    landM2: 1200,
    nearRiver: true,
    kmToTown: 1.4,
    kmToCordoba: 28,
    slope: "PLANO",
    financing: true,
  },
  {
    slug: "casa-serrana-en-rio-ceballos",
    title: "Casa serrana en Río Ceballos",
    type: "CASA",
    localityId: "loc-rio-ceballos",
    agentId: "agent-sierras-chicas",
    amountUsd: 210000,
    featured: true,
    description:
      "Casa de dos plantas con pileta y quincho, rodeada de verde y a 40 minutos de Córdoba.",
    coveredM2: 190,
    landM2: 1100,
    bedrooms: 4,
    bathrooms: 3,
    garage: 2,
    gas: true,
    kmToTown: 1.1,
    kmToCordoba: 35,
    creditEligible: true,
  },
  {
    slug: "lote-en-salsipuedes-barrio-abierto",
    title: "Lote en Salsipuedes, barrio abierto",
    type: "LOTE",
    localityId: "loc-salsipuedes",
    agentId: "agent-sierras-chicas",
    amountUsd: 29000,
    description: "Lote de 900 m² a minutos del centro, con luz y agua de red.",
    landM2: 900,
    kmToTown: 2,
    kmToCordoba: 33,
    titleStatus: "POSESION",
  },
  {
    slug: "departamento-en-nueva-cordoba",
    title: "Departamento en Nueva Córdoba",
    type: "DEPARTAMENTO",
    localityId: "loc-cordoba",
    agentId: "agent-capital",
    amountUsd: 98000,
    description: "Departamento de un dormitorio, a pasos de las universidades, con amenities.",
    coveredM2: 45,
    bedrooms: 1,
    bathrooms: 1,
    creditEligible: true,
    gas: true,
    mountainView: false,
    kmToTown: 0,
    kmToCordoba: 0,
    address: "Nueva Córdoba, Córdoba",
  },
  {
    slug: "local-comercial-en-el-centro-de-cordoba",
    title: "Local comercial en el centro de Córdoba",
    type: "LOCAL",
    localityId: "loc-cordoba",
    agentId: "agent-capital",
    amountUsd: 160000,
    description: "Local de 85 m² con vidriera sobre peatonal, ideal gastronomía o indumentaria.",
    coveredM2: 85,
    gas: true,
    mountainView: false,
    kmToTown: 0,
    kmToCordoba: 0,
    address: "Centro, Córdoba",
  },
];
const properties = [heroNono, heroCp, ...others.map((o, k) => prop(k + 3, o as never))];
write("properties.json", properties);
console.log(
  `Seed written: ${zones.length} zones, ${localities.length} localities, ${agentRows.length} agents, ${properties.length} properties`,
);
