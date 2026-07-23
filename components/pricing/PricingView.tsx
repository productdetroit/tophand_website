"use client";

/* /pricing page body — visual target: design/TopHand Pricing.dc.html.
   Every price derives from lib/pricing.config.ts; behavior per the KAN-129
   handoff (design/PRICING_HANDOFF.md). Client component so the plan builder
   is live, but the initial HTML (annual prices, no engines selected) is
   prerendered and readable with JS disabled. */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BrandMark, { DomainIcon } from "@/components/BrandMark";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { platTexture } from "@/components/texture";
import {
  pricing,
  annualOf,
  bundleSavings,
  planTotal,
  planLabel,
  type EngineId,
} from "@/lib/pricing.config";
import { track } from "@/lib/analytics";
import PricingTrialForm from "./PricingTrialForm";
import type { PlanPayload } from "./plan";

const LOGIN_URL = "/login";

const serif: CSSProperties = { fontFamily: "var(--serif)" };
const mono: CSSProperties = { fontFamily: "var(--mono)" };

const money = (n: number) => `$${n}`;

const ENGINE_ICONS: Record<EngineId, "seed" | "stock" | "weather"> = {
  hay: "seed",
  grazing: "stock",
  maple: "weather",
};

/* Price figure with an accessible announcement of its billing period. */
function Price({
  monthly,
  annual,
  size,
  color = "var(--ink)",
  prefix = "",
  subColor = "var(--muted)",
  align = "right",
}: {
  monthly: number;
  annual: boolean;
  size: number;
  color?: string;
  prefix?: string;
  subColor?: string;
  align?: "left" | "right";
}) {
  const sub = annual ? `billed annually · ${money(annualOf(monthly))}/yr` : "billed monthly";
  const announce = annual
    ? `${money(monthly)} per month, billed annually at ${money(annualOf(monthly))} per year`
    : `${money(monthly)} per month, billed monthly`;
  return (
    <div style={{ textAlign: align }}>
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 2,
          justifyContent: align === "right" ? "flex-end" : "flex-start",
        }}
      >
        <span style={{ ...serif, fontWeight: 700, fontSize: size, color, lineHeight: 1 }}>
          {prefix}
          {money(monthly)}
        </span>
        <span style={{ fontSize: Math.round(size * 0.42), fontWeight: 600, color: subColor }}>/mo</span>
      </div>
      <p aria-hidden="true" style={{ ...mono, margin: "6px 0 0", fontSize: 12, color: subColor }}>
        {sub}
      </p>
      <span className="sr-only">{announce}</span>
    </div>
  );
}

const faqData = [
  {
    q: "What's an engine?",
    a: "Core runs the whole farm — the crew, the chores, the records. An engine adds the timing intelligence for one enterprise: the Hay Engine reconciles maturity, weather, and moisture into a cut window; Grazing plans rotations; Maple forecasts the freeze–thaw runs. You add only the engines for what you actually do.",
  },
  {
    q: "Do you charge per user?",
    a: "Never. Every plan includes unlimited team members with roles — your whole crew and family, at no extra cost. Hands are always free.",
  },
  {
    q: "What happens after the 14-day trial?",
    a: "We reach out before it ends. There's no card on file and nothing auto-charges — you decide whether to continue, and only then do we set up billing.",
  },
  {
    q: "Can I add or drop engines later?",
    a: "Yes, anytime. Engines are month-to-month adjustable even on an annual Core plan — turn one on for the season and off when it's over.",
  },
  {
    q: "What if I don't grow hay, sugar, or graze?",
    a: "Core stands on its own as the farm's coordination system — task board, parcel mapping, catalogs, weather, and notifications. Engines are optional add-ons, not requirements.",
  },
  {
    q: "How does the New Farmer discount work?",
    a: `New farmers get ${pricing.discounts.newFarmerYearOnePct}% off their first year. Check the box on the trial request and we'll apply it when we provision your farm.`,
  },
  {
    q: "Is my data mine?",
    a: "Yes. Your records belong to you and you can export them anytime. TopHand's guidance is advisory and editable — it warns; it never blocks.",
  },
  {
    q: "When do Grazing and Maple ship?",
    a: "Both are in active development, next in line after Hay. You can lock launch pricing now by toggling them on — billing only starts when your engine actually ships.",
  },
];

const roiStats = [
  {
    engine: "Hay Engine",
    source: "UW-Madison Extension",
    stat: "Every day past peak costs first-cutting alfalfa ~5 RFV points — about $9/acre/day. One saved cutting covers the Hay Engine for years.",
  },
  {
    engine: "Grazing Engine",
    source: "extension research",
    stat: "Rotation with proper rest breaks the barber pole worm cycle — fewer treatments, healthier does, sustained milk.",
  },
  {
    engine: "Maple Engine",
    source: "UVM Proctor Maple Research Center",
    stat: "The best-run sugarbushes pull 0.5+ gal of syrup per tap per year. The difference is catching every run.",
  },
];

const programs = [
  {
    title: `New Farmer — ${pricing.discounts.newFarmerYearOnePct}% off year one`,
    body: "Just starting out? Check the box on your trial request and we'll halve your first year.",
  },
  {
    title: "Nonprofit & educator pricing",
    body: "Teaching farms, extension programs, and nonprofits — reach out and we'll take care of you.",
  },
  {
    title: "Annual billing saves 2 months",
    body: "Pay yearly and two months are on us. No hidden fees, ever — the price you see is the price you pay.",
  },
];

export default function PricingView() {
  const [annual, setAnnual] = useState<boolean>(pricing.billing.annualDefault);
  const [selected, setSelected] = useState<EngineId[]>([]);
  const [expandCore, setExpandCore] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const bundleSuggestedFired = useRef(false);

  useEffect(() => {
    track("pricing_viewed");
  }, []);

  const allOn = selected.length === pricing.engines.length;
  const showBundle = selected.length >= 2 && !allOn;
  const totalM = planTotal(selected);
  const label = planLabel(selected);

  useEffect(() => {
    if (showBundle && !bundleSuggestedFired.current) {
      bundleSuggestedFired.current = true;
      track("bundle_suggested", { engines: selected, monthlyTotal: totalM });
    }
  }, [showBundle, selected, totalM]);

  const plan: PlanPayload = {
    engines: selected,
    billing: annual ? "annual" : "monthly",
    monthlyTotal: totalM,
    annualTotal: annualOf(totalM),
    label,
  };

  function setBilling(nextAnnual: boolean) {
    setAnnual(nextAnnual);
    track("billing_toggled", { period: nextAnnual ? "annual" : "monthly" });
  }

  function toggleEngine(id: EngineId) {
    setSelected((prev) => {
      const on = !prev.includes(id);
      track("engine_toggled", { engine: id, on });
      return on ? [...prev, id] : prev.filter((e) => e !== id);
    });
  }

  const ctaClick = () => track("trial_cta_clicked", { ...plan });

  const segBase: CSSProperties = {
    fontFamily: "var(--sans)",
    fontSize: 14,
    fontWeight: 700,
    padding: "9px 16px",
    borderRadius: 9,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    minHeight: 44,
  };

  return (
    <div>
      <SiteHeader active="pricing" />
      <a id="top" />

      {/* hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="th-texture" style={{ backgroundImage: platTexture, opacity: 0.06 }} />
        <div className="th-pricing-hero">
          <div>
            <p style={{ ...mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rust)", margin: "0 0 20px", fontWeight: 500 }}>
              Pricing · One farm, one price
            </p>
            <h1
              style={{
                ...serif,
                fontWeight: 700,
                fontSize: "clamp(34px,4.6vw,54px)",
                lineHeight: 1.04,
                letterSpacing: "-.015em",
                color: "var(--green)",
                margin: "0 0 20px",
                textWrap: "balance",
              }}
            >
              One price for the farm. Add the engines that make you money.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--body)", maxWidth: 560, margin: "0 0 4px", textWrap: "pretty" }}>
              TopHand Core runs your whole crew — every hand, every chore, one board. Engines add the
              timing intelligence for the enterprises you actually run.
            </p>
            <p style={{ ...mono, fontSize: 13, color: "var(--green)", margin: "16px 0 0", fontWeight: 500 }}>
              Unlimited team members on every plan. Hands are always free.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
            <p style={{ ...mono, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted-2)", margin: 0 }}>
              Billing
            </p>
            <div
              role="radiogroup"
              aria-label="Billing period"
              style={{
                display: "inline-flex",
                background: "#fff",
                border: "1px solid rgba(31,61,43,.18)",
                borderRadius: 12,
                padding: 5,
                gap: 4,
                boxShadow: "0 2px 6px -3px rgba(31,61,43,.25)",
              }}
            >
              <button
                type="button"
                role="radio"
                aria-checked={annual}
                onClick={() => setBilling(true)}
                style={{ ...segBase, background: annual ? "var(--green)" : "transparent", color: annual ? "#fff" : "var(--muted)" }}
              >
                Annual{" "}
                <span
                  style={{
                    ...mono,
                    fontSize: 10,
                    background: "var(--gold)",
                    color: "var(--green)",
                    padding: "2px 7px",
                    borderRadius: 20,
                    marginLeft: 6,
                  }}
                >
                  2 months free
                </span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={!annual}
                onClick={() => setBilling(false)}
                style={{ ...segBase, background: annual ? "transparent" : "var(--green)", color: annual ? "var(--muted)" : "#fff" }}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* plan builder */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--line-soft)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 24px 40px" }}>
          {/* Core card */}
          <div style={{ border: "1px solid var(--line)", borderRadius: 18, padding: "30px 30px 26px", background: "var(--paper)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--green)",
                      borderRadius: 9,
                      flex: "none",
                    }}
                  >
                    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
                      <DomainIcon name="farmer" col="#F7F4EC" />
                    </svg>
                  </span>
                  <h2 style={{ ...serif, fontWeight: 700, fontSize: 27, color: "var(--green)", margin: 0 }}>
                    {pricing.core.name}
                  </h2>
                  <span
                    style={{
                      ...mono,
                      fontSize: 10.5,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      background: "var(--green)",
                      color: "var(--gold)",
                      padding: "5px 11px",
                      borderRadius: 20,
                    }}
                  >
                    Always on
                  </span>
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.5, color: "var(--body)", margin: "12px 0 0", maxWidth: 520, textWrap: "pretty" }}>
                  {pricing.core.kicker}
                </p>
              </div>
              <div style={{ flex: "none" }}>
                <Price monthly={pricing.core.monthly} annual={annual} size={46} />
              </div>
            </div>

            <div className="th-core-bullets">
              {pricing.core.includedCondensed.map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 14.5, lineHeight: 1.4, color: "var(--ink)" }}>
                  <span style={{ color: "var(--green)", fontWeight: 700, flex: "none", marginTop: 1 }} aria-hidden="true">
                    ✓
                  </span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              aria-expanded={expandCore}
              aria-controls="core-full-list"
              onClick={() => setExpandCore((v) => !v)}
              style={{
                marginTop: 20,
                background: "none",
                border: "none",
                padding: "10px 0",
                ...mono,
                fontSize: 12,
                color: "var(--green)",
                fontWeight: 600,
                cursor: "pointer",
                borderBottom: "1px solid var(--gold)",
              }}
            >
              {expandCore ? "– Show less" : "+ Everything in Core"}
            </button>
            <div id="core-full-list" style={{ display: expandCore ? "block" : "none" }}>
              <div className="th-core-bullets" style={{ paddingTop: 16, borderTop: "1px dashed rgba(31,61,43,.2)" }}>
                {pricing.core.includedFull.map((c) => (
                  <div key={c} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, lineHeight: 1.4, color: "var(--body)" }}>
                    <span style={{ color: "var(--sky)", flex: "none" }} aria-hidden="true">
                      •
                    </span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* engines divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0 20px" }}>
            <span style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--rust)" }}>
              Add engines
            </span>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Subscribe to what your farm actually does.</span>
          </div>

          {/* engine cards */}
          <div className="th-engines" style={{ gap: 18 }}>
            {pricing.engines.map((eng) => {
              const on = selected.includes(eng.id);
              const available = eng.availability === "available";
              return (
                <div
                  key={eng.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: on ? "2px solid var(--green)" : "1px solid var(--line)",
                    borderRadius: 16,
                    padding: on ? "21px 21px 23px" : 22,
                    background: on ? "#fff" : "var(--paper)",
                    boxShadow: on ? "0 12px 30px -16px rgba(31,61,43,.5)" : "none",
                    transition: "border .15s, box-shadow .2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: on ? "var(--green)" : "rgba(31,61,43,.08)",
                          borderRadius: 8,
                          flex: "none",
                        }}
                      >
                        <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
                          <DomainIcon name={ENGINE_ICONS[eng.id]} col={on ? "#F7F4EC" : "#1F3D2B"} />
                        </svg>
                      </span>
                      <h3 style={{ ...serif, fontWeight: 600, fontSize: 20, color: "var(--green)", margin: 0 }}>
                        {eng.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={`${eng.name}${on ? ", selected" : ", not selected"}`}
                      onClick={() => toggleEngine(eng.id)}
                      className="th-switch"
                      style={{ background: on ? "var(--green)" : "rgba(31,61,43,.22)" }}
                    >
                      <span className="th-switch-knob" style={{ left: on ? 23 : 3 }} />
                    </button>
                  </div>
                  <span
                    style={{
                      ...mono,
                      alignSelf: "flex-start",
                      marginTop: 14,
                      fontSize: 10,
                      letterSpacing: ".07em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: 20,
                      background: available ? "var(--green)" : "rgba(127,168,201,.22)",
                      color: available ? "var(--gold)" : "#3f6d92",
                    }}
                  >
                    {available ? "Live today" : "Coming soon"}
                  </span>
                  <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--body)", margin: "14px 0 0", textWrap: "pretty", flex: 1 }}>
                    {eng.valueLine}
                  </p>
                  <div style={{ marginTop: 18 }}>
                    <Price monthly={eng.monthly} annual={annual} size={30} prefix="+" align="left" />
                  </div>
                  {!available && (
                    <p style={{ margin: "12px 0 0", fontSize: 12, lineHeight: 1.45, color: "var(--rust)", fontStyle: "italic" }}>
                      Lock launch pricing now; billing starts when your engine ships.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* sticky summary bar */}
          <div className="th-summary-wrap">
            <div className="th-summary" aria-live="polite">
              <div>
                <p style={{ ...mono, margin: 0, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sky)" }}>
                  Your farm
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 16.5, color: "var(--paper)", fontWeight: 500 }}>
                  {label} ={" "}
                  <span style={{ ...serif, fontWeight: 700, color: "var(--gold)", fontSize: 20 }}>
                    {money(totalM)}/mo
                  </span>{" "}
                  <span style={{ color: "rgba(247,244,236,.8)", fontSize: 14 }}>
                    {annual ? `billed annually (${money(annualOf(totalM))}/yr)` : "billed monthly"}
                  </span>
                </p>
                {showBundle && (
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--gold)" }}>
                    Complete gets you every engine for {money(pricing.complete.monthly)}/mo — save{" "}
                    {money(bundleSavings)}.
                  </p>
                )}
                {allOn && (
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--gold)" }}>
                    Complete — every engine, save {money(bundleSavings)}/mo. Bundled automatically.
                  </p>
                )}
              </div>
              <a href="#start" onClick={ctaClick} className="btn-gold" style={{ fontSize: 15.5, padding: "13px 22px", borderRadius: 10, boxShadow: "0 2px 0 rgba(0,0,0,.25)", whiteSpace: "nowrap", textAlign: "center" }}>
                Start your 14-day free trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Complete bundle */}
      <section style={{ background: "var(--green)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 24px" }}>
          <div
            style={{
              background: "linear-gradient(180deg,#244831,#1c3627)",
              border: "1px solid rgba(224,168,46,.4)",
              borderRadius: 20,
              padding: "40px 40px 36px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <span
                style={{
                  ...mono,
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  background: "var(--gold)",
                  color: "var(--green)",
                  padding: "5px 12px",
                  borderRadius: 20,
                }}
              >
                Best value
              </span>
              <h2 style={{ ...serif, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", color: "#fff", margin: "18px 0 12px", letterSpacing: "-.01em" }}>
                {pricing.complete.name}
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(247,244,236,.88)", margin: 0, maxWidth: 480, textWrap: "pretty" }}>
                Every engine we make — current and future — one price. When a new engine ships,
                it&rsquo;s already yours.
              </p>
              <p style={{ ...mono, fontSize: 12.5, color: "var(--gold)", margin: "16px 0 0" }}>
                Unlimited team members. Hands are always free.
              </p>
            </div>
            <div style={{ flex: "none" }}>
              <Price
                monthly={pricing.complete.monthly}
                annual={annual}
                size={56}
                color="#fff"
                subColor="rgba(247,244,236,.75)"
              />
              <p style={{ margin: "4px 0 18px", fontSize: 13, color: "var(--gold)", fontWeight: 600, textAlign: "right" }}>
                Save {money(bundleSavings)}/mo vs. à la carte
              </p>
              <a
                href="#start"
                onClick={ctaClick}
                className="btn-gold"
                style={{ fontSize: 15.5, padding: "13px 24px", borderRadius: 10, boxShadow: "0 2px 0 rgba(0,0,0,.3)", display: "inline-block" }}
              >
                Start your 14-day free trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ROI band */}
      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line-soft)" }}>
        <div className="wrap" style={{ padding: "76px 24px" }}>
          <p className="eyebrow">Why engines pay for themselves</p>
          <h2 className="h2" style={{ fontSize: "clamp(28px,3.6vw,40px)", marginBottom: 12 }}>
            The window you miss is the money you leave in the field.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: "var(--muted)", margin: "0 0 44px", maxWidth: 640 }}>
            TopHand surfaces the window and suggests — you make the call. These are industry research
            figures, not promised outcomes.
          </p>
          <div className="th-engines" style={{ gap: 22 }}>
            {roiStats.map((r) => (
              <div
                key={r.engine}
                style={{
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderTop: "3px solid var(--gold)",
                  borderRadius: 16,
                  padding: "26px 24px",
                }}
              >
                <p style={{ ...mono, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--green)", margin: "0 0 14px" }}>
                  {r.engine}
                </p>
                <p style={{ ...serif, fontWeight: 600, fontSize: 19, lineHeight: 1.35, color: "var(--ink)", margin: "0 0 14px", textWrap: "pretty" }}>
                  {r.stat}
                </p>
                <p style={{ ...mono, fontSize: 10.5, color: "var(--muted-2)", margin: 0 }}>source · {r.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* comparison strip */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--line-soft)" }}>
        <div className="wrap" style={{ padding: "72px 24px" }}>
          <h2 className="h2" style={{ fontSize: "clamp(26px,3.2vw,36px)", marginBottom: 40 }}>
            How TopHand is different.
          </h2>
          <div className="th-engines" style={{ gap: 20 }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: 16, padding: "26px 24px", background: "var(--paper)" }}>
              <p style={{ fontSize: 15.5, fontWeight: 600, color: "var(--muted-2)", margin: "0 0 10px" }}>Generic task apps</p>
              <p style={{ ...serif, fontWeight: 500, fontSize: 21, lineHeight: 1.3, color: "var(--muted)", margin: 0, textWrap: "pretty" }}>
                Know who — not when.
              </p>
            </div>
            <div style={{ border: "1px solid var(--line)", borderRadius: 16, padding: "26px 24px", background: "var(--paper)" }}>
              <p style={{ fontSize: 15.5, fontWeight: 600, color: "var(--muted-2)", margin: "0 0 10px" }}>Record-keeping farm software</p>
              <p style={{ ...serif, fontWeight: 500, fontSize: 21, lineHeight: 1.3, color: "var(--muted)", margin: 0, textWrap: "pretty" }}>
                Knows what happened — not what&rsquo;s next.
              </p>
            </div>
            <div style={{ border: "2px solid var(--green)", borderRadius: 16, padding: "25px 23px", background: "var(--green)" }}>
              <p style={{ fontSize: 15.5, fontWeight: 600, color: "var(--gold)", margin: "0 0 10px" }}>TopHand</p>
              <p style={{ ...serif, fontWeight: 500, fontSize: 21, lineHeight: 1.3, color: "#fff", margin: 0, textWrap: "pretty" }}>
                Connects the when to the who.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* discounts & programs */}
      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line-soft)" }}>
        <div className="wrap th-engines" style={{ padding: "64px 24px", gap: 22 }}>
          {programs.map((p) => (
            <div key={p.title} style={{ display: "flex", flexDirection: "column", gap: 8, borderLeft: "3px solid var(--gold)", padding: "4px 0 4px 18px" }}>
              <p style={{ ...serif, fontWeight: 600, fontSize: 19, color: "var(--green)", margin: 0 }}>{p.title}</p>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--body)", margin: 0, textWrap: "pretty" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--line-soft)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", padding: "76px 24px" }}>
          <h2 className="h2" style={{ fontSize: "clamp(28px,3.4vw,38px)", marginBottom: 36 }}>
            Questions, answered plainly.
          </h2>
          <div>
            {faqData.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} style={{ borderTop: "1px solid var(--line)" }}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "20px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ ...serif, fontWeight: 600, fontSize: 18, color: "var(--green)" }}>{f.q}</span>
                    <span
                      aria-hidden="true"
                      style={{
                        ...mono,
                        fontSize: 22,
                        color: "var(--gold)",
                        flex: "none",
                        transition: "transform .2s",
                        transform: open ? "rotate(45deg)" : "rotate(0)",
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div id={`faq-answer-${i}`} hidden={!open}>
                    <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--body)", margin: "0 0 22px", maxWidth: 680, textWrap: "pretty" }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* final CTA + trial form */}
      <a id="start" />
      <section style={{ background: "var(--green)", color: "var(--paper)" }}>
        <div className="th-cta" style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px", gap: 52, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 22 }}>
              <BrandMark size={40} bg="dark" />
              <span style={{ ...serif, fontWeight: 700, fontSize: 22, color: "#fff" }}>TopHand</span>
            </div>
            <h2
              style={{
                ...serif,
                fontWeight: 700,
                fontSize: "clamp(30px,3.8vw,44px)",
                lineHeight: 1.04,
                color: "#fff",
                margin: "0 0 16px",
                letterSpacing: "-.015em",
                textWrap: "balance",
              }}
            >
              Start your 14-day free trial.
            </h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.6, color: "rgba(247,244,236,.85)", margin: "0 0 20px", textWrap: "pretty" }}>
              No credit card. Set up in a day. We provision your farm by hand and email your invite — a
              real setup, done for you.
            </p>
            <div style={{ background: "rgba(247,244,236,.08)", border: "1px solid rgba(247,244,236,.16)", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ ...mono, margin: 0, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--sky)" }}>
                Carrying your plan
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 15, color: "#fff", fontWeight: 500 }}>
                {label} · {money(totalM)}/mo{" "}
                {annual ? `billed annually (${money(annualOf(totalM))}/yr)` : "billed monthly"}
              </p>
            </div>
            <p style={{ margin: "24px 0 0", fontSize: 15, color: "rgba(247,244,236,.8)" }}>
              Questions?{" "}
              <a href="mailto:hello@productdetroit.com" style={{ color: "var(--gold)", fontWeight: 600, borderBottom: "1px solid rgba(224,168,46,.5)" }}>
                Talk to us
              </a>
            </p>
          </div>
          <div style={{ background: "var(--paper)", borderRadius: 18, padding: "28px 26px", boxShadow: "0 24px 50px -20px rgba(0,0,0,.4)" }}>
            <PricingTrialForm loginUrl={LOGIN_URL} plan={plan} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
