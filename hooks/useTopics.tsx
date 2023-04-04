import { useEffect, useState } from "react";
import { FACT_TOPICS } from "../shared/Constants";

type UseTopicsType = [string[], (topic: string) => void];

const useTopics = (): UseTopicsType => {
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
  }, []);

  useEffect(() => {
    localStorage.setItem("topics", JSON.stringify(selectedTopics));
  }, [selectedTopics]);

  const handleTopicClick = (topic: string) => {
    let newSelectedTopics = [];

    if (selectedTopics.includes(topic)) {
      newSelectedTopics = selectedTopics.filter((t) => t !== topic);
    } else {
      newSelectedTopics = [...selectedTopics, topic];
    }

    setSelectedTopics(newSelectedTopics);
  };

  return [selectedTopics, handleTopicClick];
};

export default useTopics;
