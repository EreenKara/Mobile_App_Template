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
            inter: ['Inter', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif'],
         },
         colors: {
            appbutton: '#056161', // tiklanabilir ögeler ve focused olan ögelerin renkleri
            appbuttonText: '#fff',
            appbackground: '#E0F7FA', // background renkleri
            appcardButton: '#1E5F74', // kart buton renkleri ve arka plandan ayrılan ögelerin button renkleri
            appcardBackground: '#334C64', // kart arka planları ve arka plandan ayrılan ögelerin renkleri
            apptransition: '#CBF2F6', // background ile aynı olsun istemiyorsun ama ona yakın bir renk olsun istiyorsun.
            appcardText: '#BFCCCE', // kart içerisindeki text renkleri
            apptext: '#000', // text renkleri
            appdisabled: '#193333', // herhangi bir tıklanabilir öge disabled oldugunda renkleri
            apptransparentColor: 'rgba(0,0,0,0.3)', // arka plan'ın blurlaşmasının rengi
            appbar: '#CBF2F6',
            appmapFill: '#C62F2F',
            appmapStroke: '#011818',
            appmapSelectedFill: '#E48679',
            appmapSelectedStroke: 'white',
            appcreditCard: '#D1E1F0',
            apperror: 'red', // hata renkleri
            apperrorButton: '#891515', // hata renkleri
            appwarning: '#D2C537',
            appborderColor: '#056161',
            appindicator: '#0a7ea4', // herhangi tutmaç, garip button gibi etkileşime girilebilen öğenin içerisindeki kısım. Switch'in kafası örneğin.
            appicon: '#345C6F',
            appplaceholder: '#999999',
         },
      },
   },
   plugins: [],
};
