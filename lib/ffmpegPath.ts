// lib/ffmpegPath.ts
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const ffmpegPath = require("ffmpeg-static"); // This gives the actual .exe path
export default ffmpegPath;
