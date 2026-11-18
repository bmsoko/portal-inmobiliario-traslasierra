import { z } from "zod";
import zonesJson from "@/data/zones.json";
import localitiesJson from "@/data/localities.json";
import agentsJson from "@/data/agents.json";
import propertiesJson from "@/data/properties.json";
import { AgentSchema, LocalitySchema, PropertySchema, ZoneSchema } from "./schemas";

// Validated at import time, so the static build fails on invalid data.
export const zones = z.array(ZoneSchema).parse(zonesJson);
export const localities = z.array(LocalitySchema).parse(localitiesJson);
export const agents = z.array(AgentSchema).parse(agentsJson);
export const properties = z.array(PropertySchema).parse(propertiesJson);
