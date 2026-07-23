/* Pendo event helper. The Pendo agent isn't installed yet (needs an API key —
   provisioning tracked in Jira); track() is a safe no-op until window.pendo
   exists, so event call sites are correct from day one. */

declare global {
  interface Window {
    pendo?: { track: (event: string, payload?: Record<string, unknown>) => void };
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
