/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD230",
        lilac: "#D2C7FF",
        purple: "#5D5491",
        neon: "#E1FB62",
      },
      backgroundColor: {
        lilac: "#D2C7FF",
      },
      boxShadow: {
        glow: "0 18px 45px rgba(93,84,145,0.18)",
      },
    },
  },
  plugins: [],
};
