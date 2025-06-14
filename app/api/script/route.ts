import { generateScript } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Missing celebrity name" },
      { status: 400 }
    );
  }

  try {
    const script = await generateScript(name);
    return NextResponse.json({ script });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
