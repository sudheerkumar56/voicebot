const { CohereClient } = require('cohere-ai');

module.exports = async (req, res) => {
  // Initialize Cohere
  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY
  });

  try {
    const { question } = req.body;

    // Call Cohere API
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `Answer as a helpful assistant: ${question}`,
      maxTokens: 150,
      temperature: 0.7
    });

    // Return response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      answer: response.generations[0].text.trim()
    });

  } catch (error) {
    console.error('Cohere API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
};