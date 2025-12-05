import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing VITE_GEMINI_API_KEY. Please set it in your .env file."
  );
}

const ai = new GoogleGenAI({ apiKey });

const RATE_LIMIT_ERROR_NAME = "RateLimitError";
const THROTTLE_ERROR_NAME = "ClientThrottleError";
const MIN_REQUEST_INTERVAL_MS = 500;

const MODEL_NAME = "gemini-2.5-flash";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const chat = ai.chats.create({
  model: MODEL_NAME,
  config: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    safetySettings,
  },
});

let lastRequestTimestamp = 0;

const buildRateLimitError = () => {
  const error = new Error(
    "Gemini rate limit exceeded. Please wait a moment and try again."
  );
  error.name = RATE_LIMIT_ERROR_NAME;
  return error;
};

const buildClientThrottleError = () => {
  const error = new Error("Please slow down. Try again in a second.");
  error.name = THROTTLE_ERROR_NAME;
  return error;
};

export const chatSession = {
  async sendMessage(prompt: string) {
    const now = Date.now();
    if (now - lastRequestTimestamp < MIN_REQUEST_INTERVAL_MS) {
      throw buildClientThrottleError();
    }

    try {
      lastRequestTimestamp = now;
      const response = await chat.sendMessage({
        message: prompt,
      });

      return {
        response: {
          text: () => response.text ?? "",
        },
      };
    } catch (error) {
      const status =
        (error as { status?: number })?.status ??
        (error as { response?: { status?: number } })?.response?.status ??
        (error as { cause?: { status?: number } })?.cause?.status;

      if (status === 429) {
        throw buildRateLimitError();
      }

      throw error;
    }
  },
};
