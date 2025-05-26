/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Background: "#860000",
        Principal_Color: "#EB646C",
        Second_Color: "#EB646C",
        Light_blue: "#00A0B9",
        Yellow: "#FFD517",
        Green: "#39A935",
        Red: "#E30427",
        Gray: "#CECECE",
      },
    },
  },
  plugins: [],
};
