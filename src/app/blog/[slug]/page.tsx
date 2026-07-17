import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { AdSlot } from "@/components/sections/AdSlot";
import { ShareButtons } from "@/components/sections/ShareButtons";
import { NexGuildCta } from "@/components/sections/NexGuildCta";
import { PostCard } from "@/components/sections/PostCard";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { splitContentInHalf } from "@/lib/split-content";
import { getSeo } from "@/lib/data";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const seo = getSeo();
  if (!post) return { title: "Post Not Found" };

  const url = `${seo.siteUrl}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      images: [{ url: post.coverImage }],
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const seo = getSeo();
  const url = `${seo.siteUrl}/blog/${post.slug}`;
  const related = getRelatedPosts(post, 3);
  const [firstHalf, secondHalf] = splitContentInHalf(post.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${seo.siteUrl}${post.coverImage}`,
    datePublished: post.date,
    author: { "@type": "Person", name: "Somen Biswas", url: seo.siteUrl },
    publisher: { "@type": "Person", name: "Somen Biswas" },
    mainEntityOfPage: url,
  };

  return (
    <article className="container-px mx-auto max-w-3xl py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <SectionReveal>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <span className="mt-6 inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold text-[#0a0a0a]">
          {post.category}
        </span>

        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-dim">
          <span>Somen Biswas</span>
          <span>·</span>
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>

        <div className="relative mt-8 h-56 w-full overflow-hidden rounded-2xl sm:h-72 md:h-96">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      </SectionReveal>

      <AdSlot slot="blog-top" />

      <div className="prose prose-invert prose-gold max-w-none prose-headings:font-semibold prose-headings:tracking-tight">
        <MDXRemote source={firstHalf} />
      </div>

      {secondHalf && (
        <>
          <AdSlot slot="blog-middle" />
          <div className="prose prose-invert prose-gold max-w-none prose-headings:font-semibold prose-headings:tracking-tight">
            <MDXRemote source={secondHalf} />
          </div>
        </>
      )}

      {post.youtubeId && (
        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${post.youtubeId}`}
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}

      <AdSlot slot="blog-end" />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              #{tag}
            </span>
          ))}
        </div>
        <ShareButtons title={post.title} url={url} />
      </div>

      <NexGuildCta />

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-semibold">Related Posts</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
