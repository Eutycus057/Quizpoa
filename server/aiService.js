const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a quiz based on a topic or text input.
 * @param {string} input - Topic or text to generate quiz from.
 * @returns {Promise<Array>} - Array of 10 quiz questions.
 */
async function generateQuiz(input) {
    const prompt = `
    Generate a quiz with exactly 10 multiple-choice questions based on the following input: "${input}".
    Each question must be in JSON format with the following schema:
    {
      "question": "The question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswerIndex": index (0-3),
      "explanation": "A brief explanation of the correct answer"
    }
    Return ONLY a JSON array of these 10 objects. No other text.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful education assistant that generates quizzes in strict JSON format." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = JSON.parse(response.choices[0].message.content);
        // Handle cases where the model might wrap the array in an object (e.g., { "quiz": [...] })
        const questions = Array.isArray(content) ? content : (content.questions || content.quiz || []);

        if (questions.length === 0) {
            throw new Error("Failed to generate questions");
        }

        return questions.slice(0, 10);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}

module.exports = { generateQuiz };
