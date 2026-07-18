import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GradientText } from "@/components/ui/GradientText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PostCard } from "@/components/sections/PostCard";
import {
  BLOG_CATEGORIES,
  categoryToSlug,
  getPostsByCategory,
  slugToCategory,
} from "@/lib/blog";
import { getSeo } from "@/lib/data";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({ category: categoryToSlug(cat) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug);
  const seo = getSeo();
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category} Articles`,
    description: `Articles in the ${category} category from Somen Biswas's blog.`,
    alternates: { canonical: `${seo.siteUrl}/blog/category/${categorySlug}` },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug);
  if (!category) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div className="container-px mx-auto max-w-6xl py-20">
      <SectionReveal>
        <Eyebrow>Blog</Eyebrow>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl md:text-6xl">
          <GradientText>{category}</GradientText>
        </h1>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            data-cursor-hover
            className="glass rounded-full px-4 py-1.5 text-sm text-muted transition-colors hover:border-border-hover hover:text-foreground"
          >
            All
          </Link>
          {BLOG_CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <Link
                key={cat}
                href={`/blog/category/${categoryToSlug(cat)}`}
                data-cursor-hover
                className={
                  active
                    ? "rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-[#0a0a0a]"
                    : "glass rounded-full px-4 py-1.5 text-sm text-muted transition-colors hover:border-border-hover hover:text-foreground"
                }
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </SectionReveal>

      {posts.length === 0 ? (
        <p className="mt-16 text-muted">No posts in this category yet.</p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <SectionReveal key={post.slug} delay={(i % 3) * 0.08}>
              <PostCard post={post} />
            </SectionReveal>
          ))}
        </div>
      )}
    </div>
  );
}
