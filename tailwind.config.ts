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
        // 辛金质感配色体系
        background: "#0A0A0B",      // 深邃黑
        surface: "#161618",         // 金属钛灰
        surfaceHover: "#1E1E20",    // 钛灰悬停态
        text: {
          primary: "#EDEDED",       // 高光银白
          secondary: "#B0B0B2",     // 哑光银
          tertiary: "#6B6B6E"       // 暗银灰
        },
        accent: {
          blue: "#4A90E2",          // 冰川蓝
          gold: "#D4AF37",          // 冷流沙金
          glow: "rgba(74, 144, 226, 0.15)" // 冰川蓝微光
        },
        border: "rgba(237, 237, 237, 0.08)" // 极细金属边框
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
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
