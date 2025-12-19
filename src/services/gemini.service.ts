// src/services/gemini.service.ts
import { GoogleGenAI } from "@google/genai";

export async function generateGeminiContent(
  apiKey: string,
  prompt: string,
  model = "gemini-2.5-flash"
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
}
