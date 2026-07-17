"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Eye, EyeOff, ArrowLeft } from "lucide-react";
import {
  buildMdxSource,
  deleteBlogPost,
  fetchAllBlogPosts,
  publishFile,
  type AdminBlogPost,
} from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function emptyPost(): AdminBlogPost {
  return {
    slug: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    category: BLOG_CATEGORIES[0],
    excerpt: "",
    tags: [],
    coverImage: "/images/blog/ai-building-cover.svg",
    published: true,
    content: "",
  };
}

export function BlogManager() {
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  function loadPosts() {
    fetchAllBlogPosts()
      .then((p) => setPosts(p.sort((a, b) => (a.date < b.date ? 1 : -1))))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete post "${slug}"? This cannot be undone.`)) return;
    const res = await deleteBlogPost(slug);
    if (res.success) loadPosts();
    else setError(res.error || "Delete failed.");
  }

  async function handleTogglePublished(post: AdminBlogPost) {
    const { slug: _slug, ...rest } = post;
    void _slug;
    const source = buildMdxSource({ ...rest, published: !(post.published !== false) });
    const res = await publishFile(
      `content/blog/${post.slug}.mdx`,
      source,
      `Toggle published state: ${post.slug}`
    );
    if (res.success) loadPosts();
    else setError(res.error || "Update failed.");
  }

  async function handleSave() {
    if (!editing) return;
    setStatus("saving");

    const slug = isNew ? slugify(editing.title) : editing.slug;
    if (!slug) {
      setStatus("error");
      setError("Title is required to generate a slug.");
      return;
    }

    const { slug: _slug, ...postFields } = editing;
    void _slug;
    const source = buildMdxSource(postFields);
    const res = await publishFile(
      `content/blog/${slug}.mdx`,
      source,
      isNew ? `Add blog post: ${slug}` : `Update blog post: ${slug}`
    );

    if (res.success) {
      setStatus("success");
      setTimeout(() => {
        setEditing(null);
        loadPosts();
      }, 700);
    } else {
      setStatus("error");
      setError(res.error || "Save failed.");
    }
  }

  if (editing) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </button>

        <AdminField label="Title">
          <input
            className={inputClass}
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
        </AdminField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Category">
            <select
              className={inputClass}
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Date">
            <input
              type="date"
              className={inputClass}
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
            />
          </AdminField>
        </div>

        <AdminField label="Excerpt">
          <textarea
            rows={2}
            className={inputClass}
            value={editing.excerpt}
            onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
          />
        </AdminField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Cover Image URL">
            <input
              className={inputClass}
              value={editing.coverImage}
              onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })}
            />
          </AdminField>
          <AdminField label="Tags" hint="Comma-separated">
            <input
              className={inputClass}
              value={editing.tags.join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
            />
          </AdminField>
        </div>

        <AdminField label="YouTube Video ID (optional)">
          <input
            className={inputClass}
            value={editing.youtubeId || ""}
            onChange={(e) => setEditing({ ...editing, youtubeId: e.target.value })}
          />
        </AdminField>

        <AdminField label="Content (Markdown / MDX)">
          <textarea
            rows={18}
            className={`${inputClass} font-mono`}
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
          />
        </AdminField>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={editing.published !== false}
            onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
          />
          Published
        </label>

        <SaveBar status={status} errorMessage={error} onSave={handleSave} label="Publish Post" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => {
          setEditing(emptyPost());
          setIsNew(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-[#0a0a0a]"
      >
        <Plus className="h-3.5 w-3.5" /> New Post
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {!posts ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <GlassCard key={post.slug} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{post.title}</p>
                <p className="text-xs text-dim">
                  {post.category} · {post.date}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublished(post)}
                  className="rounded-full border border-border p-2"
                  aria-label="Toggle published"
                >
                  {post.published !== false ? (
                    <Eye className="h-4 w-4 text-gold" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-dim" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(post);
                    setIsNew(false);
                  }}
                  className="rounded-full border border-border p-2"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  className="rounded-full border border-border p-2 hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
