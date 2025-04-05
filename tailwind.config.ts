import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@mui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme1: {
          bg: "#000000",
          primary: "#950101",
        },
        theme2: {
          bg: "#222831",
          primary: "#fd7014",
        },
        theme3: {
          bg: "#000000",
          primary: "#e41f7b",
        },
        theme4: {
          bg: "#000000",
          primary: "#700b97",
        },
      },
    },
  },
  plugins: [],
};

export default config;
