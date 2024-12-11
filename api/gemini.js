const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'Input data is required.' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: input }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || 'API request failed.' });
  }
};
