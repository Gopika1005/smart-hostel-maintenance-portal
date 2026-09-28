/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050b1f',
          900: '#0a1330',
          800: '#101c44',
          700: '#162759',
          600: '#1d3470',
        },
        royal: {
          500: '#3457d5',
          400: '#4d6be0',
          300: '#7b93ec',
        },
        accent: {
          gold: '#f0b429',
          teal: '#2dd4bf',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(52, 87, 213, 0.45)',
      },
    },
  },
  plugins: [],
}
