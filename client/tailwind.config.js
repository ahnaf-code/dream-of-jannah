/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Magical, dreamy pastel color palette (No Pink / No Red)
        jannah: {
          lavender: {
            light: '#F3E8FF',
            DEFAULT: '#E6E6FA',
            dark: '#D8B4FE',
          },
          lilac: '#DCD0FF',
          periwinkle: {
            light: '#E8E8FF',
            DEFAULT: '#C1C6FC',
            dark: '#939CFF',
          },
          sky: {
            light: '#E0F2FE',
            DEFAULT: '#A0C4FF',
            dark: '#7DB0FF',
          },
          mint: {
            light: '#E6FFFA',
            DEFAULT: '#B2F7EF',
            dark: '#8DF1E4',
          },
          gold: {
            light: '#FFFBEA',
            DEFAULT: '#FDFFB6',
            dark: '#F9F871',
          },
          cream: '#FFFDF9',
          deep: '#1E1B4B', // Dark indigo for night sky headers
        },
      },
      fontFamily: {
        bubble: ['Fredoka', 'Quicksand', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
