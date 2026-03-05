import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/functions-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ai-excel.ezoai.jp";
  const now = new Date();

  const functionPages = getAllSlugs().map((slug) => ({
    url: `${baseUrl}/functions/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/functions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...functionPages,
  ];
}
