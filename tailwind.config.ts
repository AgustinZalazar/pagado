import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./components/landing/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	safelist: [
		'from-sky-600', 'to-sky-400',
		'from-orange-600', 'to-orange-400',
		'from-slate-700', 'to-slate-500',
		'from-purple-700', 'to-purple-500',
		'from-purple-600', 'to-purple-400',
		'from-green-600', 'to-green-400',
		'from-amber-600', 'to-amber-400',
		'from-yellow-600', 'to-yellow-400',
		'from-lime-600', 'to-lime-400',
		'from-rose-600', 'to-rose-400',
		'from-pink-600', 'to-pink-400',
		'from-fuchsia-600', 'to-fuchsia-400',
		'from-teal-600', 'to-teal-400',
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				light_gray: '#F7F9FB',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				badge_light_green: '#82df706e',
				badge_text_green: '#04a73f',
				badge_light_red: '#f9cbca',
				badge_text_red: '#f95353',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'marquee': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(-100%)' },
				},
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
				"shine": {
					"from": {
						"backgroundPosition": "0 0"
					},
					"to": {
						"backgroundPosition": "-400% 0"
					}
				},
				"spinner": {
					"0%": {
						"opacity": "1"
					},
					"100%": {
						"opacity": "0.15"
					}
				},
				"flip": {
					to: {
						transform: "rotate(360deg)",
					},
				},
				"rotate": {
					to: {
						transform: "rotate(90deg)",
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				"shine": "shine 6s linear infinite",
				"spinner": "spinner 1.2s linear infinite",
				"flip": "flip 6s infinite steps(2, end)",
				"rotate": "rotate 3s linear infinite both",
				'marquee': 'marquee 30s linear infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config