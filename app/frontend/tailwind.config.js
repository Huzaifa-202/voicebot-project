/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)"
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))"
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))"
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))"
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))"
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))"
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))"
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))"
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))"
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                "7xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
                "4xl": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
                "3xl": ["2rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }]
            },
            animation: {
                'gradient-shift': 'gradient-shift 8s ease infinite',
                'float': 'float 3s ease-in-out infinite',
                'float-slow': 'float-slow 20s ease-in-out infinite',
                'float-gentle': 'float-gentle 6s ease-in-out infinite',
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'blob': 'blob 7s infinite',
                'slide-up': 'slide-up 0.5s ease-out',
                'scale-in': 'scale-in 0.3s ease-out',
            },
            keyframes: {
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translate(0px, 0px)' },
                    '33%': { transform: 'translate(30px, -30px)' },
                    '66%': { transform: 'translate(-20px, 20px)' },
                },
                'pulse-ring': {
                    '0%': {
                        transform: 'scale(0.95)',
                        boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)'
                    },
                    '50%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)'
                    },
                    '100%': {
                        transform: 'scale(0.95)',
                        boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)'
                    },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                'glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)'
                    },
                },
                'blob': {
                    '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
                'float-gentle': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'slide-up': {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                'scale-in': {
                    'from': { transform: 'scale(0.95)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(139, 92, 246, 0.5)',
                'glow-lg': '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
        }
    },
    plugins: [plugin]
};
