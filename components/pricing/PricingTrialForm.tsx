"use client";

import { useState, type CSSProperties } from "react";
import { track } from "@/lib/analytics";
import type { PlanPayload } from "./plan";

type Status = "idle" | "sending" | "sent" | "error";

const mono: CSSProperties = { fontFamily: "var(--mono)" };

const ENTERPRISES = ["Hay / Forage", "Dairy goats", "Maple", "Mixed / Other"];

export default function PricingTrialForm({
  loginUrl,
  plan,
}: {
  loginUrl: string;
  plan: PlanPayload;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/trial-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, plan }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      track("trial_request_submitted", { ...plan });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "30px 6px" }} role="status">
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--green)",
            color: "var(--gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            margin: "0 auto 16px",
          }}
        >
          ✓
        </div>
        <h3
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 700,
            fontSize: 23,
            color: "var(--green)",
            margin: "0 0 10px",
          }}
        >
          Request received.
        </h3>
        <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--body)", margin: 0, textWrap: "pretty" }}>
          We&rsquo;ll have your farm set up within one business day and email your invite.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <p
        style={{
          ...mono,
          margin: "0 0 2px",
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--rust)",
        }}
      >
        Request your trial
      </p>
      <div className="th-form-2col">
        <label className="th-label">
          Name
          <input required type="text" name="name" className="th-input" autoComplete="name" />
        </label>
        <label className="th-label">
          Email
          <input required type="email" name="email" className="th-input" autoComplete="email" />
        </label>
      </div>
      <div className="th-form-2col" style={{ gridTemplateColumns: "1.4fr .6fr" }}>
        <label className="th-label">
          Farm name
          <input required type="text" name="farm" className="th-input" autoComplete="organization" />
        </label>
        <label className="th-label">
          State
          <input
            required
            type="text"
            name="state"
            maxLength={2}
            placeholder="MI"
            className="th-input"
            autoComplete="address-level1"
            style={{ textTransform: "uppercase" }}
          />
        </label>
      </div>
      <div className="th-form-2col" style={{ gridTemplateColumns: "1.4fr .6fr" }}>
        <label className="th-label">
          Primary enterprise
          <select name="enterprise" className="th-input">
            {ENTERPRISES.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </label>
        <label className="th-label">
          Team size
          <input type="number" name="team" min={1} placeholder="4" className="th-input" />
        </label>
      </div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          fontSize: 14,
          color: "var(--ink)",
          cursor: "pointer",
          marginTop: 2,
        }}
      >
        <input
          type="checkbox"
          name="newfarmer"
          style={{ width: 17, height: 17, accentColor: "var(--green)" }}
        />
        I&rsquo;m a new farmer — apply my 50% off year one
      </label>
      {/* honeypot — real users never see or fill this */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-gold"
        style={{
          fontSize: 16,
          padding: 14,
          borderRadius: 10,
          boxShadow: "0 2px 0 rgba(31,61,43,.2)",
          marginTop: 4,
          opacity: status === "sending" ? 0.7 : 1,
        }}
      >
        {status === "sending" ? "Sending…" : "Start your 14-day free trial"}
      </button>
      {status === "error" && (
        <p style={{ margin: 0, fontSize: 13, color: "var(--rust)", textAlign: "center" }}>
          Something went wrong — please try again, or email{" "}
          <a href="mailto:joe@productdetroit.com" style={{ fontWeight: 700 }}>
            joe@productdetroit.com
          </a>
          .
        </p>
      )}
      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--muted)", textAlign: "center" }}>
        No credit card. Already have an account?{" "}
        <a href={loginUrl} style={{ fontWeight: 700, borderBottom: "1px solid var(--gold)" }}>
          Log in
        </a>
      </p>
    </form>
  );
}
