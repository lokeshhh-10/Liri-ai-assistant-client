// src/config/geminiKeys.ts

const GEMINI_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY1,
  import.meta.env.VITE_GEMINI_API_KEY2,
  import.meta.env.VITE_GEMINI_API_KEY3,
  import.meta.env.VITE_GEMINI_API_KEY4,
  import.meta.env.VITE_GEMINI_API_KEY5,
  import.meta.env.VITE_GEMINI_API_KEY6,
].filter(Boolean) as string[];

if (GEMINI_KEYS.length === 0) {
  throw new Error("❌ No Gemini API keys found in Vite env variables");
}

let currentKeyIndex = Math.floor(Math.random() * GEMINI_KEYS.length);

export function getNextGeminiKey(): string {
  const key = GEMINI_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  console.log(`Using Gemini API Key Index: ${currentKeyIndex}`);
  return key;
}

export const MAX_GEMINI_ATTEMPTS = GEMINI_KEYS.length;
