/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MIXPANEL_PROJECT_TOKEN: process.env.MIXPANEL_PROJECT_TOKEN,
    IS_DEV: process.env.IS_DEV
  }
}

module.exports = nextConfig
