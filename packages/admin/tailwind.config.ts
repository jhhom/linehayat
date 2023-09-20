import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "dialog-hide": "dialogContentHide 300ms ease-in forwards",
        "dialog-show": "dialogContentShow 300ms ease-out",
        "select-hide": "selectContentHide 250ms ease-in forwards",
        "select-show": "selectContentShow 250ms ease-out",
        "slide-down": "slideDown 300ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
      },
      keyframes: {
        dialogContentShow: {
          from: {
            opacity: "0",
            transform: "scale(0.96)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        dialogContentHide: {
          from: {
            opacity: "1",
            transform: "scale(1)",
          },
          to: {
            opacity: "0",
            transform: "scale(0.96)",
          },
        },
        slideDown: {
          from: {
            height: "0",
          },
          to: {
            height: "var(--kb-collapsible-content-height)",
          },
        },
        slideUp: {
          from: {
            height: "var(--kb-collapsible-content-height)",
          },
          to: {
            height: "0",
          },
        },
        selectContentShow: {
          from: {
            opacity: "0",
            transform: `translateY(-8px)`,
          },
          to: {
            opacity: "1",
            transform: `translateY(0)`,
          },
        },
        selectContentHide: {
          from: {
            opacity: "1",
            transform: `translateY(0)`,
          },
          to: {
            opacity: "0",
            transform: `translateY(-8px)`,
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
