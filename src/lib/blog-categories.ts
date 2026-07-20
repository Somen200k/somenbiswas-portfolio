export const BLOG_CATEGORIES = [
  "AI Building",
  "Online Earning",
  "Remote Work & Freelancing",
  "Web Development With AI",
] as const;

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToCategory(slug: string): string | undefined {
  return BLOG_CATEGORIES.find((c) => categoryToSlug(c) === slug);
}
