/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Solarpunk / Nature-inspired palette
        lily: {
          50: '#fdf8f6',
          100: '#f9ede7',
          200: '#f4ddd3',
          300: '#ebc4b3',
          400: '#dfa088',
          500: '#d17d64',
          600: '#c46650',
          700: '#a35342',
          800: '#87463a',
          900: '#6f3d34',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        nature: {
          cream: '#fdfcfa',
          sage: '#9caf88',
          moss: '#4a6741',
          earth: '#8b7355',
          sky: '#87ceeb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
