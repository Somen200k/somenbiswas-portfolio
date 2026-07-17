import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { deleteViaGithub, resolveGithubCreds } from "@/lib/github";

const blogDir = path.join(process.cwd(), "content", "blog");

export async function GET() {
  if (!fs.existsSync(blogDir)) {
    return NextResponse.json({ success: true, posts: [] });
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const { data, content } = matter(raw);
    return { slug, ...data, content };
  });

  return NextResponse.json({ success: true, posts });
}

export async function DELETE(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ success: false, error: "Missing slug." }, { status: 400 });
  }

  const filePath = `content/blog/${slug}.mdx`;
  let github;
  try {
    const body = await req.json();
    github = body?.github;
  } catch {
    github = undefined;
  }

  const creds = resolveGithubCreds(github);

  if (creds) {
    const result = await deleteViaGithub(creds, filePath, `Delete blog post: ${slug}`);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  }

  try {
    fs.unlinkSync(path.join(process.cwd(), filePath));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not delete — configure GitHub credentials in Admin Settings." },
      { status: 500 }
    );
  }
}
