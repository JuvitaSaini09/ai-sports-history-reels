// api=api/audio/
import { generateScript } from "@/lib/ai";
import { searchImages } from "@/lib/imageSearch";
import { generateVoiceFromScript } from "@/lib/murf";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🎯 Step 1: Generate script and celebrity name
    const { celebrity, script } = await generateScript();

    // 🔊 Step 2: Generate voice audio from script
    // const audioUrl = await generateVoiceFromScript(script);

    // 📷 Step 3: Generate image from script
    const images = await searchImages(celebrity);
    console.log("🖼 Images fetched:", images);

    const finalVideoUrl = await createReelVideo({
      images, // URLs
      audioUrl, // from Murf
      duration: audioLengthInSeconds, // or calculate
    });

    // 📦 Final response
    return NextResponse.json({
      // celebrity,
      // script,
      // audioUrl,
      images,
    });
  } catch (error: any) {
    console.error("🔥 Error generating reel:", error.message || error);
    return NextResponse.json(
      { error: "Something went wrong while generating the reel." },
      { status: 500 }
    );
  }
}
