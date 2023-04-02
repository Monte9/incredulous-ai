/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '16': '60px',
      },
      padding: {
        '10': '40px',
      },
    },
  },
  plugins: [],
}

