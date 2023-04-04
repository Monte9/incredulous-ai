import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
import { v4 as uuid } from "uuid";

function useAnalytics() {
  const isDevelopment = process.env.APP_ENV === "development";

  useEffect(() => {
    // Setup Mixpanel logging
    mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN, {
      debug: isDevelopment,
      ignore_dnt: true,
    });

    // Set this to a unique identifier for the user performing the event
    const userId = getUserId();
    mixpanel.identify(userId);

    // Set user properties, including the username
    mixpanel.people.set({
      $name: userId,
    });
  }, []);

  function getUserId() {
    // Get the user Id from local storage
    const userId = localStorage.getItem("uuid");

    if (userId) {
      return userId;
    }

    // Generate a new UUID for the user
    const newUserId = uuid();

    // Update the user Id in local storage
    localStorage.setItem("uuid", newUserId);

    return newUserId;
  }

  function trackEvent(eventName, tags) {
    const allTags = {
      enviroment: process.env.APP_ENV,
      ...tags,
    };
    mixpanel.track(eventName, allTags);

    if (isDevelopment) {
      console.log("tracked", eventName, allTags);
    }
  }

  return { trackEvent };
}

export default useAnalytics;
