import { useEffect } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import FactCard from "../components/FactCard";

import useAnalytics from "../shared/Analytics";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center p-2 sm:p-16">
          <FactCard />
        </div>
      </main>
    </>
  );
}
