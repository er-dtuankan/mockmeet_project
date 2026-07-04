/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#7c3aed',
          blue:   '#3b82f6',
          green:  '#10b981',
          orange: '#f59e0b',
          red:    '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
