import { NextResponse } from "next/server";

/* Trial-request intake: validates, drops honeypot hits, rate-limits, and
   forwards the request to TRIAL_REQUEST_TO via Resend's REST API (no SDK —
   plain fetch, same pattern as the farmboard app). RESEND_API_KEY is
   server-side only. Serves both the landing form (name/email/farm/grows)
   and the pricing form (state/enterprise/team/newfarmer + plan payload). */

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "TopHand <no-reply@farmboard.app>";

/* Best-effort in-memory rate limit (per warm serverless instance): 5
   submissions per IP per 10 minutes. Paired with the honeypot this is the
   v1 spam posture per the KAN-129 handoff — no CAPTCHA. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude memory cap
  return false;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const field = (k: string, max: number) =>
    typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "";

  // Honeypot filled → bot. Pretend success so it learns nothing.
  if (field("website", 10)) return NextResponse.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  const name = field("name", 200);
  const email = field("email", 200);
  const farm = field("farm", 200);
  const grows = field("grows", 2000);
  const state = field("state", 10).toUpperCase();
  const enterprise = field("enterprise", 100);
  const team = field("team", 10);
  const newFarmer = body.newfarmer === "on" || body.newfarmer === true;

  if (!name || !farm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  /* Plan config carried from the pricing builder (spec §4.2) */
  let planLine = "";
  const plan = body.plan;
  if (plan && typeof plan === "object") {
    const p = plan as Record<string, unknown>;
    const engines = Array.isArray(p.engines)
      ? p.engines.filter((e): e is string => typeof e === "string").slice(0, 10).join(", ")
      : "";
    const label = typeof p.label === "string" ? p.label.slice(0, 200) : "";
    const billing = typeof p.billing === "string" ? p.billing.slice(0, 20) : "";
    const monthly = typeof p.monthlyTotal === "number" ? p.monthlyTotal : null;
    const annualTotal = typeof p.annualTotal === "number" ? p.annualTotal : null;
    planLine =
      `${label || "—"} · ` +
      (monthly !== null ? `$${monthly}/mo` : "—") +
      (billing === "annual" && annualTotal !== null
        ? ` billed annually ($${annualTotal}/yr)`
        : billing
          ? ` billed ${billing}`
          : "") +
      (engines ? ` · engines: ${engines}` : " · no engines selected");
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.TRIAL_REQUEST_TO ?? "joe@productdetroit.com";
  if (!key) {
    console.error("[trial-request] RESEND_API_KEY not configured");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const rows = [
    ["Name", esc(name)],
    ["Email", esc(email)],
    ["Farm", esc(farm)],
    ...(state ? [["State", esc(state)]] : []),
    ...(enterprise ? [["Primary enterprise", esc(enterprise)]] : []),
    ...(team ? [["Team size", esc(team)]] : []),
    ...(planLine ? [["Selected plan", esc(planLine)]] : []),
    ...(plan ? [["New farmer (50% yr 1)", newFarmer ? "YES" : "no"]] : []),
    ...(grows ? [["Grows/raises", esc(grows)]] : []),
  ];

  const html = `
    <h2>TopHand trial request</h2>
    <table cellpadding="4">
      ${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`).join("\n      ")}
    </table>`;

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: email,
      subject: `Trial request — ${farm} (${name})${newFarmer ? " · new farmer" : ""}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    console.error(`[trial-request] Resend ${res.status}: ${detail}`);
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
