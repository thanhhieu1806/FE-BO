const { extend } = require('./src/design-tokens/tailwindTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend,
  },
  plugins: [],
};
