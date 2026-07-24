// src/services/gemini.service.ts

export async function generateGeminiContent(
  _apiKey?: string | undefined,
  prompt?: string,
  model = "gemini-2.5-flash"
): Promise<string> {
  // Support overload if called as generateGeminiContent(prompt, model)
  const actualPrompt = typeof _apiKey === "string" && prompt === undefined ? _apiKey : prompt;
  if (!actualPrompt) {
    throw new Error("Prompt is required");
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: actualPrompt,
      stream: false,
      model,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  if (!data?.text) {
    throw new Error("Empty response from Gemini");
  }

  return data.text;
}

export async function streamGeminiContent(
  _apiKey: string | undefined,
  prompt: string,
  onChunk: (chunkText: string) => void,
  model = "gemini-2.5-flash"
): Promise<string> {
  const actualPrompt = typeof _apiKey === "string" && typeof prompt !== "string" ? _apiKey : prompt;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: actualPrompt,
      stream: true,
      model,
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
      } else if (trimmed && !trimmed.startsWith("data:")) {
        // Handle direct text chunk stream
        fullText += line;
        onChunk(line);
      }
    }
  }

  if (buffer.trim()) {
    const trimmed = buffer.trim();
    if (trimmed.startsWith("data: ")) {
      try {
        const jsonStr = trimmed.slice(6);
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
    } else {
      fullText += buffer;
      onChunk(buffer);
    }
  }

  return fullText;
}
