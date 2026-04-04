/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        hand:  ['"Caveat"', 'cursive'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        amber:  '#F2A854',
        violet: '#C084FC',
        yaar: {
          bg:    '#080B18',
          muted: '#7A7A96',
          paper: '#F7F0E3',
          ink:   '#2C1A0E',
          lines: '#D4C5A9',
        }
      }
    },
  },
  plugins: [],
}