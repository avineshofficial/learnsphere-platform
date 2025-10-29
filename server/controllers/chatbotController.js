const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure the API key is loaded from the .env file.
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
}

// Initialize the Google Generative AI client with the API key.
const genAI = new GoogleGenerativeAI(apiKey);

// @desc    Generate a response from Gemini
// @route   POST /api/chatbot/generate
// @access  Private
exports.generateResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }
        
        // --- THIS IS THE FINAL, DEFINITIVE FIX ---
        // We are switching to the 'gemini-1.0-pro' model.
        // This is the most stable, globally available version and is the most likely to be
        // accessible with a standard API key from AI Studio.
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        if (!response) {
            throw new Error("The AI service did not return a valid response.");
        }
        
        const text = response.text();
        res.json({ response: text });

    } catch (error) {
        console.error("CRITICAL ERROR generating response from Gemini:");
        
        if (error.message && error.message.includes('API key not valid')) {
            console.error("---> The GEMINI_API_KEY is invalid.");
            return res.status(500).json({ message: "The server's AI API key is invalid." });
        } else if (error.message && (error.message.includes('404') || error.message.includes('not found'))) {
            console.error(`---> The model name is not available for your API key. This can be a regional issue.`);
            return res.status(500).json({ message: "The requested AI model was not found." });
        }

        console.error(error);
        res.status(500).json({ message: "An unexpected error occurred while communicating with the AI service." });
    }
};