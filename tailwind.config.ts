import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        josefinSans: ["Josefin Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      spacing: {
        "90%": "90%",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#674CC4",
        primaryLight: "#D1C9ED",
        secondary: "#9582D6",
        steelGray: "#494B4D",
        lightGray: "#e0e0e0",
      },
    },
  },
  plugins: [],
};
export default config;
