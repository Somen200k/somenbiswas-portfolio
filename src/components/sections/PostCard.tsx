import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { TiltCard } from "@/components/ui/TiltCard";
import type { BlogPost } from "@/lib/types";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <TiltCard maxTilt={4} className="h-full">
      <Link href={`/blog/${post.slug}`} data-cursor-hover>
        <GlassCard className="flex h-full flex-col overflow-hidden p-0">
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-[#0a0a0a]">
              {post.category}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="line-clamp-2 h-[3.1rem] overflow-hidden text-lg font-semibold leading-snug">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-dim">
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </TiltCard>
  );
}
