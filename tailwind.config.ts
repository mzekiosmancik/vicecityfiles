import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        neon: {
          pink: "#ff2d95",
          blue: "#00e5ff",
          purple: "#a855f7",
          orange: "#ff7849",
          yellow: "#ffe14d",
          green: "#39ff88",
        },
        vice: {
          black: "#07060b",
          dark: "#0d0b14",
          panel: "#14111f",
          line: "#2a2440",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "neon-pink": "0 0 20px rgba(255,45,149,0.45), 0 0 60px rgba(255,45,149,0.15)",
        "neon-blue": "0 0 20px rgba(0,229,255,0.45), 0 0 60px rgba(0,229,255,0.15)",
        "neon-purple": "0 0 20px rgba(168,85,247,0.45), 0 0 60px rgba(168,85,247,0.15)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.55)",
      },
      backgroundImage: {
        "vice-sunset": "linear-gradient(135deg, #ff2d95 0%, #a855f7 45%, #00e5ff 100%)",
        "vice-night": "linear-gradient(180deg, #0d0b14 0%, #07060b 100%)",
        "vice-radial": "radial-gradient(ellipse at top, rgba(168,85,247,0.22), transparent 60%)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        "gradient-x": "gradient-x 8s ease infinite",
        "pulse-neon": "pulse-neon 2.4s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
