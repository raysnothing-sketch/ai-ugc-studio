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
        background: "#07080a",
        card: {
          DEFAULT: "#0e1014",
          secondary: "#13161c",
          hover: "#181c24",
        },
        border: {
          DEFAULT: "#1c2028",
          light: "#282d39",
          gold: "rgba(212, 175, 55, 0.28)",
          "gold-strong": "rgba(212, 175, 55, 0.65)",
        },
        gold: {
          50: "#fffdf5",
          100: "#fdf8e6",
          200: "#faefcc",
          300: "#f5df9f",
          400: "#eac96e",
          500: "#d4af37", // Canonical Studio Metallic Gold
          600: "#b88f28",
          700: "#946f1e",
          800: "#78571d",
          900: "#64471c",
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
        gold: "0 0 25px -4px rgba(212, 175, 55, 0.3)",
        "gold-lg": "0 0 45px -5px rgba(212, 175, 55, 0.45)",
        "gold-inset": "inset 0 0 20px rgba(212, 175, 55, 0.15)",
        card: "0 4px 24px -2px rgba(0, 0, 0, 0.65)",
        "card-hover": "0 8px 32px -4px rgba(212, 175, 55, 0.18)",
      },
      backgroundImage: {
        "gold-metallic": "linear-gradient(135deg, #fff2c6 0%, #e5b869 30%, #d4af37 60%, #996515 100%)",
        "gold-gradient": "linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #aa821e 100%)",
        "gold-subtle": "linear-gradient(135deg, rgba(212, 175, 55, 0.14) 0%, rgba(212, 175, 55, 0.02) 100%)",
        "card-gradient": "linear-gradient(180deg, #121419 0%, #0c0e12 100%)",
        "obsidian-radial": "radial-gradient(ellipse at top, #141720 0%, #07080a 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
