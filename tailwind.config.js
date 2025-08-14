/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
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
        "dark-green": "hsl(var(--dark-green))",
        white: "#F4F4F4",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        gowilds: {
          primary: "#63ab45",
          "primary-dark": "#4a8233",
          dark: "#2a2a2a",
          "dark-lighter": "#3a3a3a",
        },
        cream: {
          50: "#FDFBF7",
          100: "#F5F1EA",
          200: "#E8DDD4",
          300: "#D4C5B9",
          400: "#C2B3A7",
          500: "#B1A195",
        },
        wood: {
          100: "#F0E6D2",
          200: "#E1CDA5",
          300: "#D2B477",
          400: "#C39B4A",
          500: "#B8956A",
          600: "#A0815C",
        },
        gold: {
          400: "#E6C275",
          500: "#D4A574",
          600: "#B8956A",
          700: "#9C7F56",
        },
        charcoal: {
          800: "#2C2C2C",
          900: "#1A1A1A",
        },
        "app-border": "hsl(var(--app-border))",
        "app-input": "hsl(var(--app-input))",
        "app-ring": "hsl(var(--app-ring))",
        "app-background": "hsl(var(--app-background))",
        "app-foreground": "hsl(var(--app-foreground))",
        "app-primary": {
          DEFAULT: "hsl(var(--app-primary))",
          foreground: "hsl(var(--app-primary-foreground))",
        },
        "app-secondary": {
          DEFAULT: "hsl(var(--app-secondary))",
          foreground: "hsl(var(--app-secondary-foreground))",
        },
        "app-destructive": {
          DEFAULT: "hsl(var(--app-destructive))",
          foreground: "hsl(var(--app-destructive-foreground))",
        },
        "app-muted": {
          DEFAULT: "hsl(var(--app-muted))",
          foreground: "hsl(var(--app-muted-foreground))",
        },
        "app-accent": {
          DEFAULT: "hsl(var(--app-accent))",
          foreground: "hsl(var(--app-accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-prompt)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "custom-lg": "0px 10px 60px rgba(0, 0, 0, 0.07)",
      },
      borderColor: {
        "frame-border": "#BBBAB4 #C7C7BF #E5E4DF #C7C7BF",
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
};

export default tailwindConfig;
