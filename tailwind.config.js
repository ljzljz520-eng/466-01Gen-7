/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        clay: {
          50: '#FAF6F0',
          100: '#F5F0E6',
          200: '#E8DCC8',
          300: '#D4C2A4',
          400: '#B89B72',
          500: '#8B6F47',
          600: '#725A3A',
          700: '#5A462E',
          800: '#423223',
          900: '#2A1E17',
        },
        terracotta: {
          100: '#F5DED2',
          200: '#E9BFA9',
          300: '#DD9E7B',
          400: '#D97757',
          500: '#C45E3F',
          600: '#A24D34',
        },
        forest: {
          100: '#D8E4D8',
          200: '#AEC9AE',
          300: '#7FA87F',
          400: '#5A7D5A',
          500: '#456345',
        },
        cream: '#FBF8F3',
        ink: '#2D241A',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(139, 111, 71, 0.08)',
        card: '0 4px 20px rgba(139, 111, 71, 0.12)',
        button: '0 2px 8px rgba(217, 119, 87, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
