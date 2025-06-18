const express = require('express');
const cors = require('cors');
const path = require('path');
const { CohereClient } = require('cohere-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Cohere
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY // Must match .env variable name
});

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle /ask route
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `You are an AI job interview bot. Answer the following interview question as a human applicant:\n\n"${question}"\n\nAnswer:`,
      maxTokens: 200,
      temperature: 0.7,
    });

    const answer = response.generations[0].text.trim();
    res.json({ answer });
  } catch (err) {
    console.error('Cohere API error:', err);
    res.status(500).json({ 
      error: 'Failed to get answer from Cohere API',
      details: err.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});