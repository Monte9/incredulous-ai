import { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  DEFAULT_FACTS_COUNT,
  LS_SHOW_TUTORIAL_BANNER,
  LS_UNLOCKED_FACTS_COUNT,
  LS_VIEWED_FACTS_COUNT,
  LS_UUID,
  LS_UNLOCKED_FREE_VERSION,
} from "../shared/Constants";
import useLocalStorage from "./useLocalStorage";

function useFactsState() {
  const [streakCount, setStreakCount] = useState(1);

  const [userId, setUserId] = useLocalStorage(LS_UUID, uuid());

  const [showTutorialBanner, setShowTutorialBanner] = useLocalStorage(
    LS_SHOW_TUTORIAL_BANNER,
    true
  );

  const [viewedFactsCount, setViewedFactsCount] = useLocalStorage(
    LS_VIEWED_FACTS_COUNT,
    1
  );

  const [unlockedFactsCount, setUnlockedFactsCount] = useLocalStorage(
    LS_UNLOCKED_FACTS_COUNT,
    DEFAULT_FACTS_COUNT
  );

  const [isFreeVersionUnlocked, setIsFreeVersionUnlocked] = useLocalStorage(
    LS_UNLOCKED_FREE_VERSION,
    false
  );

  return {
    userId,
    setUserId,
    streakCount,
    setStreakCount,
    showTutorialBanner,
    setShowTutorialBanner,
    viewedFactsCount,
    setViewedFactsCount,
    unlockedFactsCount,
    setUnlockedFactsCount,
    isFreeVersionUnlocked,
    setIsFreeVersionUnlocked,
  };
}

export default useFactsState;
