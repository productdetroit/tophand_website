import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

/* Shared shell for legal pages (/privacy, /messaging-terms) — site header and
   footer around a narrow document column. Typography leans on the same vars
   as the rest of the site. */
export default function LegalShell({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main>
        <article className="wrap legal-doc" style={{ maxWidth: 760, padding: "140px 24px 80px" }}>
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
            {kicker}
          </p>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 800,
              fontSize: 38,
              lineHeight: 1.12,
              letterSpacing: "-.02em",
              color: "var(--ink)",
              margin: "0 0 10px",
            }}
          >
            {title}
          </h1>
          <p style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(38,36,31,.55)", margin: "0 0 34px" }}>
            Last updated: {updated}
          </p>
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
