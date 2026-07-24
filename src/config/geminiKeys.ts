// src/config/geminiKeys.ts

// Key rotation is now handled on the server side (/api/chat).
// This file is retained for backwards compatibility with any remaining imports.

export function getNextGeminiKey(): string {
  return "";
}

export const MAX_GEMINI_ATTEMPTS = 1;
