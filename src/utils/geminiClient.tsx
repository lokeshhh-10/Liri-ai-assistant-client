// src/utils/geminiClient.tsx
import { generateGeminiContent, streamGeminiContent } from "../services/gemini.service";

export async function sendGeminiRequest(promptText: string): Promise<string> {
  return await generateGeminiContent(undefined, promptText);
}

export async function streamGeminiRequest(
  promptText: string,
  onChunk: (chunkText: string) => void
): Promise<string> {
  return await streamGeminiContent(undefined, promptText, onChunk);
}
