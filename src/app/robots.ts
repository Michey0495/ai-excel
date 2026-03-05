import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/mcp"],
        disallow: ["/api/generate", "/api/explain"],
      },
    ],
    sitemap: "https://ai-excel.ezoai.jp/sitemap.xml",
  };
}
