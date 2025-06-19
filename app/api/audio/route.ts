import { createReelVideo } from "@/lib/createReelVideo";
import { downloadImagesToPublicFolder } from "@/lib/downloadImages";
import { searchImages } from "@/lib/imageSearch";
import { generateVoiceFromScript } from "@/lib/murf";
import { generateScript } from "@/lib/script";
import { uploadToS3 } from "@/lib/uploadToS3";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    // const { celebrity, script } = await generateScript();
    // const audioUrl = await generateVoiceFromScript(script);
    // const images = await searchImages(celebrity);
    // const downloadedImages = await downloadImagesToPublicFolder(
    //   images,
    //   celebrity
    // );

    // console.log("audioUrl", audioUrl);

    const filename = `reel-test.mp4`;
    // const localVideoPath = await createReelVideo({
    //   images: downloadedImages,
    //   audioUrl,
    //   outputFileName: filename,
    // });

    const s3Url = await uploadToS3(
      path.join(process.cwd(), "public", filename)
    );
    // C:/Users/you/Desktop/ai-reels/public/reel-test.mp4
    //     So this line is saying:
    // 📤 “Hey, take this generated video from local folder and upload it to the S3 bucket using the uploadToS3 function, then get the final S3 URL back.”

    console.log(s3Url, "s3Url");

    return NextResponse.json({
      // celebrity,
      // script,
      // videoUrl: localVideoPath,
      videoUrls: s3Url.urls,
      // audioUrl,
        celebrity: "Sachin Tendulkar", // mock
  script: "He is considered one of the greatest batsmen in the history of cricket.",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
