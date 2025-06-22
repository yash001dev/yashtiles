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
