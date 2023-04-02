import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import TutorialBanner from "./TutorialBanner";
import Badge from "./TopicBadge";

function FactCard() {
  const [emoji, setEmoji] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fact, setFact] = useState("");
  const [showTutorialBanner, setShowTutorialBanner] = useState(false);

  useEffect(() => {
    const showBanner = localStorage.getItem("showTutorialBanner");
    if (showBanner === "false") {
      setShowTutorialBanner(false);
    } else {
      setShowTutorialBanner(true);
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
    setEmoji(e.target.value);
    fetchFact();

    const showBanner = localStorage.getItem("showTutorialBanner");
    if (!showBanner) {
      localStorage.setItem("showTutorialBanner", "false");
      setShowTutorialBanner(false);
    }
  };

  return (
    <div className="rounded-lg shadow-lg p-6 mx-auto sm:max-w-xl flex-col">
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
  );
}

export default FactCard;
