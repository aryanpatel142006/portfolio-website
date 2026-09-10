import type { MetadataRoute } from "next";

const SITE = "https://aryan.is-a.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes and the analytics proxy carry nothing worth indexing.
      disallow: ["/api/", "/ingest/"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
