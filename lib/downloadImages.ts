import fs from "fs";
import path from "path";
import axios from "axios";
import https from "https";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
}

export async function downloadImagesToPublicFolder(
  urls: string[],
  celebrity: string
): Promise<string[]> {
  const celebritySlug = slugify(celebrity);
  const folderPath = path.join(
    process.cwd(),
    "public",
    "reels-tmp",
    celebritySlug
  );
  fs.mkdirSync(folderPath, { recursive: true });

  const imagePaths: string[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    // 🔒 Skip blocked domains like hdwallpapers.in
    if (url.includes("hdwallpapers.in")) {
      console.warn(`⏭️ Skipping blocked image URL: ${url}`);
      continue;
    }

    const extMatch = url.match(/\.(jpg|jpeg|png|webp|gif)/i);
    const extension = extMatch ? extMatch[1] : "jpg";
    const fileName = `img${String(i + 1).padStart(3, "0")}.${extension}`;
    const filePath = path.join(folderPath, fileName);

    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      fs.writeFileSync(filePath, response.data);
      imagePaths.push(filePath);
    } catch (err) {
      console.error(`❌ Failed to download image ${url}:`, err);
    }
  }

  return imagePaths;
}
