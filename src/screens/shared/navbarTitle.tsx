import React from 'react';
import { View, Image as RNImage, Text, Platform } from 'react-native';
import { cssInterop } from 'nativewind';
import ImageComponent from '@mycomponents/Image';

interface NavBarTitleProps {
   variant?: 'logo';
   title?: string;
   showSubtitle?: boolean;
   subtitle?: string;
   size?: 'small' | 'medium' | 'large';
}

const NavBarTitle: React.FC<NavBarTitleProps> = ({
   variant = 'logo',
   title = 'MyApp',
   showSubtitle = false,
   subtitle = '',
   size = 'medium',
}) => {
   // Responsive sizing based on platform and size prop
   const getSizing = () => {
      const sizes = {
         small: {
            height: Platform.select({ ios: 32, android: 36 }),
            width: Platform.select({ ios: 38, android: 43 }),
            iconSize: 20,
            fontSize: 16,
            subtitleSize: 12,
         },
         medium: {
            height: Platform.select({ ios: 40, android: 44 }),
            width: Platform.select({ ios: 48, android: 53 }),
            iconSize: 24,
            fontSize: 18,
            subtitleSize: 14,
         },
         large: {
            height: Platform.select({ ios: 48, android: 52 }),
            width: Platform.select({ ios: 58, android: 62 }),
            iconSize: 28,
            fontSize: 20,
            subtitleSize: 16,
         },
      };
      return sizes[size];
   };

   const sizing = getSizing();

   // Logo variant - Enhanced with responsive design
   if (variant === 'logo') {
      return (
         <View className="flex-row items-center justify-center bg-appBackground">
            <ImageComponent
               source={require('@assets/images/nav_logo.png')}
               className="mb-1 text-appIcon"
               style={{
                  height: sizing.height,
                  width: sizing.width,
                  resizeMode: 'contain',
               }}
            />
            {showSubtitle && subtitle && (
               <View className="ml-2">
                  <Text
                     className="text-appText font-appFont"
                     style={{ fontSize: sizing.subtitleSize }}>
                     {subtitle}
                  </Text>
               </View>
            )}
         </View>
      );
   }

   // Fallback to logo
   return (
      <ImageComponent
         source={require('@assets/images/nav_logo.png')}
         style={{
            height: sizing.height,
            width: sizing.width,
            resizeMode: 'contain',
         }}
         className="mb-1 text-appIcon"
      />
   );
};

export default NavBarTitle;
