import type { NextConfig } from "next";

/* The app lives on its own hostname (farmboard.app today, app.tophand.ag
   once the domain is attached — set APP_URL in Vercel to flip). The landing
   page exposes a stable branded login URL, tophand.ag/login, that redirects
   there. */
const APP_URL = process.env.APP_URL ?? "https://farmboard.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: APP_URL,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
