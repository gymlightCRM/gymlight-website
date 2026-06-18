import { NextRequest, NextResponse } from "next/server";
import {
  extractInstagramShortcode,
  fetchInstagramReelVideoUrl,
} from "@/lib/instagram-reel";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !extractInstagramShortcode(url)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  const videoUrl = await fetchInstagramReelVideoUrl(url);

  if (!videoUrl) {
    return NextResponse.json(
      { error: "Video URL not found", videoUrl: null },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { videoUrl },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
