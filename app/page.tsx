import type { CSSProperties } from "react";
import BrandMark from "@/components/BrandMark";
import HeroPhone from "@/components/HeroPhone";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TrialForm from "@/components/TrialForm";
import { platTexture } from "@/components/texture";

const LOGIN_URL = "/login";

const serif: CSSProperties = { fontFamily: "var(--serif)" };
const mono: CSSProperties = { fontFamily: "var(--mono)" };

/* ---------- placeholder product shots (swap for real screenshots later) ---------- */

function ShotChip({ label, done = true }: { label: string; done?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#fff",
        border: "1px solid rgba(31,61,43,.1)",
        borderRadius: 9,
        padding: "7px 10px",
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: done ? "var(--green)" : "rgba(31,61,43,.14)",
          color: "var(--gold)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          flex: "none",
        }}
      >
        {done ? "✓" : ""}
      </span>
      <span style={{ ...mono, fontSize: 11.5, color: "var(--ink)" }}>{label}</span>
    </div>
  );
}

function ShotConditions() {
  return (
    <div className="shot" aria-label="Product UI — per-field conditions view">
      <div className="shot-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--green)" }}>North hayfield</span>
        <span style={{ ...mono, fontSize: 10.5, color: "var(--muted)" }}>12.4 ac · 2nd cutting</span>
      </div>
      <p style={{ ...mono, margin: "4px 0 0", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted-2)" }}>
        Conditions
      </p>
      <ShotChip label="maturity — boot stage" />
      <ShotChip label="weather — 3 dry days ahead" />
      <ShotChip label="moisture — drying by Thu" done={false} />
    </div>
  );
}

function ShotConfirm() {
  return (
    <div className="shot" style={{ justifyContent: "center" }} aria-label="Product UI — confirm a suggested window">
      <div
        style={{
          background: "var(--green)",
          borderRadius: 12,
          padding: "14px 15px",
          color: "var(--paper)",
          boxShadow: "0 8px 20px -8px rgba(31,61,43,.6)",
        }}
      >
        <p style={{ ...mono, margin: "0 0 3px", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sky)" }}>
          Window open
        </p>
        <p style={{ ...serif, margin: 0, fontWeight: 600, fontSize: 18, color: "#fff" }}>Cut window: Thu–Sat</p>
        <p style={{ margin: "5px 0 0", fontSize: 10.5, color: "rgba(247,244,236,.8)" }}>
          3 dry days · moisture in range by Thu morning
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            background: "var(--gold)",
            color: "var(--green)",
            fontWeight: 700,
            fontSize: 12.5,
            padding: "9px 0",
            borderRadius: 9,
          }}
        >
          Confirm cut
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            background: "#fff",
            border: "1px solid rgba(31,61,43,.2)",
            color: "var(--green)",
            fontWeight: 600,
            fontSize: 12.5,
            padding: "9px 0",
            borderRadius: 9,
          }}
        >
          Adjust
        </span>
      </div>
    </div>
  );
}

function ShotTask({ initials, color, title, meta }: { initials: string; color: string; title: string; meta: string }) {
  return (
    <div className="shot-card" style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px" }}>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9.5,
          fontWeight: 700,
          flex: "none",
        }}
      >
        {initials}
      </span>
      <div>
        <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: "var(--green)" }}>{title}</p>
        <p style={{ ...mono, margin: "1px 0 0", fontSize: 9, color: "var(--muted)" }}>{meta}</p>
      </div>
    </div>
  );
}

function ShotBoard() {
  return (
    <div className="shot" aria-label="Product UI — shared crew task board">
      <p style={{ ...mono, margin: 0, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted-2)" }}>
        Crew board · Thursday
      </p>
      <ShotTask initials="RJ" color="var(--sky)" title="Cut North hayfield" meta="assigned · due Thu" />
      <ShotTask initials="MK" color="var(--rust)" title="Rake after dew lifts" meta="assigned · Fri 10a" />
      <ShotTask initials="RJ" color="var(--sky)" title="Bale + wrap by dusk" meta="queued · Sat" />
    </div>
  );
}

/* ---------- content data (copy from the handoff design) ---------- */

const beats = [
  {
    num: "01",
    title: "It watches the conditions.",
    body: "Live weather, crop maturity, and moisture reconciled per field. When a window opens, you see it — with the reasoning, not a black box.",
    shot: <ShotConditions />,
  },
  {
    num: "02",
    title: "You make the call.",
    body: "TopHand suggests; you confirm. Advisory, never automatic — the decision on your farm is always yours.",
    shot: <ShotConfirm />,
  },
  {
    num: "03",
    title: "The crew gets moving.",
    body: "One confirm spawns assigned tasks on a board the whole team shares — phone-first, works in the barn, texts the people who don’t do email.",
    shot: <ShotBoard />,
  },
];

const knowledge = [
  {
    subject: "Orchardgrass hay",
    tag: "crop",
    source: "USDA + MSU Extension",
    detail: "Cut at boot-to-early-head for your zone. Optimal baling moisture flagged before you drive out.",
  },
  {
    subject: "Alpine dairy goat",
    tag: "animal",
    source: "extension husbandry",
    detail: "Kidding intervals, hoof-trim cadence, and vaccination windows for the breed you actually keep.",
  },
  {
    subject: "Round baler",
    tag: "machine",
    source: "OEM schedule",
    detail: "Belt and bearing service by hours; a pre-season checklist before the first cutting.",
  },
];

const engines = [
  {
    status: "Live today",
    name: "Hay engine",
    live: true,
    desc: "Cut-window reconciliation, moisture calls, and baling tasks — running now.",
  },
  {
    status: "Next",
    name: "Grazing rotation",
    live: false,
    desc: "Paddock moves, rest-period tracking, and regrowth cues for managed grazing.",
  },
  {
    status: "Next",
    name: "Maple sugaring",
    live: false,
    desc: "Sap-run forecasting on the freeze–thaw swing, and tap-to-boil timing.",
  },
];

/* ---------- page ---------- */

export default function Home() {
  return (
    <div>
      <SiteHeader />

      <a id="top" />

      {/* hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="th-texture" style={{ backgroundImage: platTexture }} />
        <div className="th-hero">
          <div>
            <p style={{ ...mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rust)", margin: "0 0 22px", fontWeight: 500 }}>
              TopHand · The farm&rsquo;s most knowledgeable hand
            </p>
            <h1 className="th-h1">The farmer makes the calls.</h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--body)", maxWidth: 520, margin: "0 0 32px", textWrap: "pretty" }}>
              TopHand is your digital farm hand — powered by AI, grounded in your experience. It pairs
              your knowledge with best practices and a timely nudge when conditions line up, so nothing
              slips and no window is missed.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
              <a href="#trial" className="btn-gold th-hero-cta" style={{ display: "inline-block" }}>
                Start your free trial
              </a>
              <a href="#how" style={{ fontSize: 16, fontWeight: 600, color: "var(--green)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                See how it works <span style={mono}>→</span>
              </a>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* two kinds of work */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--line-soft)" }}>
        <div className="wrap" style={{ padding: "76px 24px" }}>
          <h2 className="h2" style={{ marginBottom: 48 }}>
            Every farm runs two kinds of work at once.
          </h2>
          <div className="th-2col" style={{ gap: 40 }}>
            <div style={{ borderTop: "3px solid var(--gold)", paddingTop: 22 }}>
              <h3 style={{ ...serif, fontWeight: 600, fontSize: 24, color: "var(--green)", margin: "0 0 12px" }}>
                The work the weather decides.
              </h3>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--body)", margin: 0, textWrap: "pretty" }}>
                Hay cutting, sap runs, grazing moves, harvest. The window is narrow and missing it costs
                real money — a rained-on cutting, over-mature forage that sells for less.
              </p>
            </div>
            <div style={{ borderTop: "3px solid var(--sky)", paddingTop: 22 }}>
              <h3 style={{ ...serif, fontWeight: 600, fontSize: 24, color: "var(--green)", margin: "0 0 12px" }}>
                The work that never stops.
              </h3>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--body)", margin: 0, textWrap: "pretty" }}>
                Fix the fence, order feed, service the baler. Spread across people who need to know what
                to do and when.
              </p>
            </div>
          </div>
          <p style={{ ...serif, margin: "44px 0 0", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(19px,2.2vw,24px)", lineHeight: 1.4, color: "var(--ink)", maxWidth: 760, textWrap: "pretty" }}>
            Task apps can&rsquo;t read a hayfield. Farm record-books don&rsquo;t run a crew. Nothing holds
            both — so it all lives in your head.{" "}
            <span style={{ color: "var(--green)", fontStyle: "normal", fontWeight: 700 }}>TopHand holds both.</span>
          </p>
        </div>
      </section>

      {/* how it works */}
      <a id="how" />
      <section style={{ background: "var(--paper)" }}>
        <div className="wrap" style={{ padding: "80px 24px" }}>
          <p className="eyebrow">How TopHand works</p>
          <h2 className="h2" style={{ marginBottom: 56 }}>
            Conditions in. Your call. Crew moving.
          </h2>
          {beats.map((beat) => (
            <div key={beat.num} className="th-beat">
              <span style={{ ...mono, fontSize: 34, fontWeight: 500, color: "var(--gold)" }}>{beat.num}</span>
              <div>
                <h3 style={{ ...serif, fontWeight: 600, fontSize: 25, color: "var(--green)", margin: "0 0 10px" }}>
                  {beat.title}
                </h3>
                <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "var(--body)", margin: 0, textWrap: "pretty" }}>
                  {beat.body}
                </p>
              </div>
              <div
                className="th-beat-shot"
                style={{
                  aspectRatio: "16/11",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  boxShadow: "0 12px 28px -18px rgba(31,61,43,.5)",
                }}
              >
                {beat.shot}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* grounded knowledge */}
      <section style={{ background: "var(--green)", color: "var(--paper)" }}>
        <div className="wrap th-2col" style={{ padding: "82px 24px", gap: 56, alignItems: "center" }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--gold)", marginBottom: 16 }}>
              Grounded knowledge
            </p>
            <h2 className="h2" style={{ color: "#fff", fontSize: "clamp(30px,3.6vw,40px)", lineHeight: 1.1, marginBottom: 20 }}>
              A hand who&rsquo;s done their homework.
            </h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.6, color: "rgba(247,244,236,.88)", margin: "0 0 22px", textWrap: "pretty" }}>
              Add a crop, an animal, or a machine and TopHand fills in the knowledge to manage, market,
              and sell it — planting windows for <em>your</em> zone, husbandry norms for <em>your</em>{" "}
              breed, maintenance schedules for <em>your</em> baler. Grounded in USDA and extension
              sources, cited, and always yours to edit.
            </p>
            <p style={{ ...mono, fontSize: 12.5, lineHeight: 1.5, color: "var(--sky)", margin: 0 }}>
              TopHand&rsquo;s guidance is advisory and editable.
              <br />
              It warns; it never blocks.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {knowledge.map((k) => (
              <div
                key={k.subject}
                style={{
                  background: "rgba(247,244,236,.06)",
                  border: "1px solid rgba(247,244,236,.14)",
                  borderRadius: 13,
                  padding: "15px 17px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 15.5, color: "#fff" }}>{k.subject}</span>
                  <span style={{ ...mono, fontSize: 11, color: "var(--gold)" }}>{k.tag}</span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(247,244,236,.72)" }}>{k.detail}</p>
                <p style={{ ...mono, margin: "8px 0 0", fontSize: 10, color: "var(--sky)" }}>source · {k.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* story */}
      <a id="story" />
      <section style={{ position: "relative", background: "var(--paper)", overflow: "hidden" }}>
        <div className="th-texture" style={{ backgroundImage: platTexture, backgroundSize: "300px 300px" }} />
        <div className="wrap th-story" style={{ position: "relative", padding: "82px 24px", gap: 52, alignItems: "center" }}>
          <div
            style={{
              aspectRatio: "4/5",
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid var(--line)",
              boxShadow: "0 24px 50px -26px rgba(31,61,43,.55)",
              background: "linear-gradient(160deg, #2a5039 0%, var(--green) 60%, #16301f 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              position: "relative",
            }}
          >
            {/* placeholder until a real GoatLife Farm photo is dropped in */}
            <div className="th-texture" style={{ backgroundImage: platTexture, opacity: 0.12, backgroundSize: "300px 300px" }} />
            <BrandMark size={96} bg="dark" />
            <p style={{ ...mono, margin: 0, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(247,244,236,.85)", textAlign: "center" }}>
              GoatLife Farm
              <br />
              Lapeer, Michigan
            </p>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 16 }}>
              Built on a working farm
            </p>
            <h2 className="h2" style={{ marginBottom: 20 }}>
              Born in the barn, not the boardroom.
            </h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.62, color: "var(--body)", margin: "0 0 26px", textWrap: "pretty" }}>
              TopHand runs the daily work of a real dairy-goat operation — GoatLife Farm in Lapeer,
              Michigan, the founder&rsquo;s own. Every feature earned its place by surviving an actual
              season. If it didn&rsquo;t hold up at 5 a.m. in the milking parlor, it didn&rsquo;t ship.
            </p>
          </div>
        </div>
      </section>

      {/* engines */}
      <a id="engines" />
      <section style={{ background: "#fff", borderTop: "1px solid var(--line-soft)" }}>
        <div className="wrap" style={{ padding: "80px 24px" }}>
          <p className="eyebrow">Engines for your enterprises</p>
          <h2 className="h2" style={{ marginBottom: 14 }}>
            Start with what you grow.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--body)", margin: "0 0 44px", maxWidth: 620, textWrap: "pretty" }}>
            Each engine is an add-on, so you subscribe to what your farm actually does. More engines each
            season.
          </p>
          <div className="th-engines">
            {engines.map((eng) => (
              <div
                key={eng.name}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: "26px 22px 24px",
                  background: "var(--paper)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 190,
                }}
              >
                <span
                  style={{
                    ...mono,
                    alignSelf: "flex-start",
                    fontSize: 10.5,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    padding: "5px 10px",
                    borderRadius: 20,
                    background: eng.live ? "var(--green)" : "rgba(31,61,43,.1)",
                    color: eng.live ? "var(--gold)" : "var(--green)",
                  }}
                >
                  {eng.status}
                </span>
                <h3 style={{ ...serif, fontWeight: 600, fontSize: 23, color: "var(--green)", margin: "20px 0 8px" }}>
                  {eng.name}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--body)", margin: 0, textWrap: "pretty" }}>
                  {eng.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* trial CTA */}
      <a id="trial" />
      <section style={{ background: "var(--green)", color: "var(--paper)" }}>
        <div className="th-cta" style={{ maxWidth: 940, margin: "0 auto", padding: "84px 24px", gap: 52, alignItems: "start" }}>
          <div>
            <h2 style={{ ...serif, fontWeight: 700, fontSize: "clamp(32px,4vw,46px)", lineHeight: 1.04, color: "#fff", margin: "0 0 18px", letterSpacing: "-.015em", textWrap: "balance" }}>
              Put a top hand on your crew.
            </h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.6, color: "rgba(247,244,236,.85)", margin: 0, textWrap: "pretty" }}>
              Tell us about your farm and we&rsquo;ll set you up. No credit card, no self-checkout maze —
              a real setup, done for you.
            </p>
            <p style={{ ...mono, margin: "28px 0 0", fontSize: 12.5, lineHeight: 1.6, color: "var(--sky)" }}>
              We&rsquo;ll set up your farm and email
              <br />
              your invite — usually within a day.
            </p>
          </div>
          <div style={{ background: "var(--paper)", borderRadius: 18, padding: "28px 26px", boxShadow: "0 24px 50px -20px rgba(0,0,0,.4)" }}>
            <TrialForm loginUrl={LOGIN_URL} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
