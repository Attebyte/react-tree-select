/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2c0092'
      },
      backgroundSize: {
        'size-200': '200% 200%'
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%'
      }
    },
  },
  plugins: [],
}

