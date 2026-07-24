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

  if (!response.text) {
    throw new Error("Empty response from Gemini");
  }

  return response.text;
}

export async function streamGeminiContent(
  apiKey: string | undefined,
  prompt: string,
  onChunk: (chunkText: string) => void,
  model = "gemini-2.5-flash"
): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  if (!response.body) {
    throw new Error("ReadableStream not supported in browser environment");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const jsonStr = trimmed.slice(6);
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const chunkText =
            parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunkText) {
            fullText += chunkText;
            onChunk(chunkText);
          }
        } catch {
          // Ignore incomplete JSON line
        }
      }
    }
  }

  if (buffer.trim().startsWith("data: ")) {
    try {
      const jsonStr = buffer.trim().slice(6);
      const parsed = JSON.parse(jsonStr);
      const chunkText =
        parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText);
      }
    } catch {
      // Ignore incomplete JSON line
    }
  }

  return fullText;
}


