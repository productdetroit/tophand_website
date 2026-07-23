/* Single source of truth for every price on /pricing. Cards, summary bar,
   bundle card, FAQ copy, and JSON-LD all derive from these numbers — never
   hardcode a total anywhere else. Launch prices are proposals within agreed
   ranges (KAN-129 open decision); adjust here before launch. */

export type Availability = "available" | "coming_soon";

export interface Engine {
  id: "hay" | "grazing" | "maple";
  name: string;
  monthly: number; // annual is always monthly * 10 (2 months free)
  availability: Availability;
  valueLine: string;
}

export const pricing = {
  core: {
    monthly: 29, // annual 290
    name: "TopHand Core",
    kicker: "The farm's coordination system — every hand, every chore, one board.",
    includedCondensed: [
      "Task & chore board + Today feed",
      "Unlimited team members with roles",
      "Satellite parcel mapping with deed parsing",
      "Crop, animal & equipment catalogs",
      "Weather, calendar & events",
      "Notifications: in-app, email & SMS",
    ],
    includedFull: [
      // shown under "Everything in Core" expander
      "Region-aware AI crop guidance",
      "Animals & husbandry profiles",
      "Installable offline app",
      "Roles & permissions for the whole crew",
    ],
  },
  complete: {
    monthly: 64, // annual 640; saves $28/mo vs à la carte at 3 engines
    name: "TopHand Complete",
  },
  engines: [
    {
      id: "hay",
      name: "Hay Engine",
      monthly: 25,
      availability: "available",
      valueLine:
        "Know the window. Cut on time. Keep the quality — and the price it commands.",
    },
    {
      id: "grazing",
      name: "Grazing Engine",
      monthly: 19,
      availability: "coming_soon",
      valueLine: "Rotate on schedule, rest every paddock, break the parasite cycle.",
    },
    {
      id: "maple",
      name: "Maple Engine",
      monthly: 19,
      availability: "coming_soon",
      valueLine:
        "Freeze–thaw is coming. Be tapped, tested, and ready before the first run.",
    },
  ] as Engine[],
  billing: {
    annualDefault: true,
    annualMultiplier: 10, // annual price = monthly * 10
  },
  discounts: {
    newFarmerYearOnePct: 50,
  },
} as const;

export type EngineId = Engine["id"];

/* ---------- derived math (never hardcode these in components or copy) ---------- */

export const annualOf = (monthly: number) =>
  monthly * pricing.billing.annualMultiplier;

export const aLaCarteAll =
  pricing.core.monthly + pricing.engines.reduce((sum, e) => sum + e.monthly, 0);

export const bundleSavings = aLaCarteAll - pricing.complete.monthly;

export function planTotal(selected: EngineId[]): number {
  if (selected.length === pricing.engines.length) return pricing.complete.monthly;
  return (
    pricing.core.monthly +
    pricing.engines
      .filter((e) => selected.includes(e.id))
      .reduce((sum, e) => sum + e.monthly, 0)
  );
}

export function planLabel(selected: EngineId[]): string {
  if (selected.length === pricing.engines.length)
    return "Core + every engine (Complete)";
  if (selected.length === 0) return "Core only";
  return (
    "Core + " +
    pricing.engines
      .filter((e) => selected.includes(e.id))
      .map((e) => e.name.replace(" Engine", ""))
      .join(" + ")
  );
}
