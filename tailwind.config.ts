// tailwind.config.ts

export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        mint: "var(--mint)",
        "mint-deep": "var(--mint-deep)",
        coral: "var(--coral)",
      },
      animation: {
        breathe: "breathe 8s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
};