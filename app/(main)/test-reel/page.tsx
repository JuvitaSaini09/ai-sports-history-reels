"use client";
import { useEffect, useState } from "react";

export default function TestReel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/audio")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{data.celebrity}</h2>
      <p className="mb-4">{data.script}</p>
      <audio controls src={data.audioUrl}></audio>

      <video controls width="100%" autoplay muted loop>
        <source src="/reel-test.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
