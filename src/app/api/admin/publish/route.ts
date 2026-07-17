import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { publishViaGithub, resolveGithubCreds } from "@/lib/github";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { path: filePath, content, message, github } = body as {
    path: string;
    content: string;
    message?: string;
    github?: { owner?: string; repo?: string; token?: string };
  };

  if (!filePath || typeof content !== "string") {
    return NextResponse.json({ success: false, error: "Missing path or content." }, { status: 400 });
  }

  if (filePath.includes("..") || path.isAbsolute(filePath)) {
    return NextResponse.json({ success: false, error: "Invalid path." }, { status: 400 });
  }

  const commitMessage = message || `Update ${filePath} via admin panel`;
  const creds = resolveGithubCreds(github);

  if (creds) {
    const result = await publishViaGithub(creds, filePath, content, commitMessage);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }
    return NextResponse.json({ success: true, method: "github", commitUrl: result.commitUrl });
  }

  try {
    const fullPath = path.join(process.cwd(), filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
    return NextResponse.json({ success: true, method: "filesystem" });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "No GitHub credentials configured and the filesystem is read-only here. Add GitHub owner/repo/token in Admin Settings.",
      },
      { status: 500 }
    );
  }
}
