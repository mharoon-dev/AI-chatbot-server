import "dotenv/config";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

app.use(express.json());
app.use(cors());

const askQuestion = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return response;
};

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await askQuestion(prompt);

    res.json({ response: response });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch response from Gemini API" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
