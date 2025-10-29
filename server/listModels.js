require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  console.log("Fetching available models...");
  try {
    const result = await genAI.listModels();
    console.log("Your API key has access to the following models:");
    for (const model of result.models) {
      if (model.supportedGenerationMethods.includes("generateContent")) {
        console.log(model.name);
      }
    }
  } catch (error) {
    console.error("Could not list models. Check your API key and project setup.", error.message);
  }
}

run();