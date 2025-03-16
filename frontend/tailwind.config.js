/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#3d50c2',
        textBoldColor: '#061F40',
        textLightColor: '#B2B2B2',
        bgModalColor: 'rgba(0,0,0,0,4)',
        primary: {
          100: "#eceef9",
          200: "#c5cbed",
          300: "#9ea8e0",
          400: "#7785d4",
          500: "#5062c8",
          600: "#3748af",
          700: "#2b3888",
          800: "#1f2861",
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

