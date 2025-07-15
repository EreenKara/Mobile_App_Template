/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './App.{js,jsx,ts,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
      './MyComponents/**/*.{js,jsx,ts,tsx}',
   ],
   presets: [require('nativewind/preset')],
   darkMode: 'class', // Enable dark mode
   theme: {
      extend: {
         fontFamily: {
            appFont: ['Inter', 'sans-serif'],
         },
         colors: {
            // CSS Variables - Automatically switch based on theme
            appButton: 'rgb(var(--color-app-button) / <alpha-value>)',
            appButtonText: 'rgb(var(--color-app-button-text) / <alpha-value>)',
            appBackground: 'rgb(var(--color-app-background) / <alpha-value>)',
            appCardButton: 'rgb(var(--color-app-card-button) / <alpha-value>)',
            appCardBackground: 'rgb(var(--color-app-card-background) / <alpha-value>)',
            appTransition: 'rgb(var(--color-app-transition) / <alpha-value>)',
            appCardText: 'rgb(var(--color-app-card-text) / <alpha-value>)',
            appText: 'rgb(var(--color-app-text) / <alpha-value>)',
            appDisabled: 'rgb(var(--color-app-disabled) / <alpha-value>)',
            appTransparentColor: 'rgb(var(--color-app-transparent) / <alpha-value>)',
            appBar: 'rgb(var(--color-app-bar) / <alpha-value>)',
            appMapFill: 'rgb(var(--color-app-map-fill) / <alpha-value>)',
            appMapStroke: 'rgb(var(--color-app-map-stroke) / <alpha-value>)',
            appMapSelectedFill: 'rgb(var(--color-app-map-selected-fill) / <alpha-value>)',
            appMapSelectedStroke: 'rgb(var(--color-app-map-selected-stroke) / <alpha-value>)',
            appCreditCard: 'rgb(var(--color-app-credit-card) / <alpha-value>)',
            appError: 'rgb(var(--color-app-error) / <alpha-value>)',
            appErrorButton: 'rgb(var(--color-app-error-button) / <alpha-value>)',
            appWarning: 'rgb(var(--color-app-warning) / <alpha-value>)',
            appBorderColor: 'rgb(var(--color-app-border) / <alpha-value>)',
            appIndicator: 'rgb(var(--color-app-indicator) / <alpha-value>)',
            appIcon: 'rgb(var(--color-app-icon) / <alpha-value>)',
            appPlaceholder: 'rgb(var(--color-app-placeholder) / <alpha-value>)',
         },
      },
   },
   plugins: [],
};
