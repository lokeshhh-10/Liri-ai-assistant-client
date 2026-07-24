// src/clients/geminiClient.ts
import { generateGeminiContent, streamGeminiContent } from "../services/gemini.service";

export async function sendGeminiRequest(prompt: string): Promise<string> {
  return await generateGeminiContent(undefined, prompt);
}

export async function streamGeminiRequest(
  prompt: string,
  onChunk: (chunkText: string) => void
): Promise<string> {
  return await streamGeminiContent(undefined, prompt, onChunk);
}
