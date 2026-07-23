import BrandMark from "@/components/BrandMark";

const LOGIN_URL = "/login";

/* Shared site footer — identical on every route. */
export default function SiteFooter() {
  return (
    <footer style={{ background: "var(--footer-bg)", color: "rgba(247,244,236,.72)" }}>
      <div className="wrap" style={{ padding: "60px 24px 44px" }}>
        <div
          className="th-2col"
          style={{
            gridTemplateColumns: "1.3fr 1fr",
            gap: 44,
            alignItems: "start",
            borderBottom: "1px solid rgba(247,244,236,.14)",
            paddingBottom: 36,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--gold)",
                margin: "0 0 12px",
              }}
            >
              What&rsquo;s a top hand?
            </p>
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 20,
                lineHeight: 1.45,
                color: "var(--paper)",
                margin: 0,
                maxWidth: 460,
                textWrap: "pretty",
              }}
            >
              The most skilled, most trusted hand on the crew. That&rsquo;s the job we built the
              software to do — TopHand supports, and you make the calls.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <a href="/pricing" style={{ color: "var(--paper)", fontSize: 15, fontWeight: 600 }}>
              Pricing
            </a>
            <a href={LOGIN_URL} style={{ color: "var(--paper)", fontSize: 15, fontWeight: 600 }}>
              Log in
            </a>
            <a href="https://productdetroit.com/privacy" style={{ color: "rgba(247,244,236,.72)", fontSize: 15 }}>
              Privacy
            </a>
            <a href="https://productdetroit.com/messaging-terms" style={{ color: "rgba(247,244,236,.72)", fontSize: 15 }}>
              Messaging terms
            </a>
            <a href="https://productdetroit.com/contact" style={{ color: "rgba(247,244,236,.72)", fontSize: 15 }}>
              Contact
            </a>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 14, paddingTop: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <BrandMark size={34} bg="dark" />
            <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 16, color: "var(--paper)" }}>
              TopHand
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--mono)",
              margin: 0,
              fontSize: 11.5,
              lineHeight: 1.6,
              color: "rgba(247,244,236,.6)",
              textAlign: "right",
            }}
          >
            Made by Product Detroit LLC
            <br />
            Built at GoatLife Farm · Lapeer, Michigan
          </p>
        </div>
      </div>
    </footer>
  );
}
