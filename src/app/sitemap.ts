import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";
import { categoryToSlug, BLOG_CATEGORIES } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const seo = getSeo();
  const base = seo.siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/portfolio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/hire-me`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((cat) => ({
    url: `${base}/blog/category/${categoryToSlug(cat)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
