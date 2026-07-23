import type { Metadata } from "next";
import PricingView from "@/components/pricing/PricingView";
import { pricing, annualOf, bundleSavings } from "@/lib/pricing.config";

export const metadata: Metadata = {
  title: "Pricing — TopHand · Your digital AI farmhand",
  description: `One per-farm price — TopHand Core at $${pricing.core.monthly}/mo with unlimited team members, plus modular engines for hay, grazing, and maple. Complete bundle saves $${bundleSavings}/mo. 14-day free trial, no credit card.`,
  openGraph: {
    title: "Pricing — TopHand · Your digital AI farmhand",
    description: `One price for the farm. Add the engines that make you money. Unlimited team members on every plan — from $${pricing.core.monthly}/mo.`,
    siteName: "TopHand",
    type: "website",
  },
};

/* Product/Offer structured data for Core and Complete, derived from the
   pricing config so it can never drift from the visible prices. */
function jsonLd() {
  const product = (name: string, description: string, monthly: number) => ({
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Brand", name: "TopHand" },
    offers: [
      {
        "@type": "Offer",
        price: monthly,
        priceCurrency: "USD",
        description: `$${monthly} per month, billed monthly`,
      },
      {
        "@type": "Offer",
        price: annualOf(monthly),
        priceCurrency: "USD",
        description: `$${annualOf(monthly)} per year, billed annually (2 months free)`,
      },
    ],
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      product(
        pricing.core.name,
        "The farm's coordination system — task board, crew roles, parcel mapping, catalogs, weather, and notifications. Unlimited team members.",
        pricing.core.monthly,
      ),
      product(
        pricing.complete.name,
        "TopHand Core plus every engine — current and future — at one price. Unlimited team members.",
        pricing.complete.monthly,
      ),
    ],
  };
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <PricingView />
    </>
  );
}
