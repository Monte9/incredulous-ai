/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // WARNING: values listed here are inlined into the CLIENT bundle and shipped
    // to every visitor's browser. ONLY non-secret, publishable values belong
    // here. Server-only secrets (OPENAI_API_KEY, AIRTABLE_API_KEY) must NEVER be
    // listed here — they are read directly from process.env inside API routes,
    // which run server-side only.
    MIXPANEL_PROJECT_TOKEN: process.env.MIXPANEL_PROJECT_TOKEN, // public ingestion token, safe for the client
    APP_ENV: process.env.APP_ENV,
    APP_NAME: process.env.APP_NAME,
  }
}

module.exports = nextConfig
