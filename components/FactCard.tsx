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
  topic: string;
};

type Emoji = {
  value: string
  emoji: string
}

const emojiButtons: Emoji[] = [
  { value: "love", emoji: "❤️" },
  { value: "laugh", emoji: "😂" },
  { value: "sad", emoji: "😢" },
  { value: "interesting", emoji: "🔥" },
];

function FactCard() {
  const [emoji, setEmoji] = useState<Emoji | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fact, setFact] = useState<Fact | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const {
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
        const data = await response.json();
        if (typeof data === 'object') {
          setFact({
            statement: data.fact || "No fact provided",
            topic: data.topic || "unknown"
          });
        } else {
          throw new Error('Invalid fact format received');
        }
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setFact({
          statement: errorData.error || "No interesting fact found. Please try again.",
          topic: "unknown",
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFact({
        statement: error instanceof Error ? error.message : "An error occurred. Please try again.",
        topic: "unknown",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fact) {
      trackEvent("fact.view", {
        fact_statement: fact.statement,
        fact_topic: fact.topic,
      });
    }
  }, [fact]);

  const handleEmojiClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    const button = e.target as HTMLButtonElement;
    const emoji = emojiButtons.find(e => e.value === button.value)
    setEmoji(emoji);

    if (fact) {
      trackEvent("reaction.select", {
        reaction_type: button.value,
        fact_statement: fact.statement,
        fact_topic: fact.topic,
      });
    }

    // Fetch a new fact to show next
    fetchFact();

    // If the user has seen the tutorial banner, then hide it
    if (showTutorialBanner) {
      setShowTutorialBanner(false);
    }
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
          factsViewedCount={viewedFactsCount}
          onUnlockedFactsCountUpdated={handleUnlockedFactsCountUpdated}
        />
      ) : null}
      <div className="flex flex-row mx-auto mb-2 w-full justify-end">
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
              <div className="text-4xl mb-4 text-center sm:text-left">
                {emoji.emoji}
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
              {emojiButtons.map((button) => (
                <button
                  key={button.value}
                  className="emoji-button text-4xl rounded-md p-2 transition duration-200 ease-in-out"
                  value={button.value}
                  onClick={handleEmojiClick}
                  style={{ minWidth: "56px", minHeight: "56px" }}
                >
                  {button.emoji}
                </button>
              ))}
            </div>
          </>
        )}
        {!isLoading && showTutorialBanner && <TutorialBanner />}
      </div>
    </div>
  );
}

export default FactCard;
