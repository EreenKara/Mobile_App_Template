/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './App.{js,jsx,ts,tsx}',
      './MainApp.{js,jsx,ts,tsx}',
      './deneme.{js,jsx,ts,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
      './MyComponents/**/*.{js,jsx,ts,tsx}',
   ],
   presets: [require('nativewind/preset')],
   theme: {
      extend: {
         fontFamily: {
            appFont: ['Inter', 'sans-serif'],
         },
         colors: {
            // CSS Variables - Automatically switch based on theme
            appButton: '#056161',
            appButtonText: '#ffffff',
            appBackground: '#E0F7FA',
            appCardButton: '#1E5F74',
            appCardBackground: '#334C64',
            appTransition: '#CBF2F6',
            appCardText: '#BFCCCE',
            appText: '#000000',
            appDisabled: '#193333',
            appTransparentColor: 'rgba(0,0,0,0.3)',
            appBar: '#CBF2F6',
            appMapFill: '#C62F2F',
            appMapStroke: '#011818',
            appMapSelectedFill: '#011818',
            appMapSelectedStroke: '#011818',
            appCreditCard: '#011818',
            appError: '#ff0000',
            appErrorButton: '#011818',
            appWarning: '#D2C537',
            appBorderColor: '#056161',
            appIndicator: '#0a7ea4',
            appIcon: '#0561ff',
            appPlaceholder: '#999999',
         },
      },
   },
   plugins: [],
};
