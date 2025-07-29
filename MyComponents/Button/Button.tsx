import React from 'react';
import {
   TouchableOpacity,
   Text,
   View,
   ActivityIndicator,
   TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
   title: string;
   onPress: () => void;
   variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'error';
   size?: 'small' | 'medium' | 'large';
   className?: string;
   textClassName?: string;
   disabled?: boolean;
   loading?: boolean;
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   fullWidth?: boolean;
}

const ButtonComponent: React.FC<ButtonProps> = ({
   title,
   onPress,
   variant = 'primary',
   size = 'medium',
   className = '',
   textClassName = '',
   disabled = false,
   loading = false,
   leftIcon,
   rightIcon,
   fullWidth = false,
   ...props
}) => {
   // Base responsive styles
   const baseStyle = `flex-row items-center justify-center rounded-2xl ${
      variant !== 'outline' && variant !== 'text' ? 'shadow-md' : ''
   } ${fullWidth ? 'w-full' : 'min-w-[160px] sm:min-w-[180px] md:min-w-[200px]'}`;

   // Size variants - responsive
   const sizeStyles = {
      small: 'px-3 py-2 sm:px-4 sm:py-2.5',
      medium: 'px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4',
      large: 'px-6 py-4 sm:px-7 sm:py-5 md:px-8 md:py-6',
   };

   // Variant styles
   const variantStyles = {
      primary: 'bg-appButton active:bg-appButton/90',
      secondary: 'bg-appCardButton active:bg-appCardButton/90',
      outline: 'bg-appBackground border-2 border-appButton active:bg-appButton/10',
      text: 'active:bg-appButton/10',
      error: 'bg-appErrorButton active:bg-appErrorButton/90',
   };

   // Text styles based on variant - responsive
   const textVariantStyles = {
      primary: 'text-appButtonText',
      secondary: 'text-appButtonText',
      outline: 'text-appButton',
      text: 'text-appButton',
      error: 'text-appButtonText',
   };

   // Text size styles - responsive
   const textSizeStyles = {
      small: 'text-sm sm:text-base',
      medium: 'text-base sm:text-lg md:text-xl',
      large: 'text-lg sm:text-xl md:text-2xl',
   };

   // Disabled styles
   const disabledStyle = disabled || loading ? 'opacity-50 bg-appDisabled' : '';

   // Base text style - responsive
   const textBaseStyle = `font-appFont font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]}`;

   return (
      <TouchableOpacity
         className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyle} ${className}`}
         onPress={onPress}
         disabled={disabled || loading}
         activeOpacity={0.8}
         {...props}>
         {/* Left Icon */}
         {leftIcon && !loading && <View className="mr-2 sm:mr-3">{leftIcon}</View>}

         {/* Loading Indicator */}
         {loading && (
            <View className="mr-2 sm:mr-3">
               <ActivityIndicator
                  size="small"
                  color={variant === 'outline' || variant === 'text' ? '#056161' : '#fff'}
               />
            </View>
         )}

         {/* Button Text */}
         <Text className={`${textBaseStyle} ${textClassName}`}>
            {loading ? 'Yükleniyor...' : title}
         </Text>

         {/* Right Icon */}
         {rightIcon && !loading && <View className="ml-2 sm:ml-3">{rightIcon}</View>}
      </TouchableOpacity>
   );
};

export default ButtonComponent;
