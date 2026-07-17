import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const ALLOWED_FILES = new Set([
  "hero.json",
  "about.json",
  "projects.json",
  "services.json",
  "stats.json",
  "contact.json",
  "rates.json",
  "seo.json",
]);

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ success: false, error: "Unknown file." }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), "data", file);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return NextResponse.json({ success: true, data: JSON.parse(raw) });
}
