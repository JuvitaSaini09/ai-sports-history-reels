// // lib/murf.ts
// export async function generateVoiceFromScript(text: string): Promise<string> {
//   const response = await fetch("https://api.murf.ai/v1/speech/generate", {
//     method: "POST",
//     headers: {
//       "Api-Key": process.env.MURF_API_KEY!,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       text,
//       voiceId: "en-US-natalie", // 🔊 Pick any voice you like!
//     }),
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error("Murf API Error: " + errText);
//   }

//   const data = await response.json();
//   console.log("🧠:::::::::::::::::::::::: Murf full response:", data);

//   if (!data.audioFile) {
//     throw new Error("No audio file returned from Murf.");
//   }

//   return data.audioFile; // ✅ This is your final audio file URL
// }

// lib/murf.ts

type MurfResponse = {
  audioUrl: string;
  audioLengthInSeconds: number;
};

export async function generateVoiceFromScript(
  text: string
): Promise<MurfResponse> {
  const response = await fetch("https://api.murf.ai/v1/speech/generate", {
    method: "POST",
    headers: {
      "Api-Key": process.env.MURF_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voiceId: "en-US-natalie",
    }),
  });

  const data = await response.json();

  if (!data.audioFile) {
    throw new Error("No audio file returned from Murf.");
  }

  return {
    audioUrl: data.audioFile,
    audioLengthInSeconds: data.audioLengthInSeconds,
  };
}
