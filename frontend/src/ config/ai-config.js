/**
 * @module ai-config
 * @description God-Tier AI configuration for $10k+ enterprise marketplace
 * @author Principal AI Engineer
 * @version 3.0.0
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ AI_CONFIG_ERROR: VITE_GEMINI_API_KEY is missing in .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const generationConfig = {
  temperature: 0.3,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

export const aiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  safetySettings,
  generationConfig,
});

/**
 * @function askAI
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
export const askAI = async (prompt) => {
  try {
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("⚠️ AI_HELPER_ERROR:", error);
    return "عذراً، أنا أواجه مشكلة بسيطة في معالجة طلبك حالياً.";
  }
};

export default aiModel;
