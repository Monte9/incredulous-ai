import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
import useFactsState from "./useFactsState";
import { IS_DEVELOPMENT } from "../shared/Constants";

function useAnalytics() {
  const { userId } = useFactsState();

  useEffect(() => {
    try {
      // Setup Mixpanel logging
      mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN, {
        debug: IS_DEVELOPMENT,
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

      if (IS_DEVELOPMENT) {
        console.info(
          "%c[Analytics] %c%s",
          "color:green",
          "color:orange",
          userId,
          utmParams
        );
      }

      // Set user properties, including the username
      mixpanel.people.set({
        $name: userId,
        $app: process.env.APP_NAME,
        utmParams,
      });
    } catch (error) {
      console.error("Error initializing Mixpanel analytics:", error?.message);
    }
  }, []);

  function trackEvent(eventName, tags) {
    const allTags = {
      enviroment: process.env.APP_ENV,
      app: process.env.APP_NAME,
      ...tags,
    };

    try {
      mixpanel.track(eventName, allTags);
    } catch (error) {
      console.error(`Unable to track ${eventName} event`, error?.message)
    }

    if (IS_DEVELOPMENT) {
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
