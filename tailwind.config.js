/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',
      },
      width: {
        1200: '1200px',
      },
    },
  },
  plugins: [],
}
