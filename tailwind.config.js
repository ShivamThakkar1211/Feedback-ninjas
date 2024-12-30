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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neon Nostalgia
        neonNostalgia: {
          blue: '#3CFFDC',
          pink: '#FF007A',
          green: '#39FF14',
          purple: '#A200FF',
          black: '#0A0A0A',
        },
        // Bubblegum Riot
        bubblegumRiot: {
          pink: '#FFB7C5',
          blue: '#A5F3FC',
          yellow: '#FCE94F',
          green: '#8DFF5A',
          orange: '#FF9057',
        },
        // Retro Funk
        retroFunk: {
          yellow: '#FFC857',
          teal: '#119DA4',
          burgundy: '#6A0572',
          orange: '#F45D22',
          white: '#FFFCF2',
        },
        // Cosmic Quirk
        cosmicQuirk: {
          gold: '#FFD700',
          purple: '#6E1EFF',
          teal: '#14D2DC',
          green: '#50FF4A',
          black: '#101820',
        },
        // Pastel Party
        pastelParty: {
          lavender: '#CBAACB',
          mint: '#D5E8D4',
          pink: '#FFDAC1',
          blue: '#A1C6EA',
          yellow: '#FFE5B4',
        },
        // Cyber Crush
        cyberCrush: {
          green: '#DFFF00',
          pink: '#FF007F',
          blue: '#1A8FE3',
          purple: '#8200FF',
          black: '#121212',
        },
        // Wacky Watermelon
        wackyWatermelon: {
          pink: '#FF6F61',
          green: '#4CAF50',
          black: '#333333',
          white: '#F9F9F9',
          orange: '#FFB400',
        },
        // Unicorn Dreams
        unicornDreams: {
          pink: '#FF8AD6',
          gold: '#FFD700',
          blue: '#96D7FF',
          lavender: '#C5A3FF',
          white: '#F7F7F7',
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
};
