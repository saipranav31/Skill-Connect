/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        graph: {
          person: '#818cf8',
          skill: '#34d399',
          project: '#fbbf24',
          company: '#f43f5e'
        }
      }
    },
  },
  plugins: [],
}
