import React, { useRef } from 'react';
import {
   Pressable,
   Text,
   View,
   Image,
   Dimensions,
   Animated,
   useWindowDimensions,
} from 'react-native';

interface ChoiceCardComponentProps {
   title: string;
   image: any;
   onPress: () => void;
   height?: number;
   description?: string;
   tintColor?: string;
   disabled?: boolean;
   variant?: 'default' | 'compact' | 'elevated';
   size?: 'small' | 'medium' | 'large';
   className?: string;
   aspectRatio?: number;
   showShadow?: boolean;
   borderStyle?: 'solid' | 'dashed' | 'none';
}

const ChoiceCardComponent: React.FC<ChoiceCardComponentProps> = ({
   title,
   image,
   description,
   onPress,
   tintColor,
   height,
   disabled = false,
   variant = 'default',
   size = 'medium',
   className = '',
   aspectRatio = 0.77,
   showShadow = true,
   borderStyle = 'solid',
}) => {
   const { width: windowWidth } = useWindowDimensions();
   const scaleValue = useRef(new Animated.Value(1)).current;
   const opacityValue = useRef(new Animated.Value(1)).current;

   // Size configurations
   const sizeConfig = {
      small: {
         container: 'p-3 m-2 rounded-lg',
         title: 'text-base sm:text-lg',
         description: 'text-sm sm:text-base',
         defaultHeight: windowWidth * 0.6,
         borderWidth: 2,
         spacing: 'mb-2',
         spacingTop: 'mt-2',
      },
      medium: {
         container: 'p-4 m-3 rounded-xl',
         title: 'text-lg sm:text-xl',
         description: 'text-base sm:text-lg',
         defaultHeight: windowWidth * 0.8,
         borderWidth: 3,
         spacing: 'mb-3',
         spacingTop: 'mt-3',
      },
      large: {
         container: 'p-5 m-4 rounded-2xl',
         title: 'text-xl sm:text-2xl',
         description: 'text-lg sm:text-xl',
         defaultHeight: windowWidth * 1.0,
         borderWidth: 4,
         spacing: 'mb-4',
         spacingTop: 'mt-4',
      },
   };

   // Variant configurations
   const variantConfig = {
      default: {
         background: 'bg-appBackground',
         border: 'border-appBorderColor',
         titleColor: 'text-appText',
         descriptionColor: 'text-appIcon',
      },
      compact: {
         background: 'bg-appTransition',
         border: 'border-appButton',
         titleColor: 'text-appText',
         descriptionColor: 'text-appText/70',
      },
      elevated: {
         background: 'bg-appCardBackground',
         border: 'border-appCardButton',
         titleColor: 'text-appCardText',
         descriptionColor: 'text-appCardText/70',
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];
   const cardHeight = height || currentSize.defaultHeight;
   const imageHeight = cardHeight * aspectRatio;

   // Animation handlers
   const handlePressIn = () => {
      Animated.parallel([
         Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 150,
            friction: 4,
         }),
         Animated.timing(opacityValue, {
            toValue: 0.8,
            duration: 150,
            useNativeDriver: true,
         }),
      ]).start();
   };

   const handlePressOut = () => {
      Animated.parallel([
         Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 150,
            friction: 4,
         }),
         Animated.timing(opacityValue, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
         }),
      ]).start();
   };

   // Border style classes
   const getBorderStyle = () => {
      switch (borderStyle) {
         case 'dashed':
            return 'border-dashed';
         case 'none':
            return 'border-0';
         default:
            return 'border-solid';
      }
   };

   // Disabled styles
   const disabledStyles = disabled ? 'opacity-50' : '';

   return (
      <Animated.View
         style={{
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
         }}>
         <Pressable
            className={`
          flex-col justify-between
          ${currentSize.container}
          ${currentVariant.background}
          ${currentVariant.border}
          ${getBorderStyle()}
          ${disabledStyles}
          ${className}
        `}
            style={[
               {
                  borderWidth: currentSize.borderWidth,
                  height: cardHeight,
               },
               showShadow && {
                  shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                  shadowOffset: {
                     width: 0,
                     height: 4,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 8,
               },
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            disabled={disabled}
            android_ripple={{
               color: 'rgb(var(--color-app-button) / 0.1)',
               borderless: false,
            }}>
            {/* Title */}
            <Text
               className={`
          ${currentVariant.titleColor} 
          font-appFont font-bold text-center
          ${currentSize.title}
          ${currentSize.spacing}
        `}>
               {title}
            </Text>

            {/* Image */}
            <View className="flex-1 items-center justify-center">
               <Image
                  source={image}
                  style={{
                     width: '100%',
                     height: imageHeight,
                     tintColor: tintColor || 'rgb(var(--color-app-icon))',
                  }}
                  resizeMode="contain"
               />
            </View>

            {/* Description */}
            {description && (
               <Text
                  className={`
            ${currentVariant.descriptionColor}
            font-appFont text-center
            ${currentSize.description}
            ${currentSize.spacingTop}
          `}>
                  {description}
               </Text>
            )}

            {/* Disabled Overlay */}
            {disabled && (
               <View className="absolute inset-0 bg-appTransparentColor/30 rounded-xl items-center justify-center">
                  <View className="bg-appDisabled px-3 py-1 rounded-full">
                     <Text className="text-appButtonText font-appFont text-sm font-medium">
                        Devre Dışı
                     </Text>
                  </View>
               </View>
            )}

            {/* Selection Indicator */}
            <View className="absolute top-2 right-2">
               <View className="w-6 h-6 rounded-full bg-appButton/20 items-center justify-center">
                  <View className="w-3 h-3 rounded-full bg-appButton opacity-0" />
               </View>
            </View>
         </Pressable>
      </Animated.View>
   );
};

export default ChoiceCardComponent;
