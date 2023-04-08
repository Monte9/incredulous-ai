import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import TutorialBanner from "./TutorialBanner";
import Badge from "./TopicBadge";
import { FACT_TOPICS, FREE_FACTS_COUNT } from "../shared/Constants";
import UpgradeModal from "./UpgradeModal";
import useAnalytics from "../hooks/useAnalytics";
import useFactsState from "../hooks/useFactsState";

type Fact = {
  statement: string;
  subtopics: string[];
  topic: string;
};

function FactCard() {
  const [emoji, setEmoji] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fact, setFact] = useState<Fact | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const {
    streakCount,
    setStreakCount,
    showTutorialBanner,
    setShowTutorialBanner,
    viewedFactsCount,
    setViewedFactsCount,
    unlockedFactsCount,
    setUnlockedFactsCount,
  } = useFactsState();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    fetchFact();
  }, []);

  const fetchFact = async () => {
    setIsLoading(true);

    // Filter the fact by selected topics
    const topicsString = FACT_TOPICS.join(",");

    try {
      const response = await fetch(`/api/generateFact?topics=${topicsString}`, {
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
          subtopics: [],
          topic: "unknown",
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setFact({
        statement: "An error occurred. Please try again.",
        subtopics: [],
        topic: "unknown",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fact) {
      trackEvent("fact.view", {
        fact_statement: fact.statement,
        fact_subtopics: fact.subtopics,
        fact_topic: fact.topic,
      });
    }
  }, [fact]);

  const handleEmojiClick = (e) => {
    // Get the updated facts viewed count
    const newFactsCount = viewedFactsCount + 1;

    // If the user doesn't have any more free facts, then show them the upgrade modal
    if (newFactsCount > unlockedFactsCount) {
      setShowUpgradeModal(true);
      return;
    }

    // Update the facts viewed count in local storage
    setViewedFactsCount(newFactsCount);

    // Set the emoji for user feedback
    setEmoji(e.target.value);
    trackEvent("reaction.select", {
      reaction_type: e.target.value,
      fact_statement: fact.statement,
      fact_subtopics: fact.subtopics,
      fact_topic: fact.topic,
    });

    // Fetch a new fact to show next
    fetchFact();

    // If the user has seen the tutorial banner, then hide it
    if (showTutorialBanner) {
      setShowTutorialBanner(false);
    }

    // Update the streak count
    setStreakCount(streakCount + 1);
  };

  const handleDismissUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  // Add the callback function
  const handleUnlockedFactsCountUpdated = () => {
    // Set the facts count for the free version
    setUnlockedFactsCount(FREE_FACTS_COUNT);
  };

  return (
    <div className="flex flex-col w-full sm:max-w-xl px-5 mx-auto">
      {showUpgradeModal ? (
        <UpgradeModal
          dismissModal={handleDismissUpgradeModal}
          streakCount={streakCount}
          factsViewedCount={viewedFactsCount}
          onUnlockedFactsCountUpdated={handleUnlockedFactsCountUpdated}
        />
      ) : null}
      <div className="flex flex-row mx-auto mb-2 w-full justify-between">
        <div className="text-sm">Streak: {streakCount} 🔥</div>
        <div className="text-sm">
          Facts Viewed: {viewedFactsCount}/{unlockedFactsCount}
        </div>
      </div>
      <div
        className="flex flex-col sm:max-w-xl rounded-lg my-2 sm:my-0"
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
              <Badge topic={fact.topic} />
            </div>
            <div className="text-md mb-4 text-center sm:text-left">
              {fact.statement}
            </div>
            <div className="flex justify-between mb-4 px-4 sm:px-12">
              <button
                className="emoji-button text-4xl rounded-md p-2 transition duration-200 ease-in-out"
                value="mind-blowing"
                onClick={handleEmojiClick}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                🤯
              </button>
              <button
                className="emoji-button text-4xl rounded-md p-2 transition duration-200 ease-in-out"
                value="interesting"
                onClick={handleEmojiClick}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                🤔
              </button>
              <button
                className="emoji-button text-4xl rounded-md p-2 transition duration-200 ease-in-out"
                value="heart-warming"
                onClick={handleEmojiClick}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                💜
              </button>
              <button
                className="emoji-button text-4xl rounded-md p-2 transition duration-200 ease-in-out"
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
