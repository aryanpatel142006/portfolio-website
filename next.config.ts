import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile in the home dir confuses inference).
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Allow first-party SVG placeholders (e.g. the profile photo placeholder).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
    ],
  },
};

export default nextConfig;
