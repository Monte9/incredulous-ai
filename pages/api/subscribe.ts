import type { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";
import validator from "email-validator";

// Airtable base/table that stores signups. These identifiers are not secrets,
// but the API key that grants access to them is — and it now lives ONLY here,
// server-side. It is never sent to the browser.
const AIRTABLE_BASE_ID = "appxkqWce0l5WTsRM";
const AIRTABLE_TABLE_ID = "tbleQlmKOdrbA6BVF";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.AIRTABLE_API_KEY) {
    console.error("AIRTABLE_API_KEY is not configured in environment variables");
    res.status(500).json({ error: "Subscription is not configured" });
    return;
  }

  // Never trust the client: re-validate everything server-side.
  const { email, userId } = (req.body ?? {}) as {
    email?: unknown;
    userId?: unknown;
  };

  if (typeof email !== "string" || !validator.validate(email)) {
    res.status(400).json({ error: "A valid email is required" });
    return;
  }

  if (
    typeof userId !== "string" ||
    userId.length === 0 ||
    userId.length > 100
  ) {
    res.status(400).json({ error: "A valid userId is required" });
    return;
  }

  try {
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base(AIRTABLE_BASE_ID);

    const record = await base(AIRTABLE_TABLE_ID).create({
      UUID: userId,
      Email: email,
    });

    res.status(200).json({ id: record.getId() });
  } catch (error) {
    console.error("Error saving email to Airtable:", error);
    res.status(502).json({ error: "Failed to save subscription" });
  }
}
