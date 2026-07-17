import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  const seo = getSeo();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
