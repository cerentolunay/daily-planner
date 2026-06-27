/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burnt: "#FE7E3C",
        lust: "#E4201B",
        copper: "#6D413C",
        lagoon: "#0E6873",
        pearl: "#1A2C30",
      },
      backgroundColor: {
        pearl: "#1A2C30",
      },
      boxShadow: {
        glow: "0 15px 45px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
