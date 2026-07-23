"use client";

import { useEffect, useState, type CSSProperties } from "react";

/* Animated phone mockup: the three condition gates check in one by one,
   the cut window opens, then a task lands on the crew board. Respects
   prefers-reduced-motion by jumping straight to the final frame. */

const MARKS = [400, 950, 1500, 2200, 3000];

function reveal(on: boolean, hiddenTransform = "translateY(8px)"): CSSProperties {
  return {
    opacity: on ? 1 : 0,
    transform: on ? "translate(0,0)" : hiddenTransform,
    transition: "opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1)",
  };
}

function Gate({ label, on }: { label: string; on: boolean }) {
  return (
    <div style={reveal(on)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "#fff",
          border: "1px solid rgba(31,61,43,.1)",
          borderRadius: 10,
          padding: "9px 11px",
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--green)",
            color: "var(--gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            flex: "none",
          }}
        >
          ✓
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function HeroPhone() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(5);
      return;
    }
    const timers = MARKS.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      role="img"
      aria-label="TopHand reconciles field conditions, opens a cut window, and assigns a task to the crew"
      style={{
        position: "relative",
        width: 300,
        height: 610,
        background: "#1a1712",
        borderRadius: 44,
        padding: 11,
        boxShadow:
          "0 30px 60px -20px rgba(31,61,43,.5), 0 0 0 2px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 11,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 26,
          background: "#1a1712",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          zIndex: 5,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 34,
          overflow: "hidden",
          background: "var(--paper)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ background: "var(--green)", padding: "44px 18px 14px", color: "var(--paper)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 16, color: "#fff" }}>
              TopHand
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--gold)" }}>
              Thu · 6:12a
            </span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px 15px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(31,61,43,.12)",
              borderRadius: 14,
              padding: "13px 14px",
              boxShadow: "0 1px 2px rgba(31,61,43,.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--green)" }}>North hayfield</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>12.4 ac</span>
            </div>
            <p style={{ margin: "5px 0 0", fontSize: 11.5, color: "var(--muted)" }}>
              Second cutting · orchardgrass
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                margin: "0 0 1px",
                fontFamily: "var(--mono)",
                fontSize: 9.5,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--muted-2)",
              }}
            >
              Conditions
            </p>
            <Gate label="maturity" on={step >= 1} />
            <Gate label="weather: 3 dry days" on={step >= 2} />
            <Gate label="moisture" on={step >= 3} />
          </div>

          <div style={reveal(step >= 4, "translateY(12px)")}>
            <div
              style={{
                background: "var(--green)",
                borderRadius: 14,
                padding: "13px 14px",
                color: "var(--paper)",
                boxShadow: "0 8px 20px -8px rgba(31,61,43,.6)",
              }}
            >
              <p
                style={{
                  margin: "0 0 3px",
                  fontFamily: "var(--mono)",
                  fontSize: 9.5,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--sky)",
                }}
              >
                Window open
              </p>
              <p style={{ margin: 0, fontFamily: "var(--serif)", fontWeight: 600, fontSize: 19, color: "#fff" }}>
                Cut window: Thu–Sat
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 11, color: "rgba(247,244,236,.8)" }}>
                Suggested — you make the call.
              </p>
            </div>
          </div>

          <div style={reveal(step >= 5, "translateX(18px)")}>
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(31,61,43,.12)",
                borderLeft: "3px solid var(--gold)",
                borderRadius: 11,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 4px 12px -6px rgba(31,61,43,.35)",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--sky)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flex: "none",
                }}
              >
                RJ
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--green)" }}>
                  Cut North hayfield
                </p>
                <p style={{ margin: "1px 0 0", fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>
                  assigned · due Thu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
