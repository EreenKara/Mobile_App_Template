import { useMemo } from 'react';
import { useColorScheme } from 'nativewind';

export interface ColorTypes {
   appButton: string;
   appButtonText: string;
   appBackground: string;
   appCardButton: string;
   appCardBackground: string;
   appTransition: string;
   appCardText: string;
   appText: string;
   appDisabled: string;
   appTransparentColor: string;
   appBar: string;
   appMapFill: string;
   appMapStroke: string;
   appMapSelectedFill: string;
   appMapSelectedStroke: string;
   appCreditCard: string;
   appError: string;
   appErrorButton: string;
   appWarning: string;
   appBorderColor: string;
   appIndicator: string;
   appIcon: string;
   appPlaceholder: string;
}

const lightColors: ColorTypes = {
   appButton: '#056161',
   appButtonText: '#ffffff',
   appBackground: '#E0F7FA',
   appCardButton: '#1E5F74',
   appCardBackground: '#334C64',
   appTransition: '#CBF2F6',
   appCardText: '#BFCCCE',
   appText: '#000000',
   appDisabled: '#193333',
   appTransparentColor: '#000000',
   appBar: '#CBF2F6',
   appMapFill: '#C62F2F',
   appMapStroke: '#011818',
   appMapSelectedFill: '#E48679',
   appMapSelectedStroke: '#ffffff',
   appCreditCard: '#D1E1F0',
   appError: '#ff0000',
   appErrorButton: '#891515',
   appWarning: '#D2C537',
   appBorderColor: '#056161',
   appIndicator: '#0a7ea4',
   appIcon: '#345C6F',
   appPlaceholder: '#999999',
};

const darkColors: ColorTypes = {
   appButton: '#08a0a0',
   appButtonText: '#ffffff',
   appBackground: '#0f172a',
   appCardButton: '#1e40af',
   appCardBackground: '#1e293b',
   appTransition: '#334155',
   appCardText: '#e2e8f0',
   appText: '#f8fafc',
   appDisabled: '#64748b',
   appTransparentColor: '#ffffff',
   appBar: '#1e293b',
   appMapFill: '#ef4444',
   appMapStroke: '#011818',
   appMapSelectedFill: '#f97316',
   appMapSelectedStroke: '#fbbf24',
   appCreditCard: '#475569',
   appError: '#ef4444',
   appErrorButton: '#dc2626',
   appWarning: '#eab308',
   appBorderColor: '#475569',
   appIndicator: '#06b6d4',
   appIcon: '#94a3b8',
   appPlaceholder: '#64748b',
};

export const useTailwindColors = (): ColorTypes => {
   const { colorScheme } = useColorScheme();

   const tailwindColors = useMemo(() => {
      return colorScheme === 'light' ? lightColors : darkColors;
   }, [colorScheme]);

   return tailwindColors;
};

export default useTailwindColors;
