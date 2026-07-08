/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#A3FF12',
          orange: '#FF7A00',
        },
        surface: {
          default: '#0B0B0B',
          card: '#161616',
          border: '#2A2A2A',
          hover: '#1F1F1F',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
