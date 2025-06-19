import Reel from "@/components/Reel";

export default function Home() {
  const reels = [
    {
      title: "Sachin Tendulkar - Legend",
      videoUrl: "/demo.mp4", // Keep demo.mp4 in /public for now
    },
  ];

  return (
    <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel, idx) => (
        <Reel key={idx} title={reel.title} videoUrl={reel.videoUrl} />
      ))}
    </main>
  );
}
