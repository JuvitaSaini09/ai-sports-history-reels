"use client";

type ReelProps = {
  title: string;
  videoUrl: string;
};

export default function Reel({ title, videoUrl }: ReelProps) {
  return (
    <div className="w-full h-screen snap-start flex flex-col items-center justify-center">
      <video
        src={videoUrl}
        controls
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-5 left-5 text-white text-xl font-semibold">
        {title}
      </div>
    </div>
  );
}
