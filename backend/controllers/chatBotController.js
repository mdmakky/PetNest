const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("../config/env");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

exports.request = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a knowledgeable pet assistant. Your name is Meowster. Your role is to answer questions strictly related to pets, such as pet feeding, pet care, pet consulting, pet prices, pet health, and other pet-related topics. If a question is not related to pets, politely decline to answer and remind the user that you are specialized in pet-related topics.

Question: ${question}
Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    if (!answer) {
      return res
        .status(500)
        .json({ error: "No valid response received from AI." });
    }

    res.json({ answer });
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    res.status(500).json({ error: "Failed to process the question." });
  }
};
