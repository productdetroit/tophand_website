import type { Metadata } from "next";
import { Besley, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const besley = Besley({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-besley",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-public-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tophand.vercel.app"),
  title: "TopHand — Your digital AI farmhand",
  description:
    "TopHand is your digital farm hand — powered by AI, grounded in your experience. It pairs your knowledge with best practices and a timely nudge when conditions line up, so nothing slips and no window is missed.",
  openGraph: {
    title: "TopHand — Your digital AI farmhand",
    description:
      "The farmer makes the calls. TopHand watches conditions, suggests the window, and gets the crew moving.",
    siteName: "TopHand",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${besley.variable} ${publicSans.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
