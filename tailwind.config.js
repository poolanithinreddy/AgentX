/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: '#0f172a', // Optional background color for full dark mode base
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        },
        boxShadow: {
          'xl-dark': '0 10px 25px rgba(0, 0, 0, 0.6)',
        },
        animation: {
          pulseSlow: 'pulse 2.5s ease-in-out infinite',
        },
      },
    },
    darkMode: 'class', // Enable dark mode class support (if you want a toggle)
    plugins: [],
  }
  