import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
import useFactsState from "./useFactsState";

function useAnalytics() {
  const isDevelopment = process.env.APP_ENV === "development";
  const { userId } = useFactsState();

  useEffect(() => {
    // Setup Mixpanel logging
    mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN, {
      debug: isDevelopment,
      ignore_dnt: true,
    });

    // Set this to a unique identifier for the user performing the event
    mixpanel.identify(userId);

    // Get the UTM params from the URL
    // https://incredulous.ai/?utm_source=google&utm_medium=paid-search&utm_campaign=incredulous-v1
    let utmParams = {};
    if (window.location.search.includes("utm")) {
      utmParams = Object.fromEntries(
        window.location.search
          .replace("?", "")
          .split("&")
          .filter((param) => param.startsWith("utm_"))
          .map((param) => param.split("="))
      );
    }

    console.info(
      "%c[Analytics] %c%s",
      "color:green",
      "color:orange",
      userId,
      utmParams
    );

    // Set user properties, including the username
    mixpanel.people.set({
      $name: userId,
      $app: process.env.APP_NAME,
      utmParams,
    });
  }, []);

  function trackEvent(eventName, tags) {
    const allTags = {
      enviroment: process.env.APP_ENV,
      app: process.env.APP_NAME,
      ...tags,
    };
    mixpanel.track(eventName, allTags);

    if (isDevelopment) {
      console.info(
        "%c[Analytics] %c%s",
        "color:green",
        "color:orange",
        eventName,
        allTags
      );
    }
  }

  return { trackEvent };
}

export default useAnalytics;
