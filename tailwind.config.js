/** @type {import('tailwindcss').Config} */
module.exports = {
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
