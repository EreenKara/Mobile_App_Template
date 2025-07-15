import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config.js';
import colors from 'tailwindcss/colors';

export interface CustomColors {
   appShadow: string; // iOS shadow color
   appButton: string; // tiklanabilir ögeler ve focused olan ögelerin renkleri
   appButtonText: string;
   appBackground: string; // background renkleri
   appCardButton: string; // kart buton renkleri ve arka plandan ayrılan ögelerin button renkleri
   appCardBackground: string; // kart arka planları ve arka plandan ayrılan ögelerin renkleri
   appTransition: string; // background ile aynı olsun istemiyorsun ama ona yakın bir renk olsun istiyorsun.
   appCardText: string; // kart içerisindeki text renkleri
   appText: string; // text renkleri
   appDisabled: string; // herhangi bir tıklanabilir öge disabled oldugunda renkleri
   appTransparentColor: string; // arka plan'ın blurlaşmasının rengi
   appBar: string;
   appMapFill: string;
   appMapStroke: string;
   appMapSelectedFill: string;
   appMapSelectedStroke: string;
   appCreditCard: string;
   appError: string; // hata renkleri
   appErrorButton: string; // hata renkleri
   appWarning: string;
   appWarningText: string;
   appWarningBackground: string;
   appWarningBorder: string;
   appBorderColor: string;
   appIndicator: string; // herhangi tutmaç, garip button gibi etkileşime girilebilen öğenin içerisindeki kısım. Switch'in kafası örneğin.
   appIcon: string;
   appPlaceholder: string;
}

const fullConfig = resolveConfig(tailwindConfig);
const customColors: CustomColors = fullConfig.theme?.colors;

export const defaultColors = colors;
export default customColors;
