import { getReelHistory } from "@/lib/saveReelToHistory";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reels = getReelHistory();
    const videoUrls = reels.map((r) => r.videoUrl);
    return NextResponse.json({ videoUrls });
  } catch (err) {
    console.error("❌ Failed to get reel history:", err);
    return NextResponse.json({ videoUrls: [] });
  }
}
