import type { Metadata } from "next";
import Link from "next/link";
import { PopReveal, SectionReveal } from "@/components/ui/SectionReveal";
import { GradientText } from "@/components/ui/GradientText";
import { PostCard } from "@/components/sections/PostCard";
import { AdSlot } from "@/components/sections/AdSlot";
import { getAllPosts, BLOG_CATEGORIES, categoryToSlug } from "@/lib/blog";
import { getSeo } from "@/lib/data";

export function generateMetadata(): Metadata {
  const seo = getSeo();
  const page = seo.pages.blog;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${seo.siteUrl}/blog` },
  };
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container-px mx-auto max-w-6xl py-20">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Blog
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Writing on <GradientText>building in public</GradientText>
        </h1>

        <div className="mt-8 flex flex-wrap gap-2">
          <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-[#0a0a0a]">
            All
          </span>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog/category/${categoryToSlug(cat)}`}
              data-cursor-hover
              className="glass rounded-full px-4 py-1.5 text-sm text-muted transition-colors hover:border-border-hover hover:text-foreground"
            >
              {cat}
            </Link>
          ))}
        </div>
      </SectionReveal>

      <AdSlot slot="blog-top" />

      {posts.length === 0 ? (
        <p className="mt-16 text-muted">No posts published yet — check back soon.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PopReveal key={post.slug} index={i}>
              <PostCard post={post} />
            </PopReveal>
          ))}
        </div>
      )}
    </div>
  );
}
