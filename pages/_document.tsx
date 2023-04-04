import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-background-light dark:bg-background-dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
