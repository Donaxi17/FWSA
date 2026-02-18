/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316', // Orange-500
          light: '#FB923C',   // Orange-400
          dark: '#EA580C',    // Orange-600
        },
        background: '#DDE1E7', // More visible gray background
        accent: {
          blue: '#38BDF8',     // Sky-400
          green: '#22C55E',    // Green-500 (Verde esperanza)
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

