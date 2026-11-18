import "../src/lib/data"; // throws on invalid seed data
import { agents, localities, properties, zones } from "../src/lib/data";

const zoneIds = new Set(zones.map((z) => z.id));
const locIds = new Set(localities.map((l) => l.id));
const agentIds = new Set(agents.map((a) => a.id));
const errors: string[] = [];
for (const l of localities)
  if (!zoneIds.has(l.zoneId)) errors.push(`locality ${l.id}: unknown zone`);
for (const p of properties) {
  if (!locIds.has(p.localityId)) errors.push(`property ${p.id}: unknown locality`);
  if (!agentIds.has(p.agentId)) errors.push(`property ${p.id}: unknown agent`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Seed data OK");
