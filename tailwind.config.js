// tailwind.config.js — educenter-web

const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ─── EduCenter colour system ──────────────────────────────────────────
      colors: {
        // Brand — education blue
        edu: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF", // PRIMARY
          900: "#1E3A8A",
          950: "#172554",
        },
        // Accent — amber (exam energy / urgency)
        accent: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        // Success — correct answers
        correct: {
          50: "#F0FDF4",
          500: "#22C55E",
          700: "#15803D",
        },
        // Danger — wrong answers
        wrong: {
          50: "#FFF1F2",
          500: "#F43F5E",
          700: "#BE123C",
        },
        // Neutral surface
        surface: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          muted: "#94A3B8",
        },
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        // OpenDyslexic is the BoldmindNG ecosystem default (accessibility-first)
        sans: [
          "OpenDyslexic",
          '"Plus Jakarta Sans"',
          '"Inter"',
          ...fontFamily.sans,
        ],
        display: ["OpenDyslexic", '"Plus Jakarta Sans"', ...fontFamily.sans],
        mono: ['"JetBrains Mono"', '"Fira Code"', ...fontFamily.mono],
      },

      // Dyslexia-friendly spacing (from BOLDMIND_FONT_CONFIG)
      letterSpacing: {
        dyslexic: "0.12em",
      },
      lineHeight: {
        dyslexic: "1.8",
      },

      // ─── Layout ───────────────────────────────────────────────────────────
      maxWidth: {
        content: "1280px",
        reading: "72ch",
      },
      borderRadius: {
        card: "1rem",
        pill: "9999px",
      },

      // ─── Animations ───────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
        "timer-shrink": {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "283" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.25s ease-out",
        "pulse-ring": "pulse-ring 2s ease-in-out infinite",
        "timer-shrink":
          "timer-shrink var(--timer-duration, 120s) linear forwards",
      },

      // ─── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-hover": "0 4px 16px 0 rgb(30 64 175 / 0.12)",
        focus: "0 0 0 3px rgb(30 64 175 / 0.35)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
