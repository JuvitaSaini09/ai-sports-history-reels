import fs from "fs";
import path from "path";

export function cleanPublicArtifacts() {
  const publicPath = path.join(process.cwd(), "public");

  const reelsFolder = path.join(publicPath, "reels-tmp");
  const videoFile = path.join(publicPath, "reel-test.mp4");

  // Delete reels-tmp folder
  if (fs.existsSync(reelsFolder)) {
    fs.rmSync(reelsFolder, { recursive: true, force: true });
    console.log("🧹 Deleted reels-tmp folder");
  }

  // Delete reel-test.mp4
  if (fs.existsSync(videoFile)) {
    fs.unlinkSync(videoFile);
    console.log("🧼 Deleted reel-test.mp4");
  }
}
