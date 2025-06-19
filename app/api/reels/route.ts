import { cleanPublicArtifacts } from "@/lib/cleanPublicArtifacts";
import { createReelVideo } from "@/lib/createReelVideo";
import { downloadImagesToPublicFolder } from "@/lib/downloadImages";
import { searchImages } from "@/lib/imageSearch";
import { generateVoiceFromScript } from "@/lib/murf";
import { generateScript } from "@/lib/script";
import { uploadToS3 } from "@/lib/uploadToS3";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { saveReelToHistory } from "@/lib/saveReelToHistory";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
}

export async function GET() {
  try {
    cleanPublicArtifacts();

    const { celebrity, script } = await generateScript();
    const audioUrl = await generateVoiceFromScript(script);
    const images = await searchImages(celebrity);
    const downloadedImages = await downloadImagesToPublicFolder(
      images,
      celebrity
    );

    const timestamp = Date.now();

    const filename = `reel-${slugify(celebrity)}-${timestamp}.mp4`;

    await createReelVideo({
      images: downloadedImages,
      audioUrl,
      outputFileName: filename,
    });

    const fullPath = path.join(process.cwd(), "public", filename);

    console.log("🎥 Absolute path:", fullPath);
    console.log("📁 Exists:", fs.existsSync(fullPath));

    if (!fs.existsSync(fullPath)) {
      throw new Error("Video not created! Path doesn't exist: " + fullPath);
    }

    const s3Url = await uploadToS3(fullPath);

    saveReelToHistory({
      celebrity,
      script,
      videoUrl: s3Url.urls[0],
      timestamp: Date.now(),
    });

    return NextResponse.json({ videoUrls: s3Url.urls });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error generating reel:", err.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
