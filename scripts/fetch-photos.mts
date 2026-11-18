/* Dev-time only: fetches CC-licensed photos from Wikimedia Commons for demo slots,
   converts to WebP (cwebp, ≤1600px) and writes src/data/photos.json with credits.
   Run: pnpm tsx scripts/fetch-photos.ts   (requires `cwebp` on PATH) */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UA = "sierras-prototype/0.1 (static real-estate demo)";
const OUT = join(process.cwd(), "public/images/photos");
const MANIFEST = join(process.cwd(), "src/data/photos.json");
const TMP = join(process.cwd(), ".cache/photos");
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

// slot -> exact Commons file title, or a search query (first acceptable result wins).
export const SLOTS: Record<string, { file?: string; q?: string }> = (() => {
  const p = join(process.cwd(), "scripts/photo-slots.json");
  return JSON.parse(readFileSync(p, "utf8"));
})();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const OK_LICENSE = /^(CC0|CC BY(-SA)? [0-9.]+|Public domain)/i;
const BAD_TITLE =
  /(policial|rock|festival|cartel|banner|logo|mapa|map|escudo|museo|maestro|MTN\d|LCCN|panoramio|panor[aá]mica|terminal|ómnibus|aves)/i;

interface Info {
  title: string;
  thumb: string;
  width: number;
  height: number;
  license: string;
  artist: string;
  page: string;
}

async function api(params: Record<string, string>): Promise<Info[]> {
  const sp = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: "1920",
    ...params,
  });
  let text = "";
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${sp}`, {
      headers: { "User-Agent": UA },
    });
    text = await res.text();
    if (res.ok && text.startsWith("{")) break;
    await sleep(5000 * 2 ** attempt);
  }
  const d = JSON.parse(text) as {
    query?: {
      pages?: Record<
        string,
        { title: string; index?: number; imageinfo?: Array<Record<string, unknown>> }
      >;
    };
  };
  const pages = Object.values(d.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return pages
    .filter((p) => p.imageinfo?.length)
    .map((p) => {
      const ii = p.imageinfo![0] as {
        thumburl: string;
        width: number;
        height: number;
        descriptionurl: string;
        extmetadata?: Record<string, { value: string }>;
      };
      const m = ii.extmetadata ?? {};
      return {
        title: p.title,
        thumb: ii.thumburl,
        width: ii.width,
        height: ii.height,
        license: m.LicenseShortName?.value ?? "",
        artist: (m.Artist?.value ?? "Desconocido").replace(/<[^>]+>/g, "").trim(),
        page: ii.descriptionurl,
      };
    });
}

const manifest: Record<
  string,
  { src: string; title: string; author: string; license: string; source: string }
> = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const used = new Set(Object.values(manifest).map((m) => m.title));

for (const [slot, spec] of Object.entries(SLOTS)) {
  if (manifest[slot] && manifest[slot].title === spec.file) continue;
  if (manifest[slot] && !spec.file) continue;
  const candidates = spec.file
    ? await api({ titles: spec.file })
    : await api({ generator: "search", gsrnamespace: "6", gsrlimit: "15", gsrsearch: spec.q! });
  const pick = candidates.find(
    (c) =>
      (spec.file ||
        (!used.has(c.title) &&
          !BAD_TITLE.test(c.title) &&
          c.width >= 1400 &&
          c.width > c.height * 1.2 &&
          c.width < c.height * 2)) &&
      OK_LICENSE.test(c.license) &&
      /\.jpe?g$/i.test(c.title),
  );
  if (!pick) {
    console.warn(`no photo for ${slot}`);
    continue;
  }
  const raw = join(TMP, `${slot}.jpg`);
  let buf: Buffer | null = null;
  for (let attempt = 0; attempt < 5 && !buf; attempt++) {
    const res = await fetch(pick.thumb, { headers: { "User-Agent": UA } });
    if (res.ok && res.headers.get("content-type")?.startsWith("image/"))
      buf = Buffer.from(await res.arrayBuffer());
    else await sleep(5000 * 2 ** attempt);
  }
  if (!buf) {
    console.warn(`download failed for ${slot}`);
    continue;
  }
  writeFileSync(raw, buf);
  execFileSync("cwebp", [
    "-quiet",
    "-q",
    "72",
    "-resize",
    "1600",
    "0",
    raw,
    "-o",
    join(OUT, `${slot}.webp`),
  ]);
  manifest[slot] = {
    src: `/images/photos/${slot}.webp`,
    title: pick.title,
    author: pick.artist,
    license: pick.license,
    source: pick.page,
  };
  used.add(pick.title);
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`${slot}: ${pick.title} (${pick.license})`);
  await sleep(2500);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

// Credits (CC BY / BY-SA require attribution). Also shown on /creditos/.
const lines = Object.entries(manifest)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([slot, m]) =>
      `| ${slot} | [${m.title.replace(/^File:/, "")}](${m.source}) | ${m.author.replace(/\|/g, "/")} | ${m.license} |`,
  );
writeFileSync(
  join(process.cwd(), "docs/CREDITS.md"),
  `# Credits\n\nPhotos from Wikimedia Commons, used under their licenses (shown on /creditos/). Generated by \`scripts/fetch-photos.mts\`. Images are resized to 1600 px WebP; no other changes. Broker portraits, agency logos, panoramas and floor plans are generated placeholder SVGs.\n\n| Slot | File | Author | License |\n|---|---|---|---|\n${lines.join("\n")}\n`,
);
