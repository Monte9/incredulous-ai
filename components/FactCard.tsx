import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import TutorialBanner from "./TutorialBanner";
import Badge from "./TopicBadge";
import { FREE_FACTS_COUNT } from "../shared/Constants";
import UpgradeModal from "./UpgradeModal";

function FactCard() {
  const [emoji, setEmoji] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fact, setFact] = useState("");
  const [showTutorialBanner, setShowTutorialBanner] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [viewedFactsCount, setViewedFactsCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  useEffect(() => {
    const showBanner = localStorage.getItem("showTutorialBanner");
    if (showBanner === "false") {
      setShowTutorialBanner(false);
    } else {
      setShowTutorialBanner(true);
    }

    const viewedFactsCount = parseInt(localStorage.getItem("viewedFactsCount"));
    if (viewedFactsCount) {
      const parsedViewedFactsCount = isNaN(viewedFactsCount)
        ? 1
        : viewedFactsCount;
      setViewedFactsCount(parsedViewedFactsCount);
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

  const handleEmojiClick = (e) => {
    // If the user doesn't have any more free facts, then show them the upgrade modal
    if (viewedFactsCount > FREE_FACTS_COUNT) {
      setShowUpgradeModal(true);
      return;
    }

    setEmoji(e.target.value);
    fetchFact();

    const showBanner = localStorage.getItem("showTutorialBanner");
    if (!showBanner) {
      localStorage.setItem("showTutorialBanner", "false");
      setShowTutorialBanner(false);
    }

    // Update the viewed facts count in local storage
    const factsCount = parseInt(localStorage.getItem("viewedFactsCount"));
    const newFactsCount = isNaN(factsCount) ? 1 : viewedFactsCount + 1;
    localStorage.setItem("viewedFactsCount", String(newFactsCount));
    setViewedFactsCount(newFactsCount);

    // Update the streak count
    setStreakCount(streakCount + 1);
  };

  return (
    <div className="flex flex-col w-full sm:max-w-xl p-6 mx-auto">
      {showUpgradeModal ? (
        <UpgradeModal dismissModal={() => setShowUpgradeModal(false)} />
      ) : null}
      <div className="flex flex-row mx-auto mb-2 w-full justify-between">
        <div className="text-sm font-bold">Streak: {streakCount} 🔥</div>
        <div className="text-sm font-bold">
          Viewed Facts: {viewedFactsCount}/{FREE_FACTS_COUNT}
        </div>
      </div>
      <div
        className="flex flex-col sm:max-w-xl rounded-lg shadow-lg"
        style={{
          minHeight: "350px",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            {emoji ? (
              <div>You found that {emoji}.</div>
            ) : (
              <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 w-fit">
              <Badge />
            </div>
            <div className="text-lg mb-4 text-center sm:text-left">{fact}</div>
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
