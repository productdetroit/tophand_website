import BrandMark from "@/components/BrandMark";

const LOGIN_URL = "/login";

/* Shared sticky header. Nav links are root-relative so they work from any
   route (and survive the tophand.ag domain cutover unchanged). */
export default function SiteHeader({ active }: { active?: "pricing" }) {
  const onPricing = active === "pricing";
  return (
    <header className="th-header">
      <div className="th-header-inner">
        <a href={onPricing ? "/" : "#top"} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BrandMark size={40} bg="light" />
          <span
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 700,
              fontSize: 21,
              color: "var(--green)",
              letterSpacing: "-.01em",
            }}
          >
            TopHand
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <nav className="th-nav-links">
            <a href="/#how">How it works</a>
            <a href="/#engines">Engines</a>
            <a href="/#story">Our story</a>
            <a
              href={onPricing ? "#top" : "/pricing"}
              style={onPricing ? { fontWeight: 700, color: "var(--green)" } : undefined}
              aria-current={onPricing ? "page" : undefined}
            >
              Pricing
            </a>
            <a href={LOGIN_URL} style={{ fontWeight: 600, color: "var(--green)", paddingLeft: 8 }}>
              Log in
            </a>
          </nav>
          <a href={onPricing ? "#start" : "/#trial"} className="th-nav-cta">
            Start free trial
          </a>
        </div>
      </div>
    </header>
  );
}
