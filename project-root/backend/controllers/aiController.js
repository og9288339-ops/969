const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.pricingSuggestion = async (req, res) => {
  const { productName, category } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Suggest a competitive price for ${productName} in ${category} category.` }],
      max_tokens: 50
    });
    res.json({ suggestion: response.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productOptimization = async (req, res) => {
  const { description } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Optimize this product description for SEO: ${description}` }],
      max_tokens: 100
    });
    res.json({ optimized: response.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recommendations = async (req, res) => {
  const { userHistory } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Based on ${userHistory}, recommend similar products.` }],
      max_tokens: 100
    });
    res.json({ recommendations: response.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
