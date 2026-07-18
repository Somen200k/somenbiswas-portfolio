import { ArrowRight } from "lucide-react";
import { PopReveal, SectionReveal } from "@/components/ui/SectionReveal";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PostCard } from "@/components/sections/PostCard";
import type { BlogPost } from "@/lib/types";

export function LatestPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="container-px mx-auto max-w-6xl py-28">
      <SectionReveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Writing</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
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
          <PopReveal key={post.slug} index={i}>
            <PostCard post={post} />
          </PopReveal>
        ))}
      </div>
    </section>
  );
}
