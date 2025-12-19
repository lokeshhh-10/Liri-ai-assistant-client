// src/services/gemini.service.ts
import { GoogleGenAI } from "@google/genai";

export async function generateGeminiContent(
  apiKey: string | undefined,
  prompt: string,
  model = "gemini-2.5-flash"
): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}
