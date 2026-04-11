import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#f5efe4",
        ink: "#1d1d1b",
        coral: "#f97360",
        teal: "#0f766e",
        pine: "#134e4a",
        gold: "#d6a756"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 45px rgba(15, 118, 110, 0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;
