/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ["Barlow", "sans-serif"]
      },
      colors: {
        persian: '#339989',
        middleBlue: '#7DE2D1',
        snow: '#FFFAFB',
        jet: '#2B2C28',
        eerie: '#131515',
        secondary: '#8e938e'
      }
    },
  },
  plugins: [],
}
