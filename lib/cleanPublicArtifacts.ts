import fs from "fs";
import path from "path";

export function cleanPublicArtifacts() {
  const tmpPath = "/tmp";

  const reelsFolder = path.join(tmpPath, "reels-tmp");
  const videoFile = path.join(tmpPath, "reel-test.mp4");

  // Delete reels-tmp folder
  if (fs.existsSync(reelsFolder)) {
    fs.rmSync(reelsFolder, { recursive: true, force: true });
    console.log("🧹 Deleted /tmp/reels-tmp folder");
  }

  // Delete reel-test.mp4
  if (fs.existsSync(videoFile)) {
    fs.unlinkSync(videoFile);
    console.log("🧼 Deleted /tmp/reel-test.mp4");
  }
}
