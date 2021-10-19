module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Press Start 2P"', 'cursive'],
        'body': ['Inter', 'sans-serif']
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}