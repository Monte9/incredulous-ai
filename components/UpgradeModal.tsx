import React from "react";

function UpgradeModal(props) {
  const { dismissModal } = props;

  return (
    <div className="fixed bottom-0 right-0 mr-4 mb-4" id="upgradeModal">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div
            className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            style={{ height: "400px" }}
          >
            <div
              className="bg-gray-800 px-4 py-3 border-b flex flex-row justify-between"
              style={{ height: "53px" }}
            >
              <h2
                className="text-xl font-bold text-gray-200"
                id="modal-headline"
              >
                Upgrade
              </h2>
              <button
                onClick={dismissModal}
                className="text-gray-400 hover:text-gray-500 transition duration-200 ease-in-out"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
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
              <div className="mt-6 flex flex-col justify-end h-full">
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-700 active:bg-blue-700 transition duration-150 ease-in-out mb-2">
                  Buy 50 facts for $0.99
                </button>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-700 active:bg-blue-700 transition duration-150 ease-in-out mb-2">
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
