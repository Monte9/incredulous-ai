import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import TutorialBanner from "./TutorialBanner";
import Badge from "./TopicBadge";
import { FREE_FACTS_COUNT } from "../shared/Constants";
import UpgradeModal from "./UpgradeModal";
import useAnalytics from "../shared/Analytics";

type Fact = {
  statement: string;
  topics: string[];
  category: string;
};

function FactCard() {
  const [emoji, setEmoji] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fact, setFact] = useState<Fact | null>(null);
  const [showTutorialBanner, setShowTutorialBanner] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [factsViewedCount, setFactsViewedCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const showBanner = localStorage.getItem("showTutorialBanner");
    if (showBanner === "false") {
      setShowTutorialBanner(false);
    } else {
      setShowTutorialBanner(true);
    }

    const factsCount = parseInt(localStorage.getItem("factsViewedCount"));
    if (factsCount) {
      const parsedFactsCount = isNaN(factsCount) ? 1 : factsCount;
      setFactsViewedCount(parsedFactsCount);
    }

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
        // Get the metadata for the fact object
        const data = await response.json();
        const fact = JSON.parse(data.fact);

        setFact(fact);
      } else {
        setFact({
          statement: "No interesting fact found. Please try again.",
          topics: [],
          category: "UNKNOWN",
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setFact({
        statement: "An error occurred. Please try again.",
        topics: [],
        category: "UNKNOWN",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fact) {
      trackEvent("fact.view", {
        fact_statement: fact.statement,
        fact_topics: fact.topics,
        fact_category: fact.category,
      });
    }
  }, [fact]);

  const handleEmojiClick = (e) => {
    // Get the count for the facts viewed so far
    const factsCount = parseInt(localStorage.getItem("factsViewedCount"));
    const newFactsCount = isNaN(factsCount) ? 1 : factsViewedCount + 1;

    // If the user doesn't have any more free facts, then show them the upgrade modal
    if (newFactsCount > FREE_FACTS_COUNT) {
      setShowUpgradeModal(true);
      return;
    }

    // Update the facts viewed count in local storage
    localStorage.setItem("factsViewedCount", String(newFactsCount));
    setFactsViewedCount(newFactsCount);

    // Set the emoji for user feedback
    setEmoji(e.target.value);
    trackEvent("reaction.select", {
      reaction_type: e.target.value,
      fact_statement: fact.statement,
      fact_topics: fact.topics,
      fact_category: fact.category,
    });

    // Fetch a new fact to show next
    fetchFact();

    const showBanner = localStorage.getItem("showTutorialBanner");
    if (!showBanner) {
      localStorage.setItem("showTutorialBanner", "false");
      setShowTutorialBanner(false);
    }

    // Update the streak count
    setStreakCount(streakCount + 1);
  };

  return (
    <div className="flex flex-col w-full sm:max-w-xl px-5 mx-auto">
      {showUpgradeModal ? (
        <UpgradeModal
          dismissModal={() => setShowUpgradeModal(false)}
          streakCount={streakCount}
          factsViewedCount={factsViewedCount}
        />
      ) : null}
      <div className="flex flex-row mx-auto mb-2 w-full justify-between">
        <div className="text-sm">Streak: {streakCount} 🔥</div>
        <div className="text-sm">
          Facts Viewed: {factsViewedCount}/{FREE_FACTS_COUNT}
        </div>
      </div>
      <div
        className="flex flex-col sm:max-w-xl rounded-lg shadow-lg my-2 sm:my-0"
        style={{
          minHeight: "350px",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            {emoji ? (
              <div className="text-md mb-4 text-center sm:text-left">
                You found that {emoji}.
              </div>
            ) : (
              <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 w-fit">
              <Badge />
            </div>
            <div className="text-md mb-4 text-center sm:text-left">
              {fact.statement}
            </div>
            <div className="flex justify-between mb-4 px-4 sm:px-12">
              <button
                className="emoji-button text-4xl rounded-md p-2 hover:bg-gray-500 transition duration-200 ease-in-out"
                value="mind-blowing"
                onClick={handleEmojiClick}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                🤯
              </button>
              <button
                className="emoji-button text-4xl rounded-md p-2 hover:bg-gray-500 transition duration-200 ease-in-out"
                value="interesting"
                onClick={handleEmojiClick}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                🤔
              </button>
              <button
                className="emoji-button text-4xl rounded-md p-2 hover:bg-gray-500 transition duration-200 ease-in-out"
                value="heart-warming"
                onClick={handleEmojiClick}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                💜
              </button>
              <button
                className="emoji-button text-4xl rounded-md p-2 hover:bg-gray-500 transition duration-200 ease-in-out"
                value="meh"
                onClick={handleEmojiClick}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                😑
              </button>
            </div>
          </>
        )}
        {!isLoading && showTutorialBanner && <TutorialBanner />}
      </div>
    </div>
  );
}

export default FactCard;
