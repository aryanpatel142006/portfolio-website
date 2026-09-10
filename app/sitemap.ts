import type { MetadataRoute } from "next";

const SITE = "https://aryan.is-a.dev";

// One-page site: the root URL plus the public resume are the only crawlable
// documents. Sections are anchors on the root, so they don't get entries.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/resume.pdf`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
