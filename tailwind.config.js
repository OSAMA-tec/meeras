/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          cream: '#fef7e4',
          orange: '#ff7402',
          'bright-orange': '#FF8C42',
          black: '#000000',
          'soft-black': '#1A1A1A',
          'warm-gray': '#2D2A26',
          brown: '#8B4513',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
