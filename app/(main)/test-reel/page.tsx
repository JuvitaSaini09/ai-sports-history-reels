// "use client";
// import { useEffect, useState } from "react";

// export default function TestReel() {
//   const [data, setData] = useState<{
//     celebrity: string;
//     script: string;
//     videoUrls: string[];
//   } | null>(null);

//   useEffect(() => {
//     fetch("/api/audio")
//       .then((res) => res.json())
//       .then(setData)
//       .catch((err) => console.error("Failed to fetch reels", err));
//   }, []);

//   if (!data) return <p className="text-center mt-4 text-lg">Loading...</p>;

//   return (
//     <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black text-white">
//       {data.videoUrls.map((videoUrl, idx) => (
//         <div
//           key={idx}
//           className="snap-start h-screen w-full relative flex items-center justify-center"
//         >
//           <video
//             controls
//             autoPlay
//             loop
//             playsInline
//             muted
//             className="h-full w-auto max-w-none"
//             style={{ objectFit: "cover" }}
//           >
//             <source src={videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>

//           {/* Optional Overlay */}
//           <div className="absolute bottom-10 left-4 right-4 text-white z-10">
//             <h2 className="text-xl font-semibold mb-1">{data.celebrity}</h2>
//             <p className="text-sm text-white/90">{data.script}</p>
//           </div>

//           <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
//         </div>
//       ))}
//     </div>
//   );
// }

// app/reels/page.tsx
"use client";
import { useEffect, useState, useRef } from "react";

export default function ReelsPage() {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Step 1: Fetch existing reels from history
    fetch("/api/reels/list")
      .then((res) => res.json())
      .then((listData) => {
        setVideos(listData.videoUrls || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch history", err);
        setLoading(false);
      });
  }, []);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (isGenerating || loading) return;

      const scrollContainer = containerRef.current;
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // Near bottom → generate new reel
        setIsGenerating(true);
        fetch("/api/reels")
          .then((res) => res.json())
          .then((newData) => {
            if (newData.videoUrls?.length > 0) {
              setVideos((prev) => [...newData.videoUrls, ...prev]);
            }
          })
          .finally(() => setIsGenerating(false));
      }
    };

    const current = containerRef.current;
    current?.addEventListener("scroll", handleScroll);
    return () => current?.removeEventListener("scroll", handleScroll);
  }, [isGenerating, loading]);

  if (loading)
    return <p className="text-center mt-4 text-lg">Loading reels...</p>;

  return (
    <div
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black text-white"
      ref={containerRef}
    >
      {videos.map((url, idx) => (
        <div
          key={idx}
          className="snap-start h-screen w-full relative flex items-center justify-center"
        >
          <video
            controls
            autoPlay
            loop
            playsInline
            className="h-full w-auto max-w-none"
            style={{ objectFit: "cover" }}
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
        </div>
      ))}

      {isGenerating && (
        <p className="text-center py-4 text-gray-400">Generating new reel...</p>
      )}
    </div>
  );
}
