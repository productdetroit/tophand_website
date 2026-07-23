import type { EngineId } from "@/lib/pricing.config";

/* The configured plan carried from the builder into analytics events and the
   trial-request payload (spec §4.2/§4.3). */
export interface PlanPayload {
  engines: EngineId[];
  billing: "annual" | "monthly";
  monthlyTotal: number;
  annualTotal: number;
  label: string;
}
