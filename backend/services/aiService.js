/**
 * @module aiService
 * @description Centralized Intelligence Hub ($10k+ Architecture)
 * @author Lead AI Architect
 * @version 3.5.0
 * @since 2024
 */

import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @description Generates personalized product recommendations using User History
 */
export const getProductRecommendations = async (userHistory, availableProducts) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      As an expert shopping assistant, analyze this User History: ${JSON.stringify(userHistory)}.
      From the following catalog: ${JSON.stringify(availableProducts)}, 
      select the top 5 products that match the user's taste.
      Return strictly a JSON array of product objects.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("AI Recommendation Engine Error:", error);
    return availableProducts.slice(0, 5); 
  }
};

/**
 * @description Context-aware chatbot for real-time customer support
 */
export const getChatResponse = async (message, context) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a luxury marketplace assistant. Use user history to personalize responses." },
        { role: "assistant", content: `User Context: ${JSON.stringify(context)}` },
        { role: "user", content: message }
      ],
      temperature: 0.6,
      stream: true,
    });
    return response;
  } catch (error) {
    throw new Error("AI Chat Assistant Service Unavailable");
  }
};

/**
 * @description Automated SEO Copywriting for Sellers
 */
export const generateProductCopy = async (title, specs) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Write a high-converting, SEO-optimized product description for '${title}' based on these specs: ${specs}. Include meta tags and keywords.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Description generation currently unavailable. Please enter manually.";
  }
};

/**
 * @description Market Sentiment Analysis & Review Summarization
 */
export const summarizeReviews = async (reviews) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Analyze customer sentiment. Identify top 3 Pros and Cons." },
        { role: "user", content: `Analyze these reviews: ${JSON.stringify(reviews)}` }
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    return "Sentiment analysis failed.";
  }
};

/**
 * @description Computer Vision for Visual Search
 */
export const processVisualSearch = async (imageBuffer) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Identify the fashion items and tech products in this image. Provide category names.",
      { inlineData: { data: imageBuffer.toString("base64"), mimeType: "image/jpeg" } }
    ]);
    return result.response.text();
  } catch (error) {
    console.error("Visual Search Error:", error);
    return null;
  }
};

export default {
  getProductRecommendations,
  getChatResponse,
  generateProductCopy,
  summarizeReviews,
  processVisualSearch
};
