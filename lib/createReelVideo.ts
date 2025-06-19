import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "./ffmpegPath";
import axios from "axios";
import https from "https";
import sharp from "sharp";

// console.log("🎯 ffmpeg path is:", ffmpegPath);
ffmpeg.setFfmpegPath(ffmpegPath);

async function downloadFile(url: string, outputPath: string) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
  fs.writeFileSync(outputPath, Buffer.from(response.data));
}

export async function createReelVideo({
  images,
  audioUrl,
  outputFileName,
}: {
  images: string[];
  audioUrl: string;
  outputFileName: string;
}): Promise<string> {
  const publicPath = path.join(process.cwd(), "public");
  const tempPath = path.join(publicPath, "tmp");

  if (fs.existsSync(tempPath)) {
    fs.rmSync(tempPath, { recursive: true, force: true });
  }
  fs.mkdirSync(tempPath, { recursive: true });

  const imageInputs: string[] = [];

  for (let i = 0; i < images.length; i++) {
    const inputImagePath = path.isAbsolute(images[i])
      ? images[i]
      : path.join(publicPath, images[i]);

    if (!fs.existsSync(inputImagePath)) {
      console.warn(`🚫 Image not found: ${inputImagePath}`);
      continue;
    }

    const stats = fs.statSync(inputImagePath);
    if (stats.size === 0) {
      console.warn(`⚠️ Skipping empty image: ${inputImagePath}`);
      continue;
    }

    const renamed = path.join(tempPath, `img${i}.jpg`);
    try {
      await sharp(inputImagePath)
        .resize(1080, 1920, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 90 })
        .toFile(renamed);
      imageInputs.push(renamed);
    } catch (err) {
      console.warn(`❌ Failed to process image: ${inputImagePath}`, err);
      continue;
    }
  }

  // console.log("✅ Total valid images used:", imageInputs.length);

  if (imageInputs.length === 0) {
    throw new Error("❌ No valid images to create the video.");
  }

  const audioPath = path.join(tempPath, "audio.mp3");
  await downloadFile(audioUrl, audioPath);

  const outputPath = path.join(publicPath, outputFileName);

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg();

    // Add all image inputs
    imageInputs.forEach((img) => {
      cmd.input(img);
    });

    // Add audio input (without -f mp3, let ffmpeg detect)
    cmd.input(audioPath);

    // Create filter complex - Fixed syntax
    const videoFilters = imageInputs.map(
      (_, i) =>
        `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setpts=PTS-STARTPTS,loop=loop=-1:size=1:start=0,trim=duration=5,setpts=PTS-STARTPTS[v${i}]`
    );

    const concatInputs = imageInputs.map((_, i) => `[v${i}]`).join("");
    const concatFilter = `${concatInputs}concat=n=${imageInputs.length}:v=1:a=0[outv]`;

    const allFilters = [...videoFilters, concatFilter];

    cmd
      .complexFilter(allFilters)
      .outputOptions([
        "-map",
        "[outv]",
        "-map",
        `${imageInputs.length}:a`, // Audio from last input
        "-shortest",
        "-c:v",
        "libx264",
        "-preset",
        "medium", // Changed from veryfast for better quality
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-y", // Overwrite output file if exists
      ])
      .output(outputPath)
      .on("start", (cmdLine) => {
        console.log("🚀 FFmpeg started with:", cmdLine);
      })
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(`📊 Processing: ${Math.round(progress.percent)}% done`);
        }
      })
      .on("end", () => {
        console.log("✅ Video created:", outputPath);
        // Clean up temp files
        setTimeout(() => {
          try {
            if (fs.existsSync(tempPath)) {
              fs.rmSync(tempPath, { recursive: true, force: true });
            }
          } catch (cleanupErr) {
            console.warn("⚠️ Failed to cleanup temp files:", cleanupErr);
          }
          resolve(`/${outputFileName}`);
        }, 500);
      })
      .on("error", (err) => {
        console.error("🔥 FFmpeg error:", err.message || err);
        // Clean up on error
        try {
          if (fs.existsSync(tempPath)) {
            fs.rmSync(tempPath, { recursive: true, force: true });
          }
        } catch (cleanupErr) {
          console.warn(
            "⚠️ Failed to cleanup temp files after error:",
            cleanupErr
          );
        }
        reject(new Error(`FFmpeg conversion failed: ${err.message}`));
      })
      .run();
  });
}
