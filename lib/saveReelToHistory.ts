type Reel = {
  celebrity: string;
  script: string;
  videoUrl: string;
  timestamp: number;
};

export function saveReelToHistory(newReel: Reel) {
  console.log("Saving reel to history:", newReel);
  return;
}
export function getReelHistory(): Reel[] {
  return [];
}
