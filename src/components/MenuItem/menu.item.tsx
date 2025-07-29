import React from 'react';
import {
   TouchableOpacity,
   Text,
   View,
   ImageStyle,
   StyleProp,
   TextStyle,
   ImageSourcePropType,
} from 'react-native';
import { LucideIcon, LucideProps } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import IconComponent from '@mycomponents/LucidImage';
import { useTailwindColors } from '@styles/tailwind.colors';
import ImageComponent from '@mycomponents/Image';
interface MenuItemComponentProps {
   iconComponent?: React.ReactNode;
   icon?: ImageSourcePropType;
   iconLucide?: LucideIcon;
   title: string;
   onPress?: () => void;
   tintColorNW?: string;
   imageStyle?: StyleProp<ImageStyle>;
   textClassName?: string;
   description?: string;
   subtitle?: string; // Profile için eklendi
   rightIcon?: ImageSourcePropType;
   rightIconComponent?: React.ReactNode;
   touchable?: boolean;
   variant?: 'default' | 'card' | 'compact' | 'danger'; // danger eklendi
   size?: 'small' | 'medium' | 'large';
   className?: string;
   showArrow?: boolean;
   disabled?: boolean;
   showBadge?: boolean; // Profile için eklendi
   badgeCount?: number; // Profile için eklendi
}

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
   iconComponent,
   icon,
   iconLucide,
   title,
   tintColorNW = 'text-appIcon',
   imageStyle,
   textClassName = '',
   description = '',
   subtitle = '', // Profile için eklendi
   rightIcon,
   rightIconComponent,
   touchable = true,
   variant = 'default',
   size = 'medium',
   className = '',
   showArrow = true,
   disabled = false,
   showBadge = false, // Profile için eklendi
   badgeCount = 0, // Profile için eklendi
   onPress = () => {},
}) => {
   const colors = useTailwindColors();
   // Responsive sizing configurations
   const sizeConfig = {
      small: {
         container: 'py-2 px-3 sm:py-3 sm:px-4',
         icon: { width: 20, height: 20 },
         text: 'text-sm sm:text-base',
         description: 'text-xs sm:text-sm',
         spacing: 'mr-2 sm:mr-3',
         arrowSize: 16,
      },
      medium: {
         container: 'py-3 px-4 sm:py-4 sm:px-5 md:py-5 md:px-6',
         icon: { width: 32, height: 32 },
         text: 'text-base sm:text-lg',
         description: 'text-sm sm:text-base',
         spacing: 'mr-3 sm:mr-4',
         arrowSize: 20,
      },
      large: {
         container: 'py-4 px-5 sm:py-5 sm:px-6 md:py-6 md:px-7',
         icon: { width: 40, height: 40 },
         text: 'text-lg sm:text-xl',
         description: 'text-base sm:text-lg',
         spacing: 'mr-4 sm:mr-5',
         arrowSize: 24,
      },
   };

   // Variant configurations - danger variant eklendi
   const variantConfig = {
      default: {
         container: 'bg-transparent',
         text: 'text-appText',
         description: 'text-appIcon',
      },
      card: {
         container: 'bg-appCardBackground rounded-xl',
         text: 'text-appCardText',
         description: 'text-appCardText/70',
      },
      compact: {
         container: 'bg-appTransition rounded-lg',
         text: 'text-appText',
         description: 'text-appText/70',
      },
      danger: {
         container: 'bg-appCardBackground',
         text: 'text-appError',
         description: 'text-appError/70',
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];

   // Disabled styles
   const disabledStyles = disabled ? 'opacity-50' : '';

   // Container styles - Profile için güncellenmiş
   const containerStyles = `
    flex-row items-center 
    ${currentSize.container} 
    ${currentVariant.container} 
    ${disabledStyles} 
    ${className}
  `;

   // Icon tint color - danger variant için özel renk
   const iconTintColor = variant === 'danger' ? 'text-appError' : tintColorNW || colors.appIcon;

   // Content component
   const ContentComponent = (
      <View className="flex-row items-center flex-1">
         {/* Left Icon - Profile için icon container */}
         {iconComponent && (
            <View className={`w-10 h-10 items-center justify-center ${currentSize.spacing}`}>
               {iconComponent}
            </View>
         )}
         {icon && !iconComponent && (
            <View className={`w-10 h-10 items-center justify-center ${currentSize.spacing}`}>
               <ImageComponent source={icon} className="w-4 h-4 ml-2" resizeMode="contain" />
            </View>
         )}
         {/* Icon rendering based  on type */}
         {iconLucide && !iconComponent && (
            <View className={`w-10 h-10 items-center justify-center ${currentSize.spacing}`}>
               <IconComponent Icon={iconLucide} size={24} className={iconTintColor} />
            </View>
         )}

         {/* Text Content */}
         <View className="flex-1">
            <Text
               className={`
            font-medium text-base
            ${textClassName}
          `}>
               {title}
            </Text>

            {/* Subtitle veya description göster */}
            {(subtitle || description) && (
               <Text
                  className={`text-sm mt-1 
              ${textClassName}
            `}>
                  {subtitle || description}
               </Text>
            )}
         </View>

         {/* Badge - Profile için eklendi */}
         {showBadge && badgeCount > 0 && (
            <View className="bg-appError rounded-full w-6 h-6 items-center justify-center mr-3">
               <Text className="text-appButtonText text-xs font-bold">
                  {badgeCount > 99 ? '99+' : badgeCount}
               </Text>
            </View>
         )}

         {/* Right Content */}
         <View className="flex-row items-center">
            {rightIconComponent && <View className="ml-2">{rightIconComponent}</View>}

            {rightIcon && (
               <ImageComponent source={rightIcon} className="w-4 h-4 ml-2" resizeMode="contain" />
            )}

            {showArrow && touchable && !rightIcon && !rightIconComponent && (
               <View className="ml-2">
                  <IconComponent Icon={ChevronRight} size={20} className="text-appIcon" />
               </View>
            )}
         </View>
      </View>
   );

   // Return touchable or non-touchable version
   if (touchable && !disabled) {
      return (
         <TouchableOpacity className={containerStyles} onPress={onPress} activeOpacity={0.7}>
            {ContentComponent}
         </TouchableOpacity>
      );
   }

   return <View className={containerStyles}>{ContentComponent}</View>;
};

// Profile sayfası için uyumlu export
export default MenuItemComponent;
