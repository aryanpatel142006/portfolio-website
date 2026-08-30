import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile in the home dir confuses inference).
  turbopack: {
    root: import.meta.dirname,
  },
  // First-party proxy for PostHog (US cloud) so ad blockers don't swallow
  // analytics. PostHog's API uses trailing slashes, hence the skip flag.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Let phones on the LAN load dev-server assets (Next blocks cross-origin
  // dev requests by default, which silently kills hydration on LAN IPs).
  // One entry per network this machine dev-serves from.
  allowedDevOrigins: ["192.168.68.61", "10.74.211.140"],
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
      {
        // Spotify album art (song cards + now-listening widget).
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        // iTunes Search album art (name-only song cards).
        protocol: "https",
        hostname: "**.mzstatic.com",
      },
      {
        // AniList cover images (anime stats "currently watching").
        protocol: "https",
        hostname: "s4.anilist.co",
      },
    ],
  },
};

export default nextConfig;
