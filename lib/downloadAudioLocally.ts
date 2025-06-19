// // lib/downloadAudio.ts

import fs from "fs";
import path from "path";
import axios from "axios";

// export async function downloadAudioFileLocally(
//   url: string,
//   celebrity: string
// ): Promise<string> {
//   const audioBuffer = await axios.get(url, { responseType: "arraybuffer" });
//   const fileName = `${celebrity.replace(/\s+/g, "_")}_voiceover.mp3`;
//   const filePath = path.join(process.cwd(), "public", "reels", fileName);
//   fs.writeFileSync(filePath, audioBuffer.data);
//   return filePath;
// }

export async function downloadAudioFileLocally(
  url: string,
  celebrity: string
): Promise<string> {
  const audioBuffer = await axios.get(url, { responseType: "arraybuffer" });

  const fileName = `${celebrity.replace(/\s+/g, "_")}_voiceover.mp3`;

  // ✅ use /tmp instead of /public
  const filePath = path.join("/tmp", "reels-tmp", fileName);

  // ✅ make sure the directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, audioBuffer.data);

  return filePath;
}
