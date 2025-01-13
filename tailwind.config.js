/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#818cf8',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-50',
    'bg-indigo-50',
    'bg-purple-50',
    'bg-violet-50',
    'bg-green-50',
    'border-blue-200',
    'border-indigo-200',
    'border-purple-200',
    'border-violet-200',
    'border-green-200'
  ]
}