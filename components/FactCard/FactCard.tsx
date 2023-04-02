import React, { useState, useEffect } from "react";

function FactCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [fact, setFact] = useState("");

  useEffect(() => {
    fetchFact();
  }, []);

  const fetchFact = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generateFact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFact(data.fact);
      } else {
        setFact("No interesting fact found. Please try again.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setFact("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? <p>Loading...</p> : <h3>{fact}</h3>}
      <button onClick={fetchFact}>Fetch Another Fact</button>
    </div>
  );
}

export default FactCard;
