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
         fontFamily: {
            appFont: ['Inter', 'sans-serif'],
         },
         colors: {
            appButton: '#056161', // tiklanabilir ögeler ve focused olan ögelerin renkleri
            appButtonText: '#fff',
            appBackground: '#E0F7FA', // background renkleri
            appCardButton: '#1E5F74', // kart buton renkleri ve arka plandan ayrılan ögelerin button renkleri
            appCardBackground: '#334C64', // kart arka planları ve arka plandan ayrılan ögelerin renkleri
            appTransition: '#CBF2F6', // background ile aynı olsun istemiyorsun ama ona yakın bir renk olsun istiyorsun.
            appCardText: '#BFCCCE', // kart içerisindeki text renkleri
            appText: '#000', // text renkleri
            appDisabled: '#193333', // herhangi bir tıklanabilir öge disabled oldugunda renkleri
            appTransparentColor: 'rgba(0,0,0,0.3)', // arka plan'ın blurlaşmasının rengi
            appBar: '#CBF2F6',
            appMapFill: '#C62F2F',
            appMapStroke: '#011818',
            appMapSelectedFill: '#E48679',
            appMapSelectedStroke: 'white',
            appCreditCard: '#D1E1F0',
            appError: 'red', // hata renkleri
            appErrorButton: '#891515', // hata renkleri
            appWarning: '#D2C537',
            appBorderColor: '#056161',
            appIndicator: '#0a7ea4', // herhangi tutmaç, garip button gibi etkileşime girilebilen öğenin içerisindeki kısım. Switch'in kafası örneğin.
            appIcon: '#345C6F',
            appPlaceholder: '#999999',
         },
      },
   },
   plugins: [],
};
