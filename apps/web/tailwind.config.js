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
      opacity: {
        12: "0.12",
        18: "0.18",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        62: "0.62",
        65: "0.65",
        68: "0.68",
        72: "0.72",
        78: "0.78",
      },
    },
  },
  plugins: [],
};
