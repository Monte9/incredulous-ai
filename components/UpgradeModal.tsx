import React, { useEffect, useState } from "react";
import validator from "email-validator";
import useAnalytics from "../hooks/useAnalytics";
import useFactsState from "../hooks/useFactsState";
import useAddToAirtable from "../hooks/useAddToAirtable";

function UpgradeModal(props) {
  const {
    dismissModal,
    streakCount,
    factsViewedCount,
    onUnlockedFactsCountUpdated,
  } = props;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const { trackEvent } = useAnalytics();
  const { userId, isFreeVersionUnlocked, setIsFreeVersionUnlocked } =
    useFactsState();
  const { addToAirtable } = useAddToAirtable();

  useEffect(() => {
    trackEvent("upgrade.view", {
      streak: streakCount,
      factsViewed: factsViewedCount,
    });
  }, []);

  async function handleEmailSubmit() {
    if (email.length < 5) {
      setEmailError("Email is too short");
    } else if (!validator.validate(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(null);

      // Set the free version as unlocked
      setIsFreeVersionUnlocked(true);

      // Call the callback function after updating the unlockedFactsCount
      if (typeof onUnlockedFactsCountUpdated === "function") {
        onUnlockedFactsCountUpdated();
      }

      // Add email and userId to Airtable using the custom hook
      await addToAirtable(email, userId);

      // Track Analytics event
      trackEvent("buy.action", {
        email,
        facts: "50",
        price: "free",
        streak: streakCount,
        factsViewed: factsViewedCount,
      });
    }
  }

  function handleBuy() {
    trackEvent("buy.action", {
      facts: "unlimited",
      price: "1.99",
      streak: streakCount,
      factsViewed: factsViewedCount,
    });
  }

  function closeModal() {
    trackEvent("upgrade.close", {
      streak: streakCount,
      factsViewed: factsViewedCount,
    });

    dismissModal();
  }

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50"
      id="upgradeModal"
      onClick={closeModal}
    >
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div
            className="stop-propagation bg-background-light dark:bg-background-dark rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full justify-center py-2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background-light dark:bg-background-dark px-4 pt-1 pb-3 border-b border-gray-400 dark:border-gray-600 flex flex-row justify-between">
              <h2
                className="text-xl font-bold text-bright-light dark:text-bright-dark"
                id="modal-headline"
              >
                Upgrade
              </h2>
              <button
                onClick={closeModal}
                className="text-bright-light dark:text-bright-dark transition duration-200 ease-in-out"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-3 flex flex-col">
              <p className="text-sm leading-5 mt-2">
                {isFreeVersionUnlocked
                  ? "You've unlocked 50 new facts. Enjoy!"
                  : "You have run out of free facts. Consider upgrading to continue your experience!"}
              </p>
              {isFreeVersionUnlocked ? (
                <div className="mt-8 text-xl text-center font-bold text-bright-light dark:text-bright-dark">
                  You have unlocked the free version!
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mt-8">FREE</h3>
                  <p className="text-sm leading-5 mt-2">
                    Enter your email to unlock 50 facts.
                  </p>
                  <div className="mt-2 flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`flex-grow border ${
                        emailError &&
                        "border-primary-light dark:border-primary-dark"
                      } rounded-md px-2 py-1 text-sm focus:outline-none`}
                      placeholder="Email"
                    />
                    <button
                      onClick={handleEmailSubmit}
                      disabled={email?.length < 1}
                      className="ml-2 px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out active:animate-scaleBounce disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:pointer-events-none"
                    >
                      Submit
                    </button>
                  </div>
                  {/* Email Error */}
                  {emailError && (
                    <div className="mt-2 text-sm text-primary-light dark:text-primary-dark">
                      {emailError}
                    </div>
                  )}
                </div>
              )}

              {/* OR Divider */}
              <div className="my-4 flex items-center">
                <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
                <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">
                  OR
                </span>
                <div className="border-t border-gray-300 dark:border-gray-600 flex-grow"></div>
              </div>

              {/* PAID Section */}
              <h3 className="text-lg font-semibold">PAID</h3>
              <p className="text-sm leading-5 mt-2">
                Unlock the full version and get access to unlimited facts
                forever.
              </p>
              <button
                onClick={handleBuy}
                className="mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out h-auto active:animate-scaleBounce"
              >
                Unlimited facts for $1.99
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
