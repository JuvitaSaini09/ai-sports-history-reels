// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function generateScript(celebrity: string): Promise<string> {
//   const prompt = `Write a short, engaging video script (2-3 lines) about the sports celebrity ${celebrity}.`;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const script = response.choices[0].message.content;
//     return script || "";
//   } catch (error) {
//     console.error("🔥 OpenAI error:", error); // 👈 log the real error
//     return "Error generating script";
//   }
// }

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateScript(celebrity: string): Promise<string> {
  const prompt = `
Write a compelling voiceover script for a short Instagram reel (15–30 seconds) about the sports celebrity ${celebrity}.

Requirements:
- Tone: Engaging and emotional
- Style: Voiceover monologue (no camera directions)
- Length: Use approximately 60–80 words to match the reel duration
- Language: Conversational and inspiring

Also include a comment at the top like "// Word count: X".
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

    let text = (await result.text) || "";

    // ✨ Clean the output
    text = text
      .replace(/^\/\/.*\n*/g, "") // Remove the "// Word count..." line
      .replace(/\(VOICEOVER.*?\)\n*/i, "") // Remove the "(VOICEOVER...)" line
      .replace(/\n+/g, " ") // Replace multiple newlines with a space
      .trim(); // Clean leading/trailing whitespace

    return text;
  } catch (error: any) {
    console.error("🔥 Gemini error:", error.message || error);
    return "Error generating script";
  }
}
