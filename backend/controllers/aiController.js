const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.pricingSuggestion = async (req, res) => {
  const { productName, category } = req.body;
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Suggest a competitive price for ${productName} in ${category} category.`,
      max_tokens: 50
    });
    res.json({ suggestion: response.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productOptimization = async (req, res) => {
  const { description } = req.body;
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Optimize this product description for SEO: ${description}`,
      max_tokens: 100
    });
    res.json({ optimized: response.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recommendations = async (req, res) => {
  const { userHistory } = req.body;
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Based on ${userHistory}, recommend similar products.`,
      max_tokens: 100
    });
    res.json({ recommendations: response.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};