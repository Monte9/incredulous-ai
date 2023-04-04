import React, { useEffect } from "react";
import useAnalytics from "../shared/Analytics";

function UpgradeModal(props) {
  const { dismissModal, streakCount, factsViewedCount } = props;
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("upgrade.view", {
      streak: streakCount,
      factsViewed: factsViewedCount,
    });
  }, []);

  function closeModal() {
    trackEvent("upgrade.close", {
      streak: streakCount,
      factsViewed: factsViewedCount,
    });

    dismissModal();
  }

  function handleBuy(buyFactsCount, price) {
    trackEvent("buy.action", {
      buyFacts: buyFactsCount,
      price: price,
    });
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
            className="stop-propagation bg-background-light dark:bg-background-dark rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            style={{ height: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-background-light dark:bg-background-dark px-4 py-3 border-b border-gray-400 dark:border-gray-600 flex flex-row justify-between"
              style={{ height: "53px" }}
            >
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
            <div
              className="px-4 py-3 flex flex-col"
              style={{ height: "347px" }}
            >
              <p className="text-sm leading-5 mt-2">
                You have run out of free facts. Consider upgrading to continue
                your experience!
              </p>
              <p className="text-sm leading-5 mt-4">
                Alternatively, come back tomorrow for more free facts.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-end sm:items-end sm:justify-between h-full">
                <button
                  onClick={() => handleBuy(50, 0.99)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out mb-2 h-auto sm:h-12 active:animate-scaleBounce"
                >
                  Buy 50 facts for $0.99
                </button>
                <button
                  onClick={() => handleBuy(200, 1.99)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-light dark:bg-primary-dark focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out mb-2 h-auto sm:h-12 active:animate-scaleBounce"
                >
                  Buy 200 facts for $1.99
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
