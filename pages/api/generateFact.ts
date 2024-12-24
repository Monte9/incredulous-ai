import OpenAI from 'openai';
import * as dotenv from "dotenv";
import { FACT_TOPICS } from "../../shared/Constants";
import { factSystemMessage } from '../../prompts/fact_system';
import { factUserMessage } from '../../prompts/fact_user';

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
  let topic = FACT_TOPICS[0];
  if (topics && topics.length > 0) {
    const topicsArray = topics.split(",");
    topic = topicsArray[Math.floor(Math.random() * topicsArray.length)];
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: factSystemMessage(topic)
        },
        {
          role: "user",
          content: factUserMessage()
        }
      ],
      response_format: {
        type: 'json_object'
      }
    });

    if (completion.choices && completion.choices.length > 0) {
      const data = completion.choices[0].message.content.trim();
      try {
        const fact = JSON.parse(data);
        res.json({ ...fact });
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