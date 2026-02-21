const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  async generateProductDescription(productName, category, features) {
    try {
      const prompt = `Generate a compelling, SEO-optimized product description for a ${productName} in the ${category} category. Key features: ${features.join(', ')}. Make it engaging and persuasive.`;
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error('AI description generation failed');
    }
  }

  async getPricingSuggestion(productName, category, marketData) {
    try {
      const prompt = `Suggest a competitive price range for ${productName} in ${category}. Market data: ${marketData}. Provide reasoning and optimal price.`;
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.5,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error('AI pricing suggestion failed');
    }
  }

  async predictSales(productData, historicalSales) {
    try {
      const prompt = `Predict sales for the next month based on product data: ${JSON.stringify(productData)} and historical sales: ${historicalSales}. Provide a numerical estimate and factors.`;
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error('AI sales prediction failed');
    }
  }

  async getRecommendations(userHistory, currentProducts) {
    try {
      const prompt = `Based on user history: ${userHistory}, recommend products from: ${currentProducts}. Suggest 5 items with reasons.`;
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.8,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error('AI recommendations failed');
    }
  }

  async generateAnalyticsInsights(data) {
    try {
      const prompt = `Analyze this sales data: ${JSON.stringify(data)}. Provide key insights, trends, and recommendations for improvement.`;
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.6,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error('AI analytics insights failed');
    }
  }
}

module.exports = new AIService();
