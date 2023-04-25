// useAddToAirtable.js
import { useCallback } from "react";
import Airtable from "airtable";
import { IS_DEVELOPMENT } from "../shared/Constants";

// Configure Airtable with the API key
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });

// Setup the Airtable base
const base = Airtable.base("appxkqWce0l5WTsRM");

const useAddToAirtable = () => {
  const addToAirtable = useCallback(async (email, userId) => {
    try {
      // Add the record to Airtable using the table name
      const record = await base("tbleQlmKOdrbA6BVF").create({
        UUID: userId,
        Email: email,
      });

      if (IS_DEVELOPMENT) {
        console.log("Record added successfully:", record.getId());
      }
    } catch (error) {
      console.error("Error saving email:", error);
    }
  }, []);

  return { addToAirtable };
};

export default useAddToAirtable;
