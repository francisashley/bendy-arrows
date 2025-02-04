/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  prefix: 'tw-',
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
