import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf6ff',
          100: '#d8ecff',
          200: '#b8dcff',
          300: '#89c5ff',
          400: '#53a4ff',
          500: '#2f83f5',
          600: '#1d67d6',
          700: '#1a52ad',
          800: '#1b478f',
          900: '#1c3d76',
        },
        // Tokens da interface de chamada (preto com detalhes laranja).
        // `ink` = superfícies neutras escuras; `accent` = ação/seleção na chamada.
        ink: {
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#404040',
          700: '#2a2a2a',
          800: '#1a1a1a',
          900: '#111111',
          950: '#0a0a0a',
        },
        accent: {
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
      },
      boxShadow: {
        card: '0 8px 30px rgba(10, 38, 71, 0.08)',
      },
      maxWidth: {
        reading: '72ch',
      },
    },
  },
  plugins: [],
};

export default config;
