import type { Config } from "tailwindcss";
import { colors, fontSize, ease } from "./src/lib/tokens";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontSize: {
        mega: fontSize.mega,
        display: fontSize.display,
        h2: fontSize.h2,
        lead: fontSize.lead,
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: { expo: ease.css },
      keyframes: {
        float: { "0%,100%": { transform: "translate3d(0,0,0)" }, "50%": { transform: "translate3d(0,-10px,0)" } },
        pulseRing: { "0%": { transform: "scale(1)", opacity: ".75" }, "100%": { transform: "scale(2.5)", opacity: "0" } },
        blink: { "50%": { opacity: "0" } },
        shimmer: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
        scanline: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(400%)" } },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s ease-out infinite",
        blink: "blink 1s steps(1) infinite",
        shimmer: "shimmer 2.2s ease-in-out infinite",
        scanline: "scanline 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
