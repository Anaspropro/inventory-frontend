/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounceWave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
      },
      animation: {
        bounce1: 'bounceWave 1s infinite ease-in-out ',
        bounce2: 'bounceWave 1s infinite ease-in-out 0.3s',
        bounce3: 'bounceWave 1s infinite ease-in-out 0.6s',
      },
    },
  },
  plugins: [],
};
