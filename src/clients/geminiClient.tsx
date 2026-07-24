// src/clients/geminiClient.ts
import { getNextGeminiKey, MAX_GEMINI_ATTEMPTS } from "../config/geminiKeys";
import { generateGeminiContent, streamGeminiContent } from "../services/gemini.service";

export async function sendGeminiRequest(prompt: string): Promise<string> {
  let attempts = 0;

  while (attempts < MAX_GEMINI_ATTEMPTS) {
    const apiKey = getNextGeminiKey();
    attempts++;

    try {
      return await generateGeminiContent(apiKey, prompt);
    } catch (error: any) {
      console.warn(
        `⚠️ Gemini attempt ${attempts}/${MAX_GEMINI_ATTEMPTS} failed`,
        error?.message
      );

      if (
        error?.message?.includes("429") ||
        error?.message?.includes("RESOURCE_EXHAUSTED") ||
        error?.message?.includes("UNAVAILABLE")
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("❌ All Gemini API keys failed");
}

export async function streamGeminiRequest(
  prompt: string,
  onChunk: (chunkText: string) => void
): Promise<string> {
  let attempts = 0;

  while (attempts < MAX_GEMINI_ATTEMPTS) {
    const apiKey = getNextGeminiKey();
    attempts++;
    let hasReceivedChunks = false;

    try {
      return await streamGeminiContent(apiKey, prompt, (text) => {
        hasReceivedChunks = true;
        onChunk(text);
      });
    } catch (error: any) {
      console.warn(
        `⚠️ Gemini streaming attempt ${attempts}/${MAX_GEMINI_ATTEMPTS} failed`,
        error?.message
      );

      // If we haven't sent any chunks yet, we can safely try another API key
      if (
        !hasReceivedChunks &&
        (error?.message?.includes("429") ||
          error?.message?.includes("RESOURCE_EXHAUSTED") ||
          error?.message?.includes("UNAVAILABLE"))
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("❌ All Gemini API keys failed");
}

