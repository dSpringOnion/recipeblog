import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Coffee/Tea-Stained Cyworld Palette
        parchment: {
          50: '#fdfaf6',
          100: '#f9f3eb',
          200: '#f2e6d6',
          300: '#e9d7be',
          400: '#dfc4a0',
          500: '#d4ae7e', // Warm parchment
          600: '#c4975f',
          700: '#a67c4c',
          800: '#88643e',
          900: '#6f5234',
          950: '#4a361f',
        },
        coffee: {
          50: '#f7f3f0',
          100: '#ede5dd',
          200: '#dccab9',
          300: '#c5a78d',
          400: '#b18968',
          500: '#a17550', // Rich coffee
          600: '#8f6143',
          700: '#754e38',
          800: '#624232',
          900: '#53392b',
          950: '#2e1e16',
        },
        latte: {
          50: '#faf8f5',
          100: '#f3ede6',
          200: '#e6d9ca',
          300: '#d5bfa8',
          400: '#c4a385',
          500: '#b58c6b', // Creamy latte
          600: '#a6775a',
          700: '#8a614b',
          800: '#725141',
          900: '#5f4437',
          950: '#32231c',
        },
        cinnamon: {
          50: '#faf6f3',
          100: '#f3ebe3',
          200: '#e6d5c5',
          300: '#d5b9a0',
          400: '#c49878',
          500: '#b67f5c', // Warm cinnamon
          600: '#a86b4d',
          700: '#8c5741',
          800: '#724939',
          900: '#5e3d30',
          950: '#321f18',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config