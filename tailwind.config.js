/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Dark mode color scheme: https://colorhunt.co/palette/1919192d4263c84b31ecdbba
      // Light mode color scheme: https://colorhunt.co/palette/dddddd22283130475ef05454
      colors: {
        background: {
          dark: "#191919",
          light: "#DDDDDD",
        },
        bright: {
          dark: '#ECDBBA',
          light: '#222831'
        },
        dim: {
          dark: '#222831',
          light: '#ECDBBA',
        },
        primary: {
          dark: '#C84B31',
          light: '#F05454'
        },
        secondary: {
          dark: '#2D4263',
          light: '#30475E'
        }
      },
      animation: {
        scaleBounce: 'scaleBounce 0.4s ease',
      },
      keyframes: {
        scaleBounce: {
          '0%, 100%': { transform: 'scale(1)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'scale(0.9)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
      },
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

