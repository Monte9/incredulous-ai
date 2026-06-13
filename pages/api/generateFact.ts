import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import * as dotenv from "dotenv";
import { FACT_TOPICS } from "../../shared/Constants";
import { factSystemMessage } from "../../prompts/fact_system";
import { factUserMessage } from "../../prompts/fact_user";

// Get your environment variables
dotenv.config();

// Create OpenAI client with error handling
let openai: OpenAI;
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured in environment variables");
  }

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error("Failed to initialize OpenAI client:", error);
}

// --- Best-effort, per-IP rate limiting -------------------------------------
// This endpoint calls a paid LLM, so an unauthenticated, unthrottled handler
// lets anyone run up the OpenAI bill. The in-memory limiter below is a cheap
// first line of defense. NOTE: serverless instances do not share memory, so
// for production-grade limiting back this with a shared store (e.g. Upstash
// Redis or Vercel KV).
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // requests per window per IP
const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Opportunistically prune expired entries so the map can't grow unbounded.
  if (ipHits.size > 10_000) {
    ipHits.forEach((value, key) => {
      if (now > value.resetAt) ipHits.delete(key);
    });
  }

  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  entry.count += 1;
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (isRateLimited(getClientIp(req))) {
    res.status(429).json({ error: "Too many requests. Please slow down." });
    return;
  }

  // Check if OpenAI client is properly initialized
  if (!openai) {
    res.status(500).json({ error: "OpenAI not configured" });
    return;
  }

  // Only allow topics from our fixed allowlist. The topic is interpolated into
  // the LLM system prompt, so accepting arbitrary user input here would be a
  // prompt-injection vector (and turn the endpoint into a free LLM proxy).
  const { topics } = req.query;
  const topicsParam = Array.isArray(topics) ? topics.join(",") : topics;
  const requestedTopics =
    typeof topicsParam === "string" ? topicsParam.split(",") : [];
  const allowedTopics = requestedTopics.filter((t) => FACT_TOPICS.includes(t));
  const pool = allowedTopics.length > 0 ? allowedTopics : FACT_TOPICS;
  const topic = pool[Math.floor(Math.random() * pool.length)];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: factSystemMessage(topic),
        },
        {
          role: "user",
          content: factUserMessage(),
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    if (completion.choices && completion.choices.length > 0) {
      const data = completion.choices[0].message.content.trim();
      try {
        const fact = JSON.parse(data);
        res.json({ ...fact });
      } catch (parseError) {
        console.error("Failed to parse fact JSON:", parseError);
        res.status(400).json({ error: "Invalid fact format returned" });
      }
    } else {
      res
        .status(400)
        .json({ error: "No interesting fact found. Please try again." });
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({
      error: "Failed to generate fact",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
