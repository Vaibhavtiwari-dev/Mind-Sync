import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			surface: {
  				DEFAULT: 'hsl(var(--surface))',
  				dim: 'hsl(var(--surface-dim))',
  				bright: 'hsl(var(--surface-bright))',
  				container: {
  					DEFAULT: 'hsl(var(--surface-container))',
  					lowest: 'hsl(var(--surface-container-lowest))',
  					low: 'hsl(var(--surface-container-low))',
  					high: 'hsl(var(--surface-container-high))',
  					highest: 'hsl(var(--surface-container-highest))'
  				}
  			},
  			'on-surface': {
  				DEFAULT: 'hsl(var(--on-surface))',
  				variant: 'hsl(var(--on-surface-variant))'
  			},
  			outline: {
  				DEFAULT: 'hsl(var(--outline-theme))',
  				variant: 'hsl(var(--outline-variant))'
  			},
  			'brand-purple': 'hsl(262, 83%, 58%)',
  			'brand-pink': 'hsl(330, 81%, 60%)',
  			'brand-blue': 'hsl(217, 91%, 60%)',
  			tertiary: {
  				DEFAULT: 'hsl(var(--tertiary))',
  				foreground: 'hsl(var(--on-tertiary))',
  				container: {
  					DEFAULT: 'hsl(var(--tertiary-container))',
  					foreground: 'hsl(var(--on-tertiary-container))'
  				}
  			},
  			error: {
  				DEFAULT: 'hsl(var(--error))',
  				foreground: 'hsl(var(--on-error))',
  				container: {
  					DEFAULT: 'hsl(var(--error-container))',
  					foreground: 'hsl(var(--on-error-container))'
  				}
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'primary-container': {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backgroundImage: {
  			'brand-gradient': 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(330, 81%, 60%), hsl(217, 91%, 60%))',
  			'gradient-mesh': 'radial-gradient(at center, hsla(262, 83%, 58%, 0.18) 0px, transparent 60%), radial-gradient(at center, hsla(330, 81%, 60%, 0.18) 0px, transparent 60%), radial-gradient(at center, hsla(217, 91%, 60%, 0.18) 0px, transparent 60%)',
  		}
  	}
  },
  plugins: [animate],
};
export default config;
