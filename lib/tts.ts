import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { Readable } from "stream"; // Node.js stream type

const polly = new PollyClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateVoiceFromScript(text: string): Promise<Buffer> {
  const command = new SynthesizeSpeechCommand({
    OutputFormat: "mp3",
    Text: text,
    VoiceId: "Joanna",
    TextType: "text",
  });

  const response = await polly.send(command);

  const audioStream = response.AudioStream;

  if (!audioStream || !(audioStream instanceof Readable)) {
    throw new Error("Invalid audio stream returned from Polly.");
  }

  const stream = audioStream as NodeJS.ReadableStream;

  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}
