import { createReelVideo } from "@/lib/createReelVideo";
import { downloadImagesToPublicFolder } from "@/lib/downloadImages";
import { searchImages } from "@/lib/imageSearch";
import { generateVoiceFromScript } from "@/lib/murf";
import { generateScript } from "@/lib/script";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { celebrity, script } = await generateScript();
    const { audioUrl } = await generateVoiceFromScript(script);
    const images = await searchImages(celebrity);
    const downloadedImages = await downloadImagesToPublicFolder(
      images,
      celebrity
    );

    const filename = `reel-test.mp4`;
    const localVideoPath = await createReelVideo({
      images: downloadedImages,
      audioUrl,
      outputFileName: filename,
    });

    return NextResponse.json({
      celebrity,
      script,
      videoUrl: localVideoPath, // e.g. "/reel-test.mp4"
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
