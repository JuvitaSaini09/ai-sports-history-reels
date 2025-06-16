// lib/ai.ts
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateScript(): Promise<{
  celebrity: string;
  script: string;
}> {
  const prompt = `
Pick a random famous sports celebrity from any sport (like cricket, football, tennis, athletics, etc).

Now write a compelling voiceover script for a short Instagram reel (15–30 seconds) about that person.

Requirements:
- Tone: Engaging and emotional
- Style: Voiceover monologue (no camera directions)
- Length: Use approximately 60–80 words to match the reel duration
- Language: Conversational and inspiring

Also include the celebrity's name at the top in this format: "Celebrity: [Name]"
Also include a comment at the top like "// Word count: X"
`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    const text = (await result.text) || "";

    // Extract celebrity name
    const match = text.match(/Celebrity:\s*(.+)/i);
    const celebrityName = match?.[1]?.trim() ?? "Unknown Celebrity";

    // Clean the script
    const cleanedScript = text
      .replace(/^Celebrity:.*\n*/i, "")
      .replace(/^\/\/.*\n*/g, "")
      .replace(/\(VOICEOVER.*?\)\n*/i, "")
      .replace(/\n+/g, " ")
      .trim();

    return {
      celebrity: celebrityName,
      script: cleanedScript,
    };
  } catch (error: any) {
    console.error("🔥 Gemini error:", error.message || error);
    return {
      celebrity: "Unknown",
      script: "Error generating script",
    };
  }
}
