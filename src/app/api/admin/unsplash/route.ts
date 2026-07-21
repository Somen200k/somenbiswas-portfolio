import { NextRequest, NextResponse } from "next/server";
import { searchUnsplashPhoto } from "@/lib/unsplash";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ success: false, error: "Missing query." }, { status: 400 });
  }

  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { success: false, error: "UNSPLASH_ACCESS_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const photo = await searchUnsplashPhoto(query);
  if (!photo) {
    return NextResponse.json(
      { success: false, error: `No Unsplash image found for "${query}".` },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, ...photo });
}
