import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        // Legacy aliases kept so existing classes resolve to the two brand families.
        ubuntu: ['"DM Serif Display"', 'Georgia', 'serif'],
        rajdhani: ['"DM Serif Display"', 'Georgia', 'serif'],
        playfair: ['"DM Serif Display"', 'Georgia', 'serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
        inter: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        'brand-red': 'hsl(var(--brand-red))',
        'brand-crimson': 'hsl(var(--brand-crimson))',
        'brand-maroon': 'hsl(var(--brand-maroon))',
        'brand-cream': 'hsl(var(--brand-cream))',
        'brand-navy': 'hsl(var(--brand-navy))',
        'brand-slate': {
          DEFAULT: 'hsl(var(--brand-slate))',
          foreground: 'hsl(var(--brand-slate-foreground))',
          text: 'hsl(var(--brand-slate-text))',
        },
        'neutral-dark': 'hsl(var(--neutral-dark))',
        'silver-grey': 'hsl(var(--silver-grey))',
        'neutral-light': 'hsl(var(--neutral-light))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          text: 'hsl(var(--primary-text))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        status: {
          approved: {
            DEFAULT: 'hsl(var(--status-approved))',
            bg: 'hsl(var(--status-approved-bg))',
          },
          pending: {
            DEFAULT: 'hsl(var(--status-pending))',
            bg: 'hsl(var(--status-pending-bg))',
          },
          declined: {
            DEFAULT: 'hsl(var(--status-declined))',
            bg: 'hsl(var(--status-declined-bg))',
          },
          refunded: {
            DEFAULT: 'hsl(var(--status-refunded))',
            bg: 'hsl(var(--status-refunded-bg))',
          },
          chargeback: {
            DEFAULT: 'hsl(var(--status-chargeback))',
            bg: 'hsl(var(--status-chargeback-bg))',
          },
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.5)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        scroll: "scroll 20s linear infinite",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;
