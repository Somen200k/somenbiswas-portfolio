"use client";

const AUTH_KEY = "sb_admin_auth";
const GH_TOKEN_KEY = "sb_gh_token";
const GH_OWNER_KEY = "sb_gh_owner";
const GH_REPO_KEY = "sb_gh_repo";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function setAdminAuthed(value: boolean) {
  if (value) localStorage.setItem(AUTH_KEY, "1");
  else localStorage.removeItem(AUTH_KEY);
}

export function getGithubSettings() {
  if (typeof window === "undefined") return { token: "", owner: "", repo: "" };
  return {
    token: localStorage.getItem(GH_TOKEN_KEY) || "",
    owner: localStorage.getItem(GH_OWNER_KEY) || "",
    repo: localStorage.getItem(GH_REPO_KEY) || "",
  };
}

export function setGithubSettings(settings: { token: string; owner: string; repo: string }) {
  localStorage.setItem(GH_TOKEN_KEY, settings.token);
  localStorage.setItem(GH_OWNER_KEY, settings.owner);
  localStorage.setItem(GH_REPO_KEY, settings.repo);
}

interface PublishResponse {
  success: boolean;
  method?: "github" | "filesystem";
  error?: string;
  commitUrl?: string;
}

export async function publishFile(
  filePath: string,
  content: string,
  message?: string,
  encoding?: "utf-8" | "base64"
): Promise<PublishResponse> {
  const github = getGithubSettings();
  const res = await fetch("/api/admin/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: filePath, content, message, github, encoding }),
  });
  return res.json();
}

/** Reads a File as a base64 string (no data: URL prefix) for binary uploads. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip the "data:<mime>;base64," prefix
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Couldn't read the file."));
    reader.readAsDataURL(file);
  });
}

export async function deleteBlogPost(slug: string): Promise<PublishResponse> {
  const github = getGithubSettings();
  const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ github }),
  });
  return res.json();
}

export async function fetchDataFile<T>(file: string): Promise<T> {
  const res = await fetch(`/api/admin/content?file=${encodeURIComponent(file)}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to load content.");
  return json.data as T;
}

export interface AdminBlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags: string[];
  coverImage: string;
  published?: boolean;
  youtubeId?: string;
  content: string;
}

export async function fetchAllBlogPosts(): Promise<AdminBlogPost[]> {
  const res = await fetch("/api/admin/blog", { cache: "no-store" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to load posts.");
  return json.posts as AdminBlogPost[];
}

export function buildMdxSource(post: Omit<AdminBlogPost, "slug">): string {
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `date: ${JSON.stringify(post.date)}`,
    `category: ${JSON.stringify(post.category)}`,
    `excerpt: ${JSON.stringify(post.excerpt)}`,
    `tags: ${JSON.stringify(post.tags)}`,
    `coverImage: ${JSON.stringify(post.coverImage)}`,
    `published: ${post.published !== false}`,
    ...(post.youtubeId ? [`youtubeId: ${JSON.stringify(post.youtubeId)}`] : []),
    "---",
    "",
  ].join("\n");

  return frontmatter + post.content;
}
