import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import useAnalytics from "../shared/Analytics";

function PreferencesModal(props) {
  const { dismissModal } = props;
  const { theme, setTheme } = useTheme();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("preferences.view", {});
  }, []);

  function closeModal() {
    trackEvent("preferences.close", {});
    dismissModal();
  }

  function toggleDarkMode() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    trackEvent("darkmode.toggle", {
      oldTheme: theme,
      newTheme,
    });
  }

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50"
      id="preferencesModal"
      onClick={closeModal}
    >
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="stop-propagation bg-background-light dark:bg-background-dark overflow-hidden sm:rounded-xl drop-shadow-lg transform w-screen sm:max-w-xl sm:w-full h-screen sm:max-h-lg sm:h-full justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
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
                Preferences
              </h2>
              <button
                onClick={closeModal}
                className="text-bright-light dark:text-bright-dark"
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
              <div className="w-full flex items-center justify-between">
                <span className="font-semibold">Dark mode</span>
                <label
                  htmlFor="toggle"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="sr-only"
                      onChange={toggleDarkMode}
                      checked={theme === "dark"}
                    />
                    <div className="block bg-gray-400 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ${
                        theme === "dark" ? "transform translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreferencesModal;
