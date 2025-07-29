import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps, ImageStyle } from 'react-native';
import { cssInterop } from 'nativewind';

// NativeWind className desteği için cssInterop
const Image = cssInterop(RNImage, {
   className: {
      target: 'style',
      nativeStyleToProp: {
         color: 'tintColor',
      },
   },
});
// ==================== INTERFACES ====================
export interface ImageComponentProps extends Omit<RNImageProps, 'style'> {
   /** NativeWind className - color desteği dahil (text-appIcon gibi) */
   className?: string;

   /** Ek style prop'u (gerekirse) */
   style?: ImageStyle;

   /** Boyut presets */
   size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';

   /** Hızlı border radius */
   rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';

   /** Test ID */
   testID?: string;
}

// ==================== SIZE PRESETS ====================
const sizePresets = {
   xs: 'w-4 h-4', // 16x16
   sm: 'w-6 h-6', // 24x24
   md: 'w-8 h-8', // 32x32
   lg: 'w-12 h-12', // 48x48
   xl: 'w-16 h-16', // 64x64
   custom: '', // Kendi boyutunu belirle
};

// ==================== ROUNDED PRESETS ====================
const roundedPresets = {
   default: 'rounded',
   sm: 'rounded-sm',
   md: 'rounded-md',
   lg: 'rounded-lg',
   full: 'rounded-full',
};

// ==================== MAIN COMPONENT ====================
const ImageComponent: React.FC<ImageComponentProps> = ({
   className = '',
   size = 'custom',
   rounded = false,
   style,
   testID,
   ...props
}) => {
   // Size class'ını al
   const sizeClass = sizePresets[size];

   // Rounded class'ını al
   const roundedClass = rounded ? roundedPresets[rounded === true ? 'default' : rounded] : '';

   // Final className'i oluştur
   const finalClassName = [sizeClass, roundedClass, className].filter(Boolean).join(' ');

   return <Image className={finalClassName} style={style} testID={testID} {...props} />;
};

export default ImageComponent;
