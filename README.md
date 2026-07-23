# TopHand website

The website used to promote tophand.ag — TopHand, your digital AI farmhand.
Built from the Claude Design handoff (`TopHand landing and logos-handoff.zip`).

## Stack

Next.js (App Router) + TypeScript. No UI framework — the design system is a small
set of CSS custom properties in `app/globals.css` (Field Paper / Survey Green /
Harvest Gold palette; Besley, Public Sans, IBM Plex Mono via `next/font`).

## Trial-request form

`POST /api/trial-request` validates, drops honeypot hits, and emails the request
via Resend from `no-reply@farmboard.app` (domain verified on the shared Resend
account). Env vars — see `.env.example`:

- `RESEND_API_KEY` — send-only key is fine
- `TRIAL_REQUEST_TO` — defaults to joe@productdetroit.com

## Login redirect

All "Log in" links point to `/login`, which redirects to the app's hostname
(`APP_URL`, default `https://farmboard.app`). Once `app.tophand.ag` is attached
to the farmboard Vercel project, set `APP_URL=https://app.tophand.ag` here and
redeploy — tophand.ag/login becomes the branded login URL.

## Placeholders to replace

- The three "how it works" product shots are CSS mockups (`app/page.tsx`) — swap
  for real app screenshots when ready.
- The story-section farm photo is a styled placeholder — drop in a real GoatLife
  Farm photo.

## Compliance docs

`farmboard_privacy_policy.html` and `farmboard_sms_opt_in.png` at the repo root
predate the site and are referenced externally (Twilio verification) — leave
them where they are.

## Dev

```bash
npm install
npm run dev
```
