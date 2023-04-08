import { useEffect, useState } from "react";
import { FACT_TOPICS } from "../shared/Constants";

type UseTopicsType = {
  isLoading: boolean;
  selectedTopics: string[];
  handleTopicClick: (topic: string) => void;
};

const useTopics = (): UseTopicsType => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    const topics: string[] = JSON.parse(localStorage.getItem("topics"));

    if (!topics || topics.length === 0) {
      const defaultTopic = FACT_TOPICS[0];
      setSelectedTopics([defaultTopic]);
      localStorage.setItem("topics", JSON.stringify([defaultTopic]));
    } else {
      setSelectedTopics(topics);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("topics", JSON.stringify(selectedTopics));
  }, [selectedTopics]);

  const handleTopicClick = (topic: string) => {
    setIsLoading(true);
    let newSelectedTopics = [];

    if (selectedTopics.includes(topic)) {
      newSelectedTopics = selectedTopics.filter((t) => t !== topic);
    } else {
      newSelectedTopics = [...selectedTopics, topic];
    }

    console.log("newSelectedTopics", newSelectedTopics);

    setSelectedTopics(newSelectedTopics);
    setIsLoading(false);
  };

  return { isLoading, selectedTopics, handleTopicClick };
};

export default useTopics;
