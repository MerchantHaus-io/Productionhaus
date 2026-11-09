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
        sans: ['"Public Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
        // Legacy aliases kept so existing classes resolve to Public Sans; serif headlines
        // opt in with font-display.
        ubuntu: ['"Public Sans"', 'system-ui', 'sans-serif'],
        rajdhani: ['"Public Sans"', 'system-ui', 'sans-serif'],
        playfair: ['"Public Sans"', 'system-ui', 'sans-serif'],
        montserrat: ['"Public Sans"', 'system-ui', 'sans-serif'],
        inter: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        'brand-red': {
          DEFAULT: 'hsl(var(--brand-red))',
          text: 'hsl(var(--brand-red-text))',
        },
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
        heading: 'hsl(var(--heading))',
        page: {
          background: 'hsl(var(--page-background))',
          foreground: 'hsl(var(--page-foreground))',
          'muted-foreground': 'hsl(var(--page-muted-foreground))',
          input: 'hsl(var(--page-input))',
          ring: 'hsl(var(--page-ring))',
        },
        inverse: {
          background: 'hsl(var(--inverse-background))',
          card: 'hsl(var(--inverse-card))',
          foreground: 'hsl(var(--inverse-foreground))',
          heading: 'hsl(var(--inverse-heading))',
          muted: 'hsl(var(--inverse-muted))',
          'muted-foreground': 'hsl(var(--inverse-muted-foreground))',
          border: 'hsl(var(--inverse-border))',
          input: 'hsl(var(--inverse-input))',
        },
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
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        xl: '1rem',
        '2xl': '1.25rem',
        pill: '999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        sm: '0 1px 3px 0 rgba(16, 24, 40, 0.08), 0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        md: '0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
        lg: '0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
        xl: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
        marketing: '0 3px 30px 0 rgba(0, 0, 0, 0.16)',
      },
      transitionTimingFunction: {
        brand: 'var(--ease-out)',
        'brand-in-out': 'var(--ease-in-out)',
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
