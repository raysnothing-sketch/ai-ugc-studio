import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0c0d0f",
        card: {
          DEFAULT: "#14161a",
          secondary: "#191c22",
          hover: "#1f232b",
        },
        border: {
          DEFAULT: "#232730",
          light: "#2f3442",
          gold: "rgba(212, 175, 55, 0.3)",
        },
        gold: {
          50: "#fdfbf4",
          100: "#f9f4e2",
          200: "#f1e5be",
          300: "#e6d294",
          400: "#dab967",
          500: "#d4af37", // Primary gold
          600: "#b89528",
          700: "#927320",
          800: "#755b20",
          900: "#624c20",
        },
        ivory: {
          DEFAULT: "#f5f5f3",
          muted: "#9ba1b0",
          dim: "#6b7280",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 0 35px -5px rgba(212, 175, 55, 0.35)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4af37 0%, #f3d179 50%, #b89528 100%)",
        "gold-subtle": "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.03) 100%)",
        "card-gradient": "linear-gradient(180deg, #16181d 0%, #121417 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
