/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        background: '#000000', // true black
        cinematic: {
          gold: '#D4AF37', // Pure gold
          black: '#0A0A0A', // Deep pure black for elements
        }
      }
    },
  },
  plugins: [],
}
