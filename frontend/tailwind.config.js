/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Stitch Design System Tokens (Cybernetic Mission Command)
        "surface": "#0e141d",
        "surface-dim": "#0e141d",
        "surface-bright": "#343944",
        "surface-container-lowest": "#090e17",
        "surface-container-low": "#161c25",
        "surface-container": "#1a2029",
        "surface-container-high": "#252a34",
        "surface-container-highest": "#30353f",
        "on-surface": "#dee2f0",
        "on-surface-variant": "#bec8d2",
        "outline": "#88929b",
        "outline-variant": "#3e4850",
        "primary": "#89ceff",
        "primary-container": "#0ea5e9",
        "on-primary": "#00344d",
        "secondary": "#ffb77a",
        "secondary-container": "#d7790d",
        "secondary-fixed": "#ffdcc2",
        "secondary-fixed-dim": "#ffb77a",
        "tertiary": "#4edea3",
        "tertiary-container": "#00b17b",
        "error": "#ffb4ab",
        "error-container": "#93000a",

        // Sovereign Indian Tricolor Tactical Accents
        sovereign: {
          saffron: "#FF9933",
          white: "#F8FAFC",
          green: "#10B981",
          navy: "#0A1938",
          cyan: "#00F2FE",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["'JetBrains Mono'", "SFMono-Regular", "Consolas", "monospace"],
        "headline": ["Inter", "sans-serif"],
        "telemetry": ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "beacon-emerald": "pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "beacon-amber": "amberWarn 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar 4s linear infinite",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.8))" },
          "50%": { opacity: "0.35", filter: "drop-shadow(0 0 2px rgba(16, 185, 129, 0.2))" },
        },
        amberWarn: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 8px rgba(255, 153, 51, 0.9))" },
          "50%": { opacity: "0.45", filter: "drop-shadow(0 0 2px rgba(255, 153, 51, 0.3))" },
        },
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
