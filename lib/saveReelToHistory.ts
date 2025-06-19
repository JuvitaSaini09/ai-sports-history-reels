import fs from "fs";
import path from "path";

type Reel = {
  celebrity: string;
  script: string;
  videoUrl: string;
  timestamp: number;
};

const dataFolder = path.join(process.cwd(), "data");
const filePath = path.join(dataFolder, "reels.json");

export function saveReelToHistory(newReel: Reel) {
  let current: Reel[] = [];

  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      current = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("⚠️ Couldn't read reels.json. Starting fresh.");
  }

  current.unshift(newReel);
  fs.writeFileSync(filePath, JSON.stringify(current, null, 2), "utf-8");
}

export function getReelHistory(): Reel[] {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("⚠️ Couldn't read reels.json");
  }

  return [];
}
