/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dream: {
          50: '#f0e6ff',
          100: '#d9c2ff',
          200: '#b794f6',
          300: '#9f7aea',
          400: '#805ad5',
          500: '#6b46c1',
          600: '#553c9a',
          700: '#44337a',
          800: '#2d2154',
          900: '#1a1033',
          950: '#0d0820',
        },
        night: {
          50: '#e6eeff',
          100: '#c2d4ff',
          200: '#8fadf7',
          300: '#6b8de8',
          400: '#4a6fd4',
          500: '#3555b0',
          600: '#273f85',
          700: '#1c2d5e',
          800: '#121e3d',
          900: '#0a1128',
          950: '#050914',
        },
      },
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(159, 122, 234, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(159, 122, 234, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
