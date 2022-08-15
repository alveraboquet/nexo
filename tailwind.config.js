/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        main: {
          primary: '#2c3e50',
          secondary: '#7f8c8d',
          'text-primary': '#ecf0f1',
          'text-secondary': '#bdc3c7',
        },
      },
    },
  },
  plugins: [],
};
