import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // VisualClause 色彩体系
        primary: "#020617",           // 深海蓝 - Primary
        secondary: "#F8FAFC",         // 银白色 - Secondary (逻辑线条)
        accent: {
          gold: "#D4AF37",            // 金黄色 - Accent (生命力/高光/交互)
          goldGlow: "rgba(212, 175, 55, 0.25)",
          blue: "#4A90E2",            // 辅助蓝
          glow: "rgba(74, 144, 226, 0.15)"
        },
        background: {
          DEFAULT: "#0A0A0B",
          surface: "#161618",
          surfaceHover: "#1E1E20"
        },
        text: {
          primary: "#EDEDED",         // 高光银白
          secondary: "#B0B0B2",       // 哑光银
          tertiary: "#6B6B6E"         // 暗银灰
        },
        border: "rgba(237, 237, 237, 0.08)"
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      borderWidth: {
        "0.5": "0.5px",
        "1.5": "1.5px"
      },
      boxShadow: {
        "metal": "0 0 20px rgba(74, 144, 226, 0.08)",
        "metal-intense": "0 0 40px rgba(74, 144, 226, 0.12)",
        "glow": "0 0 60px rgba(74, 144, 226, 0.15)"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "lattice-pattern": "linear-gradient(rgba(237, 237, 237, 0.03) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(237, 237, 237, 0.03) 0.5px, transparent 0.5px)"
      },
      animation: {
        "lattice-grow": "latticeGrow 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        latticeGrow: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    },
  },
  plugins: [],
};

export default config;
