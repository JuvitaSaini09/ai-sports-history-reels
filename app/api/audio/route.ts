// import { generateScript } from "@/lib/ai";
// import { generateVoiceFromScript } from "@/lib/murf";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const celebrity = "Virat Kohli"; // 🔁 You can make this dynamic later

//   const script = await generateScript(celebrity); // 🪄 Generate using Gemini
//   const audioUrl = await generateVoiceFromScript(script); // 🎙️ Get audio from Murf

//   return NextResponse.json({ celebrity, script, audioUrl }); // 🎯 Serve it all
// }

// app/api/reel/route.ts
import { generateScript } from "@/lib/ai";
import { generateVoiceFromScript } from "@/lib/murf";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🎯 Step 1: Generate script and celebrity name
    const { celebrity, script } = await generateScript();

    // 🔊 Step 2: Generate voice audio from script
    const audioUrl = await generateVoiceFromScript(script);

    // 📦 Final response
    return NextResponse.json({
      celebrity,
      script,
      audioUrl,
    });
  } catch (error: any) {
    console.error("🔥 Error generating reel:", error.message || error);
    return NextResponse.json(
      { error: "Something went wrong while generating the reel." },
      { status: 500 }
    );
  }
}
