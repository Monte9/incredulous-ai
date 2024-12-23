import OpenAI from 'openai';
import * as dotenv from "dotenv";
import { FACT_TOPICS } from "../../shared/Constants";

// Get your environment variables
dotenv.config();

// Create OpenAI client with error handling
let openai: OpenAI;
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured in environment variables');
  }

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Check if OpenAI client is properly initialized
  if (!openai) {
    res.status(500).json({ error: "OpenAI not configured" });
    return;
  }

  const query = req.query;
  const { topics } = query;
  let topicsString = FACT_TOPICS[0];

  if (topics && topics.length > 0) {
    const topicsArray = topics.split(",");
    if (topicsArray.length > 1) {
      let lastTopic = topicsArray.pop();
      topicsString = topicsArray.join(", ") + " or " + lastTopic + " topics";
    } else {
      topicsString = topicsArray.join(", ") + " topic";
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You generate interesting facts in JSON format."
        },
        {
          role: "user",
          content: `Tell me an interesting fact in the ${topicsString}. Return the data in the following format:
{
  "statement": "The Eiffel Tower was originally intended for Barcelona, but the project was rejected because it was considered too unsightly.",
  "subtopics": ["Eiffel Tower", "Barcelona", "architecture", "history"],
  "topic": "History"
}`
        }
      ],
      temperature: 0.7,
    });

    if (completion.choices && completion.choices.length > 0) {
      const factText = completion.choices[0].message.content.trim();
      try {
        const factJson = JSON.parse(factText);
        res.json({ fact: factJson });
      } catch (parseError) {
        console.error('Failed to parse fact JSON:', parseError);
        res.status(400).json({ error: "Invalid fact format returned" });
      }
    } else {
      res.status(400).json({ error: "No interesting fact found. Please try again." });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: "Failed to generate fact",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}