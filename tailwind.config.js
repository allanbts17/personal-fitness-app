/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'material-blue': {
          DEFAULT: '#1976D2',
          light: '#42A5F5',
          dark: '#1565C0',
        },
        'material-error': '#D32F2F',
      },
      boxShadow: {
        'material': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      }
    },
  },
  plugins: [],
}
