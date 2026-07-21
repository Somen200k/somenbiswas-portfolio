import { NextRequest, NextResponse } from "next/server";
import { searchPexelsPhoto } from "@/lib/pexels";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ success: false, error: "Missing query." }, { status: 400 });
  }

  if (!process.env.PEXELS_API_KEY) {
    return NextResponse.json(
      { success: false, error: "PEXELS_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const photo = await searchPexelsPhoto(query);
  if (!photo) {
    return NextResponse.json(
      { success: false, error: `No Pexels image found for "${query}".` },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, ...photo });
}
