import type { Config } from "tailwindcss";

const animations = require('./tailwind-animations');

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Google Keep inspired color palette
        note: {
          default: '#ffffff',
          red: '#f28b82',
          orange: '#fbbc04',
          yellow: '#fff475',
          green: '#ccff90',
          teal: '#a7ffeb',
          blue: '#cbf0f8',
          purple: '#d7aefb',
          pink: '#fdcfe8',
        },
      },
      animation: animations.animation,
      keyframes: animations.keyframes,
    },
  },
  plugins: [],
};

export default config;
