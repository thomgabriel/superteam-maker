import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          'dark-green': '#1b231d',
          'emerald': '#008b4c',
          'green': '#306c40',
          'yellow': '#ffd23f',
          'off-white': '#f5e8ca',
        },
      },
      fontFamily: {
        heading: ['var(--font-archivo)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
