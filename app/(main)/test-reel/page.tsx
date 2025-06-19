"use client";
import { useEffect, useState, useRef } from "react";

export default function ReelsPage() {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Load one new reel on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await fetch("/api/reels");
        const { videoUrls: newOnTop } = await res.json();

        const historyRes = await fetch("/api/reels/list");
        const { videoUrls: oldBelow } = await historyRes.json();

        setVideos([...newOnTop, ...oldBelow]);
      } catch (err) {
        console.error("❌ Initial loading failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadInitial();
  }, []);

  // ✅ Infinite scroll (bottom for newer reels)
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || isGenerating) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      // 👇 If reached near bottom, generate new
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setIsGenerating(true);
        fetch("/api/reels")
          .then((res) => res.json())
          .then((data) => {
            if (data.videoUrls?.length > 0) {
              setVideos((prev) => [...data.videoUrls, ...prev]);
            }
          })
          .catch((err) => {
            console.error("❌ Error generating new reel", err);
          })
          .finally(() => setIsGenerating(false));
      }

      // 👆 If reached near top, load older from history
      if (scrollTop < 50) {
        fetch("/api/reels/list")
          .then((res) => res.json())
          .then((data) => {
            if (data.videoUrls?.length > 0) {
              setVideos((prev) => [...prev, ...data.videoUrls]);
            }
          })
          .catch((err) => console.error("⚠️ History fetch fail", err));
      }
    };

    const current = containerRef.current;
    current?.addEventListener("scroll", handleScroll);
    return () => current?.removeEventListener("scroll", handleScroll);
  }, [isGenerating]);

  if (loading)
    return <p className="text-center mt-4 text-lg">⏳ Loading reels...</p>;

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black text-white"
    >
      {videos.map((url, idx) => (
        <div
          key={url + idx}
          className="snap-start h-screen w-full relative flex items-center justify-center"
        >
          <video
            src={url}
            controls
            autoPlay
            loop
            playsInline
            className="h-full w-auto max-w-none"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
        </div>
      ))}

      {isGenerating && (
        <p className="text-center py-4 text-gray-400">⚙️ Generating reel...</p>
      )}
    </div>
  );
}
