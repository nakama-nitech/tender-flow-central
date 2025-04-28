
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          foreground: "#ffffff",
          50: "#f5f2ff",
          100: "#ede6fe",
          200: "#d9cafd",
          300: "#c2adfc",
          400: "#ab90fa",
          500: "#9b87f5",
          600: "#7e69ab",
          700: "#6E59A5",
          800: "#473a6a",
          900: "#1A1F2C",
        },
        secondary: {
          DEFAULT: "#1A1F2C",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ea384c",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#E5DEFF",
          foreground: "#8E9196",
        },
        accent: {
          DEFAULT: "#D6BCFA",
          foreground: "#1A1F2C",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1A1F2C",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1A1F2C",
        },
        category: {
          construction: {
            bg: "hsl(45 100% 96%)",
            text: "hsl(45 80% 30%)",
          },
          services: {
            bg: "hsl(210 100% 96%)",
            text: "hsl(210 80% 30%)",
          },
          goods: {
            bg: "hsl(142 100% 96%)",
            text: "hsl(142 80% 30%)",
          },
          consulting: {
            bg: "hsl(270 100% 96%)",
            text: "hsl(270 80% 30%)",
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
