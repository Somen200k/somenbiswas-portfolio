"use client";

import { useMemo, useState } from "react";
import { Sparkles, CheckCircle2, XCircle, FilePlus2, ImagePlus } from "lucide-react";
import { buildMdxSource, publishFile } from "@/lib/admin-client";
import { AdminField, inputClass } from "@/components/admin/AdminField";
import { SaveBar, type SaveStatus } from "@/components/admin/SaveBar";
import { GlassCard } from "@/components/ui/GlassCard";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { getImageQueries, insertImagesIntoContent } from "@/lib/insert-images";

const COVER_IMAGES: Record<string, string> = {
  "AI Building": "/images/blog/ai-building-cover.svg",
  "Online Earning": "/images/blog/online-earning-cover.svg",
  "Remote Work & Freelancing": "/images/blog/remote-work-cover.svg",
  "Web Development With AI": "/images/blog/web-dev-ai-cover.svg",
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface Draft {
  title: string;
  category: string;
  excerpt: string;
  tags: string[];
  content: string;
  keyword: string;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function h2Count(text: string) {
  return (text.match(/^##\s+/gm) || []).length;
}

function firstPersonDensity(text: string) {
  const words = wordCount(text);
  if (words === 0) return 0;
  const hits = (text.match(/\b(i|i'm|i've|i'd|my|me)\b/gi) || []).length;
  return (hits / words) * 100;
}

interface SeoCheck {
  label: string;
  pass: boolean;
  detail: string;
}

function keywordChecks(draft: Draft): SeoCheck[] {
  const keyword = draft.keyword.trim().toLowerCase();
  if (!keyword) return [];

  const titleLower = draft.title.toLowerCase();
  const excerptLower = draft.excerpt.toLowerCase();
  const contentLower = draft.content.toLowerCase();
  const first150 = draft.content.trim().split(/\s+/).slice(0, 150).join(" ").toLowerCase();

  const occurrences = contentLower.split(keyword).length - 1;
  const words = wordCount(draft.content);
  const density = words > 0 ? (occurrences / words) * 100 : 0;

  return [
    {
      label: "Keyword in title",
      pass: titleLower.includes(keyword),
      detail: keyword,
    },
    {
      label: "Keyword in excerpt / meta description",
      pass: excerptLower.includes(keyword),
      detail: keyword,
    },
    {
      label: "Keyword in opening paragraph",
      pass: first150.includes(keyword),
      detail: "first ~150 words",
    },
    {
      label: "Keyword density",
      pass: occurrences >= 3 && density <= 2,
      detail: `${occurrences} mentions, ${density.toFixed(2)}% density (target 3+ mentions, under 2%)`,
    },
  ];
}

function runChecks(draft: Draft): SeoCheck[] {
  const words = wordCount(draft.content);
  const heads = h2Count(draft.content);
  const density = firstPersonDensity(draft.content);
  const slug = slugify(draft.title);

  return [
    ...keywordChecks(draft),
    {
      label: "Title length",
      pass: draft.title.length >= 40 && draft.title.length <= 75,
      detail: `${draft.title.length} chars (target 40–75)`,
    },
    {
      label: "Excerpt length",
      pass: draft.excerpt.length >= 100 && draft.excerpt.length <= 220,
      detail: `${draft.excerpt.length} chars (target 100–220)`,
    },
    {
      label: "Word count",
      pass: words >= 1200,
      detail: `${words} words (target 1200+)`,
    },
    {
      label: "Section headings",
      pass: heads >= 5,
      detail: `${heads} H2 headings (target 5+)`,
    },
    {
      label: "Tags",
      pass: draft.tags.length >= 3 && draft.tags.length <= 5,
      detail: `${draft.tags.length} tags (target 3–5)`,
    },
    {
      label: "Slug format",
      pass: slug.length > 0 && /^[a-z0-9-]+$/.test(slug),
      detail: slug || "(empty)",
    },
    {
      label: "Category selected",
      pass: BLOG_CATEGORIES.includes(draft.category as (typeof BLOG_CATEGORIES)[number]),
      detail: draft.category || "(none)",
    },
    {
      label: "General voice, not personal-narrative",
      pass: density < 1.5,
      detail: `${density.toFixed(2)} first-person words per 100 (target < 1.5)`,
    },
  ];
}

export function ArticleGenerator() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<string>(BLOG_CATEGORIES[0]);
  const [angle, setAngle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [publishError, setPublishError] = useState("");
  const [addingImages, setAddingImages] = useState(false);
  const [imageError, setImageError] = useState("");

  const checks = useMemo(() => (draft ? runChecks(draft) : []), [draft]);
  const passCount = checks.filter((c) => c.pass).length;

  async function handleAddImages() {
    if (!draft) return;
    setAddingImages(true);
    setImageError("");
    try {
      const queries = getImageQueries(draft.category, draft.keyword || draft.title);
      const results = await Promise.all(
        queries.map((q) =>
          fetch(`/api/admin/unsplash?query=${encodeURIComponent(q)}`).then((r) => r.json())
        )
      );
      const photos = results
        .filter((r) => r.success)
        .map((r) => ({ url: r.url, alt: r.alt, credit: r.credit }));
      if (photos.length === 0) {
        setImageError(results.find((r) => !r.success)?.error || "No images found.");
        return;
      }
      setDraft({ ...draft, content: insertImagesIntoContent(draft.content, photos) });
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Failed to fetch images.");
    } finally {
      setAddingImages(false);
    }
  }

  async function handleGenerate() {
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/admin/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category, angle, keyword }),
      });
      const data = await res.json();
      if (!data.success) {
        setGenError(data.error || "Generation failed.");
        return;
      }
      setDraft({
        title: data.article.title,
        category,
        excerpt: data.article.excerpt,
        tags: data.article.tags || [],
        content: data.article.content,
        keyword,
      });
      setStatus("idle");
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublish() {
    if (!draft) return;
    setStatus("saving");
    const slug = slugify(draft.title);
    if (!slug) {
      setStatus("error");
      setPublishError("Title is required to generate a slug.");
      return;
    }

    const source = buildMdxSource({
      title: draft.title,
      date: new Date().toISOString().slice(0, 10),
      category: draft.category,
      excerpt: draft.excerpt,
      tags: draft.tags,
      coverImage: COVER_IMAGES[draft.category] || "/images/blog/ai-building-cover.svg",
      published: true,
      content: draft.content,
    });

    const res = await publishFile(
      `content/blog/${slug}.mdx`,
      source,
      `Add blog post: ${slug}`
    );

    if (res.success) {
      setStatus("success");
      setTimeout(() => {
        setDraft(null);
        setTopic("");
        setAngle("");
        setKeyword("");
        setStatus("idle");
      }, 1200);
    } else {
      setStatus("error");
      setPublishError(res.error || "Publish failed.");
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <h2 className="font-semibold">Article Generator</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Topic / working title">
            <input
              className={inputClass}
              placeholder="e.g. Choosing a database for a side project"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </AdminField>
          <AdminField label="Category">
            <select
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </AdminField>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminField
            label="Target keyword"
            hint="The exact phrase you want this post to rank for on Google"
          >
            <input
              className={inputClass}
              placeholder="e.g. how to price freelance work"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </AdminField>
          <AdminField label="Specific angle (optional)" hint="Any particular point of view or detail to emphasize">
            <input
              className={inputClass}
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
            />
          </AdminField>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" /> {generating ? "Generating..." : "Generate Draft"}
          </button>
          <span className="text-xs text-dim">or</span>
          <button
            type="button"
            onClick={() =>
              setDraft({ title: "", category, excerpt: "", tags: [], content: "", keyword })
            }
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground"
          >
            <FilePlus2 className="h-4 w-4" /> Paste Your Own (from ChatGPT / Claude)
          </button>
        </div>
        {genError && <p className="mt-3 text-sm text-red-400">{genError}</p>}
      </GlassCard>

      {draft && (
        <>
          <GlassCard>
            <h3 className="mb-4 font-semibold">Review Draft</h3>

            <AdminField label="Title">
              <input
                className={inputClass}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </AdminField>

            <div className="mt-4">
              <AdminField
                label="Target keyword"
                hint="The exact phrase this post should rank for"
              >
                <input
                  className={inputClass}
                  value={draft.keyword}
                  onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
                />
              </AdminField>
            </div>

            <div className="mt-4">
              <AdminField label="Excerpt">
                <textarea
                  rows={2}
                  className={inputClass}
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                />
              </AdminField>
            </div>

            <div className="mt-4">
              <AdminField label="Tags" hint="Comma-separated">
                <input
                  className={inputClass}
                  value={draft.tags.join(", ")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </AdminField>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="block text-xs uppercase tracking-wide text-dim">
                  Content (Markdown)
                </span>
                <button
                  type="button"
                  onClick={handleAddImages}
                  disabled={addingImages || !draft.content.trim()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground disabled:opacity-60"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  {addingImages ? "Finding images..." : "Add Relevant Images"}
                </button>
              </div>
              <AdminField
                label=""
                hint="Paste the body here if you wrote this with ChatGPT/Claude — use ## for section headings"
              >
                <textarea
                  rows={20}
                  placeholder="Paste your markdown content here..."
                  className={`${inputClass} font-mono`}
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                />
              </AdminField>
              {imageError && <p className="mt-2 text-sm text-red-400">{imageError}</p>}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">SEO & Voice Score</h3>
              <span className="text-sm text-dim">{passCount}/{checks.length} passed</span>
            </div>
            <div className="space-y-2">
              {checks.map((check) => (
                <div key={check.label} className="flex items-start gap-2 text-sm">
                  {check.pass ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <span>
                    <span className="font-medium">{check.label}</span>
                    <span className="text-dim"> — {check.detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <SaveBar
            status={status}
            errorMessage={publishError}
            onSave={handlePublish}
            label="Publish Post"
          />
        </>
      )}
    </div>
  );
}
