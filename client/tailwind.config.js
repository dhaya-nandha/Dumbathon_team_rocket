/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#070A08',
        bunker: '#111915',
        neon: {
          100: '#D7FFE8',
          300: '#86FFB6',
          500: '#39FF88',
          700: '#1DB25A'
        }
      },
      boxShadow: {
        neon: '0 0 12px rgba(57, 255, 136, 0.55)'
      }
    }
  },
  plugins: []
};
