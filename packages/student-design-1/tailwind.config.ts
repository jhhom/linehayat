import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      body: ["Roboto", "sans-serif"],
      berkshire: ["Berkshire Swash", "serif"],
      "print-clearly": ["PrintClearly"],
    },
    extend: {
      boxShadow: {
        "o-sm": "0 0 2px 0 rgba(0, 0, 0, 0.05)",
        "o-md":
          "0 0 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "o-lg":
          "0 0 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "o-xl":
          "0 0 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "o-2xl": "0 0 50px -12px rgba(0, 0, 0, 0.25)",
        "o-3xl": "0 0 60px -15px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        "space-floating-1": {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(10%)" },
        },
        "space-floating-2": {
          "0%, 100%": { transform: "translate(-10%, -10%)" },
          "50%": { transform: "translate(0%, 10%)" },
        },
      },
      animation: {
        "space-floating-1": "space-floating-1 6s ease-in-out infinite",
        "space-floating-2": "space-floating-2 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
