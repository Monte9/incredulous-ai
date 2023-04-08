import { useEffect, useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import FactCard from "../components/FactCard";

import useAnalytics from "../hooks/useAnalytics";
import PreferencesModal from "../components/PreferencesModal";
import useTopics from "../hooks/useTopics";
import { FaSpinner } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const { isLoading } = useTopics();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("page.view", { page: "home" });
  }, []);

  return (
    <>
      <Head>
        <title>Incredulous AI</title>
        <meta name="description" content="Daily AI-powered Astonishing Facts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-screen font-mono">
        <Header setShowPreferencesModal={setShowPreferencesModal} />
        {showPreferencesModal ? (
          <PreferencesModal
            dismissModal={() => setShowPreferencesModal(false)}
          />
        ) : null}
        {isLoading ? (
          <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-2 sm:p-16">
            <FactCard />
          </div>
        )}
      </main>
    </>
  );
}
