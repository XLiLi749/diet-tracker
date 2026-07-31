/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9e6',
          100: '#fff0c2',
          200: '#ffe499',
          300: '#ffd770',
          400: '#ffcb47',
          500: '#ffbf1f',
          600: '#e6a600',
          700: '#b38100',
          800: '#805c00',
          900: '#4d3700',
        },
        usagi: {
          cream: '#FFF5D6',
          pink: '#FFB6C1',
          pinkLight: '#FFE4E8',
          mint: '#B5EAD7',
          mintLight: '#E5F8F0',
          sky: '#C7CEEA',
          skyLight: '#E8EBF7',
          yellow: '#FFE066',
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(255, 191, 31, 0.08)',
        'card-hover': '0 4px 20px rgba(255, 191, 31, 0.15)',
        cute: '0 4px 16px rgba(255, 182, 193, 0.25)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
