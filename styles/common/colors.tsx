import {Appearance, ColorSchemeName} from 'react-native';

export interface ColorsSchema {
  button: string;
  buttonText: string;
  background: string;
  cardButton: string;
  cardBackground: string;
  transition: string;
  text: string;
  cardText: string;
  disabled: string;
  transparentColor: string;
  bar: string;
  mapFill: string;
  mapStroke: string;
  mapSelectedFill: string;
  mapSelectedStroke: string;
  creditCard: string;
  warning: string;
  error: string;
  errorButton: string;
  borderColor: string;
  indicator: string;
  icon: string;
  placeholder: string;
}
const light: ColorsSchema = {
  button: '#056161', // tiklanabilir ögeler ve focused olan ögelerin renkleri
  buttonText: '#fff',
  background: '#E0F7FA', // background renkleri
  cardButton: '#1E5F74', // kart buton renkleri ve arka plandan ayrılan ögelerin button renkleri
  cardBackground: '#334C64', // kart arka planları ve arka plandan ayrılan ögelerin renkleri
  transition: '#CBF2F6', // background ile aynı olsun istemiyorsun ama ona yakın bir renk olsun istiyorsun.
  cardText: '#BFCCCE', // kart içerisindeki text renkleri
  text: '#000', // text renkleri
  disabled: '#193333', // herhangi bir tıklanabilir öge disabled oldugunda renkleri
  transparentColor: 'rgba(0,0,0,0.3)', // arka plan'ın blurlaşmasının rengi
  bar: '#CBF2F6',
  mapFill: '#C62F2F',
  mapStroke: '#011818',
  mapSelectedFill: '#E48679',
  mapSelectedStroke: 'white',
  creditCard: '#D1E1F0',
  error: 'red', // hata renkleri
  errorButton: '#891515', // hata renkleri
  warning: '#D2C537',
  borderColor: '#056161',
  indicator: '#0a7ea4', // herhangi tutmaç, garip button gibi etkileşime girilebilen öğenin içerisindeki kısım. Switch'in kafası örneğin.
  icon: '#345C6F',
  placeholder: '#999999',
};

const dark: ColorsSchema = {
  button: '#022727',
  buttonText: '#fff',
  background: '#167F8D',
  cardButton: '#3E2541',
  cardBackground: '#704375',
  transition: '#0E5058',
  text: '#fff',
  cardText: '#E0EAEB',
  disabled: '#A3D8D8',
  transparentColor: 'rgba(0,0,0,0.2)',
  bar: '#0E5058',
  mapFill: '#952323',
  mapStroke: '#000000',
  mapSelectedFill: '#056161',
  mapSelectedStroke: 'white',
  creditCard: '#D1E1F0',
  warning: '#DDD169',
  error: 'red',
  errorButton: '#891515',
  borderColor: '#fff',
  indicator: '#0a7ea4',
  icon: '#9BA1A6',
  placeholder: '#666666',
};

const Colors = {
  light: light,
  dark: dark,

  // Otomatik tema seçimi
  getTheme: (colorScheme?: ColorSchemeName) => {
    // Eğer colorScheme belirtilmemişse, cihazın mevcut temasını al
    const theme = colorScheme;
    // Tema seçimi
    switch (theme) {
      case 'dark':
        return dark;
      case 'light':
      default:
        return light;
    }
  },

  getThemeName: () => {
    // theme'lar color'dan farklı bir mantık ama burdan çekmek istedim.
    const theme = 'primary';
    return theme;
  },
};

export default Colors;
