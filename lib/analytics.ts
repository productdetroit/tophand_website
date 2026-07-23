/* Pendo event helper. The agent is installed by components/SiteAnalytics.tsx
   (KAN-137, production builds only); track() stays a safe no-op whenever
   window.pendo is absent (dev, or the CDN blocked), so event call sites are
   always safe to hit. */

declare global {
  interface Window {
    pendo?: {
      initialize: (options?: object) => void;
      track: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

export type PricingEvent =
  | "pricing_viewed"
  | "billing_toggled"
  | "engine_toggled"
  | "bundle_suggested"
  | "trial_cta_clicked"
  | "trial_request_submitted";

export function track(event: PricingEvent, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.pendo?.track(event, payload);
  } catch {
    // analytics must never break the page
  }
}
