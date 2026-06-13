// useAddToAirtable.ts
//
// Sends a signup to the server-side /api/subscribe route, which performs the
// Airtable write using the secret API key. The key is NEVER exposed to the
// browser (previously it was inlined into the client bundle — see SECURITY.md).
import { useCallback } from "react";
import { IS_DEVELOPMENT } from "../shared/Constants";

const useAddToAirtable = () => {
  const addToAirtable = useCallback(async (email: string, userId: string) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save email");
      }

      if (IS_DEVELOPMENT) {
        const data = await response.json().catch(() => ({}));
        console.log("Record added successfully:", data.id);
      }
    } catch (error) {
      console.error("Error saving email:", error);
    }
  }, []);

  return { addToAirtable };
};

export default useAddToAirtable;
