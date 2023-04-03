import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { FACT_CATEGORIES } from "../../shared/Constants";

// Get your environment variables
dotenv.config();

// OpenAI configuration creation
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI instance creation
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Tell me an interesting fact in the ${FACT_CATEGORIES[0]} category. Make sure this fact is unique and hasn't been generated for this user before. Return the data in the following format
  {
    "statement": "The Eiffel Tower was originally intended for Barcelona, but the project was rejected because it was considered too unsightly.",
    "topics": ["Eiffel Tower", "Barcelona", "architecture", "history"],
    "category": "History"
}
      `,
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    if (
      completion.data &&
      completion.data.choices &&
      completion.data.choices.length > 0
    ) {
      res.json({ fact: completion.data.choices[0].text.trim() });
    } else {
      res
        .status(400)
        .json({ error: "No interesting fact found. Please try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
}
