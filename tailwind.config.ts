import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#C9A84C",
          600: "#B8963C",
          700: "#9A7D2C",
          800: "#7C641E",
          900: "#5E4B10",
        },
        obsidian: "#0A0A0A",
        cream: {
          50:  "#FEFCF8",
          100: "#F8F4ED",
          200: "#F0E8D8",
        },
      },
      fontFamily: {
        serif:   ["var(--font-playfair)", "Georgia", "serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        heading: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        "float":         "float 6s ease-in-out infinite",
        "fade-in":       "fadeIn 0.8s ease-out forwards",
        "slide-up":      "slideUp 0.8s ease-out forwards",
        "shimmer":       "shimmer 2s linear infinite",
        "pulse-gold":    "pulseGold 2s ease-in-out infinite",
        "spin-slow":     "spin 20s linear infinite",
        "marquee":       "marquee 30s linear infinite",
        "ping-slow":     "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)"  },
          "50%":      { transform: "translateY(-20px)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(201,168,76,0.6)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)"   },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #E8D48A 50%, #C9A84C 100%)",
        "dark-gradient": "linear-gradient(180deg, #0A0A0A 0%, #1a1a1a 100%)",
      },
      boxShadow: {
        "gold":    "0 0 30px rgba(201,168,76,0.3)",
        "gold-lg": "0 0 60px rgba(201,168,76,0.4)",
        "luxury":  "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
