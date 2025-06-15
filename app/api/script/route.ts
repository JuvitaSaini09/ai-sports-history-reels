import { generateScript } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { celebrity, script } = await generateScript();

    return NextResponse.json({
      celebrity,
      script,
    });
  } catch (err) {
    console.error("🔥 API error:", err);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
