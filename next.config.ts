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
