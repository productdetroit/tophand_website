import { NextResponse } from "next/server";

/* Trial-request intake: validates, drops honeypot hits, and forwards the
   request to TRIAL_REQUEST_TO via Resend's REST API (no SDK — plain fetch,
   same pattern as the farmboard app). RESEND_API_KEY is server-side only. */

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "TopHand <no-reply@farmboard.app>";

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

  const name = field("name", 200);
  const email = field("email", 200);
  const farm = field("farm", 200);
  const grows = field("grows", 2000);

  if (!name || !farm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.TRIAL_REQUEST_TO ?? "joe@productdetroit.com";
  if (!key) {
    console.error("[trial-request] RESEND_API_KEY not configured");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const html = `
    <h2>TopHand trial request</h2>
    <table cellpadding="4">
      <tr><td><b>Name</b></td><td>${esc(name)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(email)}</td></tr>
      <tr><td><b>Farm</b></td><td>${esc(farm)}</td></tr>
      <tr><td><b>Grows/raises</b></td><td>${esc(grows) || "—"}</td></tr>
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
      subject: `Trial request — ${farm} (${name})`,
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
