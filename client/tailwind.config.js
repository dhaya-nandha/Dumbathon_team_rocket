/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pus-green': '#A3E635',
        'radium-yellow': '#D9F99D',
        'blood-red': '#991B1B',
        'fungus-purple': '#4C1D95',
        'zombie-skin': '#78716C',
        'bunker': '#111827',
        'night': '#030712',
      },
      animation: {
        'pus-blast': 'pusBlast 0.5s ease-out forwards',
        'flicker': 'flicker 2s infinite',
        'flicker-slow': 'flicker 4s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pusBlast: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.8', filter: 'hue-rotate(90deg)' },
          '100%': { transform: 'scale(2) rotate(10deg)', opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [],
};
