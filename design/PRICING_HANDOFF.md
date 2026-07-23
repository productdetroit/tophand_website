# TopHand `/pricing` — Engineering Handoff

**For:** Claude Code · **Source of truth for design:** `TopHand Pricing.dc.html` (interactive prototype in this project) · **Spec:** [Confluence — TopHand.ag Pricing Page Spec](https://productdetroit.atlassian.net/wiki/spaces/MFS/pages/14155778/TopHand.ag+Pricing+Page+Spec)

This is a **static marketing page**, not the billing system. Prices are display content driven from one config file. Checkout does not exist yet (billing deferred, KAN-107/108/109) — the CTA is a **trial-request** flow, not a payment flow.

---

## 1. Stack & placement

- **Framework:** Next.js on Vercel, same project as the landing page. Static (SSG), no runtime data deps.
- **Route:** `/pricing`. Add "Pricing" to the site header (between the feature links and the primary CTA) and to the footer links. **This is already wired in the prototype landing page** (`TopHand Landing.dc.html`).
- All internal links **relative** so the tophand.ag domain cutover (KAN-121) needs no edits.
- Progressive enhancement: static prices must render with **JS disabled**; only the plan builder's interactivity is enhancement.
- Accessibility floor: WCAG **AA** contrast, toggle + accordion keyboard-operable with ARIA, prices announced with their billing period. 44px+ touch targets. Mobile-first.

---

## 2. Single source of truth — `pricing.config.ts`

Every price on the page renders from this. Changing a number here must update every occurrence (cards, summary, bundle, FAQ). **Never hardcode totals in copy or components.**

```ts
// pricing.config.ts
export type Availability = 'available' | 'coming_soon';

export interface Engine {
  id: 'hay' | 'grazing' | 'maple';
  name: string;
  monthly: number;          // annual is always monthly * 10 (2 months free)
  availability: Availability;
  valueLine: string;
}

export const pricing = {
  core: {
    monthly: 29,            // annual 290
    name: 'TopHand Core',
    kicker: "The farm's coordination system — every hand, every chore, one board.",
    includedCondensed: [
      'Task & chore board + Today feed',
      'Unlimited team members with roles',
      'Satellite parcel mapping with deed parsing',
      'Crop, animal & equipment catalogs',
      'Weather, calendar & events',
      'Notifications: in-app, email & SMS',
    ],
    includedFull: [        // shown under "Everything in Core" expander
      'Region-aware AI crop guidance',
      'Animals & husbandry profiles',
      'Installable offline app',
      'Roles & permissions for the whole crew',
    ],
  },
  complete: {
    monthly: 64,            // annual 640; saves $28/mo vs à la carte at 3 engines
    name: 'TopHand Complete',
  },
  engines: [
    { id: 'hay',     name: 'Hay Engine',     monthly: 25, availability: 'available',
      valueLine: 'Know the window. Cut on time. Keep the quality — and the price it commands.' },
    { id: 'grazing', name: 'Grazing Engine', monthly: 19, availability: 'coming_soon',
      valueLine: 'Rotate on schedule, rest every paddock, break the parasite cycle.' },
    { id: 'maple',   name: 'Maple Engine',   monthly: 19, availability: 'coming_soon',
      valueLine: 'Freeze–thaw is coming. Be tapped, tested, and ready before the first run.' },
  ] as Engine[],
  billing: {
    annualDefault: true,
    annualMultiplier: 10,  // annual price = monthly * 10
  },
  discounts: {
    newFarmerYearOnePct: 50,
  },
} as const;
```

> **Launch prices are proposals within agreed ranges** (Core $29 / Hay $25 / Grazing $19 / Maple $19 / Complete $64) and are an open decision — confirm/adjust in this file before launch. No design changes required to change them.

### Pricing math (derive, never hardcode)
- `annual = monthly * 10` everywhere (2 months free).
- Plan total (monthly) = `core.monthly + Σ(selected engine.monthly)`.
- If **all** engines selected → display `complete.monthly` instead of the à-la-carte sum, with a "bundled — you save $X" note.
- `bundleSavings = core.monthly + Σ(all engine.monthly) − complete.monthly` = **$28** at current numbers.
- Display convention (from prototype): the large figure is always the **monthly sticker** with `/mo`; annual mode adds a `billed annually · $NNN/yr` sub-line where `$NNN = monthly * 10`.

---

## 3. Page anatomy (top → bottom)

| # | Section | Notes |
|---|---------|-------|
| 1 | **Hero** | Field Paper bg, H1 + subhead, billing toggle. Parcel-boundary motif as light texture only. |
| 2 | **Plan builder** (centerpiece) | Core card (always on, ~6 condensed bullets + "Everything in Core" expander) → 3 engine cards with toggle switches → **sticky summary bar** (bottom-fixed on mobile) with live total + primary CTA. |
| 3 | **Complete bundle card** | Survey Green bg, white text, Harvest Gold accent, "$64/mo · save $28/mo vs à la carte", anchor-high option. |
| 4 | **ROI band** | 3 stat callouts, one per engine, sourced (see copy deck). Conservative, no guarantees. |
| 5 | **Comparison strip** | 3 columns, no competitor names/prices: task apps (who, not when) · record-keeping (what happened, not what's next) · TopHand (connects when→who). |
| 6 | **Discounts & programs** | New Farmer 50% yr 1 · nonprofit/educator on request · annual saves 2 months. |
| 7 | **FAQ** | Accordion, 8 items (see §5). |
| 8 | **Final CTA** | Full-width Survey Green band, brand lockup + tagline, trial CTA + "Talk to us". |

---

## 4. Interaction spec

### 4.1 Billing toggle
Segmented Annual/Monthly control, **annual selected by default**, "2 months free" pill on annual. Toggling re-renders every price on the page. State only — no persistence/storage.

### 4.2 Plan builder
- Engine toggles flip selection; total recomputes live from config.
- Grazing & Maple show a **Coming-soon** badge and remain toggleable, with the line: *"Lock launch pricing now; billing starts when your engine ships."*
- When **2+** engines selected (and not all) the summary surfaces: *"Complete gets you every engine for $64/mo — save $28."*
- The selected configuration must be **carried into the trial-request payload**.

### 4.3 CTA behavior — no billing yet
- Primary CTA everywhere: **"Start your 14-day free trial"** — no credit card, no payment step.
- Opens a trial-request form (modal or `/pricing/start`). Fields: **name, email, farm name, state, primary enterprise** (select: Hay/Forage · Dairy goats · Maple · Mixed/Other), **team size**, optional **"I'm a new farmer"** checkbox (applies the discount), plus the **selected plan config** carried from the builder.
- Submits to Product Detroit for **manual provisioning** (email notification and/or simple store).
- Confirmation copy: *"We'll have your farm set up within one business day."*
- Spam protection: **honeypot field + rate limit**, no CAPTCHA.
- When self-serve provisioning ships (KAN-125 / KAN-107–109) the same CTA rewires to signup **without page changes**.

### 4.4 Analytics (Pendo)
Fire with correct payloads:
`pricing_viewed` · `billing_toggled` · `engine_toggled` (engine id + on/off) · `bundle_suggested` · `trial_cta_clicked` (configured plan payload) · `trial_request_submitted`.
Engine-toggle data is the pre-launch willingness-to-pay signal.

---

## 5. Copy deck (editable) & FAQ

**H1:** One price for the farm. Add the engines that make you money.
**Subhead:** TopHand Core runs your whole crew — every hand, every chore, one board. Engines add the timing intelligence for the enterprises you actually run. Unlimited team members on every plan.
**Core kicker:** The farm's coordination system — every hand, every chore, one board.
**Unlimited-seats badge (all cards):** Unlimited team members. Hands are always free.
**Complete line:** Every engine we make — current and future — one price.
**Trial CTA:** Start your 14-day free trial · No credit card. Set up in a day.

**ROI stats (sourced):**
- **Hay** — "Every day past peak costs first-cutting alfalfa ~5 RFV points — about $9/acre/day. One saved cutting covers the Hay Engine for years." (UW-Madison Extension)
- **Grazing** — "Rotation with proper rest breaks the barber pole worm cycle — fewer treatments, healthier does, sustained milk."
- **Maple** — "The best-run sugarbushes pull 0.5+ gal of syrup per tap per year. The difference is catching every run." (UVM Proctor Maple Research Center)

**FAQ (8, required):** What's an engine? · Do you charge per user? (No — unlimited, every plan) · What happens after the 14-day trial? · Can I add/drop engines later? (Yes, anytime; month-to-month adjustable even on annual Core) · What if I don't grow hay/sugar/graze? (Core stands alone) · How does the New Farmer discount work? · Is my data mine? (Yes — export anytime) · When do Grazing and Maple ship? — full answers in the prototype logic (`faqData`).

**Posture rule (hard requirement):** TopHand surfaces and suggests; the farmer makes the call. No guarantee language, no automation-without-consent implications.

---

## 6. Visual design (from the brand system)

| Token | Hex | Use |
|---|---|---|
| Survey Green | `#1F3D2B` | Primary dark — Complete card, final CTA, ink |
| Harvest Gold | `#E0A82E` | Accent + CTA (sparingly). **Never as text on green** (fails AA) — fills/large accents only, never for prices |
| Field Paper | `#F7F4EC` | Light background |
| Charcoal Loam | `#26241F` | Body text; **prices set large in Charcoal Loam** |
| Clear Sky | `#7FA8C9` | Secondary accent (condition/info moments) |
| Barn Red | `#8C3B2E` | Rare emphasis only — **do not use for prices** |

- **Type:** slab-serif headings (**Besley**); humanist sans body (**Public Sans**); mono for data/prices context (**IBM Plex Mono**). Sentence case; caps only for tiny eyebrow labels.
- **Brand mark** in the header; the full lockup (mark + white wordmark + tagline) only in the final CTA band. Mark/icon system already implemented in the prototype (`brandMark` / `domIcon`) and documented in `TopHand Brand Guide.dc.html` — ship the icon set as shared SVGs used by both site and app.
- Mobile-first: cards stack, summary bar pins to bottom, toggles thumb-sized.

---

## 7. Technical implementation

- **SSG** page in the existing Next.js site; no runtime data dependencies.
- Components render **entirely from `pricing.config.ts`** (clean seam to later hydrate from the entitlements service).
- Trial-request form posts to a **lightweight API route**; deliver via email notification to Product Detroit at minimum (Neon storage optional v1). Honeypot + rate limit; no CAPTCHA.
- **SEO:** title `"Pricing — TopHand · Your digital AI farmhand"`; meta description leading with per-farm pricing + unlimited team members; OG image = brand lockup; `Product`/`Offer` JSON-LD for Core and Complete.
- No login, no cookies beyond analytics.

---

## 8. Acceptance criteria

- [ ] `/pricing` renders statically; every price sourced from `pricing.config.ts` — changing a config number updates every occurrence.
- [ ] Billing toggle defaults to annual and re-renders all prices; annual = 10× monthly everywhere.
- [ ] Plan builder computes totals live, surfaces Complete when 2+ engines selected, and carries the config into the trial-request payload.
- [ ] Grazing & Maple show Coming-soon treatment while remaining toggleable.
- [ ] Trial-request form validates, submits, delivers to Product Detroit, shows the one-business-day confirmation.
- [ ] All six Pendo events fire with correct payloads.
- [ ] WCAG AA contrast + keyboard checks pass; Lighthouse mobile performance ≥ 90.
- [ ] No per-user pricing, no hidden-fee language, no competitor names/prices anywhere.

---

## 9. Out of scope (v1) & open decisions

**Out of scope:** checkout / self-serve payment · in-app plan management · login-gated content · per-seat pricing anywhere.

**Open decisions:** final launch price points (confirm in config) · trial-request storage (email-only vs. Neon) · whether the landing hero is revised to lead with timing intelligence alongside this page shipping.

---

## 10. Using the prototype

`TopHand Pricing.dc.html` is the visual + interaction reference. It implements the full page, the live plan-builder math, billing toggle, bundle surfacing, FAQ accordion, and the trial form with success state (form is visual-only — no POST, no analytics wired; those are your tasks above). Lift exact hex values, spacing, copy, and the icon SVGs from it and the brand guide rather than re-deriving them.
