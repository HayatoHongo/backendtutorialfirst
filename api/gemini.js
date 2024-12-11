const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;

module.exports = async (req, res) => {
  console.log('Incoming Request Method:', req.method); // リクエストメソッドをログ出力

  if (req.method !== 'POST') {
    console.error('Invalid Method:', req.method);
    return res.status(405).json({
      error: 'Method not allowed. Use POST.',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  console.log('Received Request Body:', req.body); // リクエストボディをログ出力
  const { input } = req.body;

  if (!input) {
    console.error('Missing Input Data');
    return res.status(400).json({
      error: 'Input data is required.',
      code: 'MISSING_INPUT',
    });
  }

  console.log('Using API Key:', API_KEY); // APIキーをログ出力（注意: 本番環境では表示しない方が良い）

  try {
    const requestBody = {
      contents: [{ parts: [{ text: input }] }],
    };

    console.log('Sending Request to Gemini API:', JSON.stringify(requestBody, null, 2)); // 送信するデータをログ出力

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      requestBody,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log('Received Response from Gemini API:', response.data); // 受け取ったレスポンスをログ出力

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      // APIからエラー応答が返された場合
      console.error('Gemini API Error Response:', error.response.data);
      res.status(error.response.status).json({
        error: error.response.data?.error?.message || 'API error occurred.',
        code: 'API_ERROR',
        details: error.response.data,
      });
    } else if (error.request) {
      // リクエストは送られたがレスポンスがない場合
      console.error('No Response from Gemini API:', error.request);
      res.status(504).json({
        error: 'No response received from API.',
        code: 'NO_RESPONSE',
      });
    } else {
      // その他のエラー
      console.error('Unexpected Error:', error.message);
      res.status(500).json({
        error: 'Internal server error.',
        code: 'INTERNAL_ERROR',
        details: error.message,
      });
    }
  }
};
