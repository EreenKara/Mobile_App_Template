/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './App.{js,jsx,ts,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
      './MyComponents/**/*.{js,jsx,ts,tsx}',
   ],
   presets: [require('nativewind/preset')],
   theme: {
      extend: {
         colors: {
            vuejs: '#ff0000',
         },
      },
   },
   plugins: [],
};
