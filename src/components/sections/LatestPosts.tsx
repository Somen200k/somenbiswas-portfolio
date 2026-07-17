import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/sections/PostCard";
import type { BlogPost } from "@/lib/types";

export function LatestPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="container-px mx-auto max-w-6xl py-28">
      <SectionReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
              Writing
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              From the <GradientText>blog</GradientText>
            </h2>
          </div>
          <Button href="/blog" variant="secondary">
            All Posts <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </SectionReveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {posts.map((post, i) => (
          <SectionReveal key={post.slug} delay={i * 0.1}>
            <PostCard post={post} />
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
