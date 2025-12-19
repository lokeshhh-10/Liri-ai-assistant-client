// geminiClient.ts
const GEMINI_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY1,
  import.meta.env.VITE_GEMINI_API_KEY2,
  import.meta.env.VITE_GEMINI_API_KEY3,
  import.meta.env.VITE_GEMINI_API_KEY4,
  import.meta.env.VITE_GEMINI_API_KEY5,
].filter(Boolean);

/**
 * Get a random integer between min (inclusive) and max (exclusive)
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Initialize currentKeyIndex with a random starting point.
 * You can pass a range limit (default = GEMINI_KEYS.length)
 */
function initializeKeyRotation(maxRange = GEMINI_KEYS.length) {
  if (GEMINI_KEYS.length === 0) {
    throw new Error("No Gemini API keys found in environment variables.");
  }
  currentKeyIndex = getRandomInt(0, Math.min(maxRange, GEMINI_KEYS.length));
  console.info(`🔁 Starting Gemini key rotation from index: ${currentKeyIndex}`);
}

let currentKeyIndex = 0;

// Initialize rotation on module load (e.g., 1–5 random start)
initializeKeyRotation(5);

/**
 * Round-robin key rotation
 */
function getNextKey() {
  const key = GEMINI_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

/**
 * Gemini API request with automatic failover and retry
 */
export async function sendGeminiRequest(promptText: string) {
  let attempts = 0;
  const maxAttempts = GEMINI_KEYS.length;

  while (attempts < maxAttempts) {
    const apiKey = getNextKey();
    attempts++;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.warn(
          `Gemini API failed with key ${apiKey}. Attempt ${attempts}/${maxAttempts}.`,
          errorData
        );

        if (
          response.status === 429 || // too many requests
          response.status === 503 || // model overloaded
          errorData?.error?.status === "UNAVAILABLE"
        ) {
          continue; // try next key
        }

        throw new Error(errorData?.error?.message || "Gemini API error");
      }

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn’t generate a response right now."
      );
    } catch (err) {
      console.error(`Error with key:`, err);
      if (attempts >= maxAttempts) {
        throw new Error("All Gemini API keys failed. Try again later.");
      }
    }
  }
}
