/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      colors: {
        // Primary - Light Beige/Cream untuk nuansa nostalgia yang hangat
        primary: {
          50: "#fefdfb",
          100: "#fdf9f2",
          200: "#f9f0e3",
          300: "#f4e4cc",
          400: "#edd4aa",
          500: "#e3c288", // Light beige utama
          600: "#d8ad6f",
          700: "#c59658",
          800: "#a1794a",
          900: "#84623e",
          950: "#45341f",
        },
        // Secondary - Warm cream yang lebih terang
        secondary: {
          50: "#fffffb",
          100: "#fffef7",
          200: "#fffceb",
          300: "#fff7d5",
          400: "#fef0b5",
          500: "#fce688", // Warm cream
          600: "#f9d958",
          700: "#f0c83a",
          800: "#dba528",
          900: "#b8862a",
          950: "#6b4f14",
        },
        // Accent - Soft beige untuk detail
        accent: {
          50: "#fefcf8",
          100: "#fdf6ec",
          200: "#fbebd4",
          300: "#f7dab4",
          400: "#f1c488",
          500: "#e9a962", // Soft beige
          600: "#dc9147",
          700: "#b8763b",
          800: "#935f35",
          900: "#754e2e",
          950: "#3e2717",
        },
        // Warm - Untuk elemen hangat tambahan
        warm: {
          50: "#fefdfb",
          100: "#fdfaf5",
          200: "#faf4e8",
          300: "#f5ebd4",
          400: "#eeddb5",
          500: "#e5cc92", // Warm beige
          600: "#d9b872",
          700: "#c8a05a",
          800: "#a4834c",
          900: "#856940",
          950: "#473721",
        },
        // Neutral beige untuk background
        neutral: {
          50: "#fefefe",
          100: "#fdfcfa",
          200: "#faf8f4",
          300: "#f5f2ec",
          400: "#ede8df",
          500: "#e3ddd1", // Light beige background
          600: "#d4cbb8",
          700: "#b8ab94",
          800: "#968a78",
          900: "#7a7062",
          950: "#413c33",
        },
      },
    },
  },
  plugins: [],
};
