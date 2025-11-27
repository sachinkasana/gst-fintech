/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#21808D',
          primaryHover: '#1D7480',
          secondary: '#5E5240',
          background: '#FCFCF9',
          surface: '#FFFFFE',
          textPrimary: '#13343B',
          textSecondary: '#626C71',
        },
      },
    },
    plugins: [],
  }
  