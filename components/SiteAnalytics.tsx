"use client";

/* Pendo agent + GA4 for the marketing site (KAN-137). Production builds only,
   so local dev sessions don't pollute analytics.

   Pendo: the public app ID for tophand.ag ships verbatim in the loader
   snippet on every Pendo install (public by design), so a baked default is
   safe and keeps deploys GitHub-only; NEXT_PUBLIC_PENDO_API_KEY wins when
   set. Visitors are anonymous — there's no auth on the marketing site — and
   the pricing events wired through lib/analytics.ts start flowing as soon as
   the agent loads (the stub queues earlier calls).

   GA4: loads only when NEXT_PUBLIC_GA_MEASUREMENT_ID exists — no key, no
   script, page unaffected. Add the env var to the Vercel project and the tag
   lights up on the next deploy. */

import Script from "next/script";
import { useEffect } from "react";

const PENDO_API_KEY =
  process.env.NEXT_PUBLIC_PENDO_API_KEY ?? "0f8a2d1e-15fa-47cc-b7c7-ee367af22e15";
// GA4 measurement ID for the tophand.ag property (public, ships in the tag
// on every install) — separate from the app's property, which carries its
// own tag on app.tophand.ag. Baked default keeps deploys GitHub-only; the
// env var wins when set.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-B6RE0J3C84";

/* Pendo's install snippet, verbatim: stubs the API so calls queue until the
   agent script arrives, then loads it from their CDN. */
const PENDO_LOADER = `(function(apiKey){
(function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('${PENDO_API_KEY}');`;

function ensurePendo(): void {
  if (document.getElementById("pendo-loader")) return;
  const script = document.createElement("script");
  script.id = "pendo-loader";
  script.textContent = PENDO_LOADER;
  document.head.appendChild(script);
  // Anonymous initialize — Pendo assigns and persists an anonymous visitor id.
  window.pendo?.initialize({});
}

export default function SiteAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    ensurePendo();
  }, []);

  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
