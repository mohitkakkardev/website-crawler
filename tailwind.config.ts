import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        scrollText: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-100%)" }, // Moves the entire text block up
        },
      },
      animation: {
        "scroll-text": "scrollText 6s linear infinite", // Smooth infinite loop
      },
    },
  },
  plugins: [],
} satisfies Config;
