import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#faf8f5",
        ink: "#1c1917",
        muted: "#78716c",
        accent: "#059669",
        "accent-hover": "#047857",
        card: "#ffffff",
        border: "#e7e5e4",
      },
    },
  },
  plugins: [],
};

export default config;
