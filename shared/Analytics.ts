import { useState, useEffect } from "react";
import mixpanel from "mixpanel-browser";
import { v4 as uuid } from "uuid";

function useAnalytics() {
  const [mixpanelLoaded, setMixpanelLoaded] = useState(false);

  useEffect(() => {
    // Setup Mixpanel logging
    mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN, {
      debug: process.env.IS_DEV,
      ignore_dnt: true,
    });

    // Set this to a unique identifier for the user performing the event
    const userId = getUserId();
    mixpanel.identify(userId);

    setMixpanelLoaded(true);
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
    mixpanel.track(eventName, tags);

    if (process.env.IS_DEV) {
      console.log("tracked", eventName, tags);
    }
  }

  return { trackEvent };
}

export default useAnalytics;
