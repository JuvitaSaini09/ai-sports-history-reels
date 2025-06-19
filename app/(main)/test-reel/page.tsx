// "use client";
// import { useEffect, useState } from "react";

// export default function TestReel() {
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     fetch("/api/audio")
//       .then((res) => res.json())
//       .then(setData);
//   }, []);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-2">{data.celebrity}</h2>
//       <p className="mb-4">{data.script}</p>
//       {/* <audio controls src={data.audioUrl}></audio> */}
//       <video controls width="100%" muted loop>
//         <source src="/reel-test.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// }

// app/test-reel/page.tsx or wherever you're rendering
"use client";
import { useEffect, useState } from "react";

export default function TestReel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/audio")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-center mt-4 text-lg">Loading...</p>;

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black text-white">
      <div className="snap-start h-screen w-full relative flex items-center justify-center">
        <video
          controls
          autoPlay
          loop
          playsInline
          className="h-full w-auto max-w-none"
          style={{ objectFit: "cover" }}
        >
          <source src="/reel-test.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay content */}
        <div className="absolute bottom-10 left-4 right-4 text-white z-10">
          <h2 className="text-xl font-semibold mb-1">{data.celebrity}</h2>
          <p className="text-sm text-white/90">{data.script}</p>
        </div>

        {/* Optional gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
      </div>
    </div>
  );
}
