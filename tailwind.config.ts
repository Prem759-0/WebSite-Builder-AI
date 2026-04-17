import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#070A18',
        panel: 'rgba(255,255,255,0.08)',
        accent: '#6D5BFF',
        accent2: '#2DD4FF'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(109,91,255,0.4), transparent 42%), radial-gradient(circle at right, rgba(45,212,255,0.25), transparent 35%)'
      },
      boxShadow: {
        glow: '0 0 30px rgba(109,91,255,0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
