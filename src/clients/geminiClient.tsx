// src/clients/geminiClient.ts
import { getNextGeminiKey, MAX_GEMINI_ATTEMPTS } from "../config/geminiKeys";
import { generateGeminiContent } from "../services/gemini.service";

export async function sendGeminiRequest(prompt: string): Promise<string> {
  let attempts = 0;
  // let lastError: any;

  while (attempts < MAX_GEMINI_ATTEMPTS) {
    const apiKey = getNextGeminiKey();
    attempts++;

    try {
      return await generateGeminiContent(apiKey, prompt);
    } catch (error: any) {
      // lastError = error;

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
