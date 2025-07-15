import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface TextInputComponentProps extends Omit<TextInputProps, 'style'> {
   label?: string;
   error?: string;
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   onPress?: () => void;
   className?: string; // Ana container için
   viewClassName?: string; // Input container için
   labelClassName?: string; // Label için
   inputClassName?: string; // TextInput için
   variant?: 'outlined' | 'filled' | 'standard';
   size?: 'small' | 'medium' | 'large';
   multiline?: boolean;
   // Deprecated but keeping for backward compatibility
   style?: string;
   viewStyle?: string;
   labelStyle?: string;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
   label = '',
   error,
   leftIcon,
   rightIcon,
   className = '',
   viewClassName = '',
   labelClassName = '',
   inputClassName = '',
   variant = 'outlined',
   size = 'medium',
   onFocus,
   onBlur,
   onPress,
   placeholderTextColor = '#999999', // appPlaceholder
   multiline = false,
   secureTextEntry = false,
   // Backward compatibility
   style = '',
   viewStyle = '',
   labelStyle = '',
   ...restProps
}) => {
   const [isFocused, setIsFocused] = useState(false);
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

   // Size responsive styles
   const sizeStyles = {
      small: {
         container: 'px-3 py-2 sm:px-4 sm:py-2.5',
         text: 'text-sm sm:text-base',
         label: 'text-sm sm:text-base mb-1',
      },
      medium: {
         container: 'px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3.5',
         text: 'text-base sm:text-lg',
         label: 'text-base sm:text-lg mb-1 sm:mb-2',
      },
      large: {
         container: 'px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5',
         text: 'text-lg sm:text-xl',
         label: 'text-lg sm:text-xl mb-2 sm:mb-3',
      },
   };

   // Variant styles - responsive focus states
   const variantStyles = {
      outlined: `
         rounded-xl border-2 bg-white
         ${error ? 'border-appError' : isFocused ? 'border-appButton' : 'border-appBorderColor'}
      `,
      filled: `
         rounded-xl border-0
         ${
            error
               ? 'bg-appError/10 border-2 border-appError'
               : isFocused
                 ? 'bg-appButton/10 border-2 border-appButton'
                 : 'bg-appTransition'
         }
      `,
      standard: `
         rounded-none border-0 border-b-2 bg-transparent
         ${error ? 'border-appError' : isFocused ? 'border-appButton' : 'border-appBorderColor'}
      `,
   };

   // Icon size based on component size
   const iconSize = {
      small: 18,
      medium: 20,
      large: 24,
   };

   return (
      <View className={`w-full ${className}`}>
         {/* Label */}
         {label && (
            <Text
               className={`
               font-appFont font-semibold text-appText 
               ${sizeStyles[size].label} 
               ${labelClassName} 
               ${labelStyle}
            `}>
               {label}
            </Text>
         )}

         {/* Input Container */}
         <View
            className={`
            flex-row items-center
            ${sizeStyles[size].container}
            ${variantStyles[variant]}
            ${viewClassName}
            ${viewStyle}
         `}>
            {/* Left Icon */}
            {leftIcon && (
               <TouchableOpacity onPress={onPress} className="mr-3">
                  {leftIcon}
               </TouchableOpacity>
            )}

            {/* Text Input */}
            <TextInput
               {...restProps}
               className={`
                  flex-1 font-appFont text-appText 
                  ${sizeStyles[size].text} 
                  ${inputClassName} 
                  ${style}
               `}
               placeholderTextColor={placeholderTextColor}
               multiline={multiline}
               secureTextEntry={secureTextEntry && !isPasswordVisible}
               onFocus={e => {
                  setIsFocused(true);
                  onFocus?.(e);
               }}
               onBlur={e => {
                  setIsFocused(false);
                  onBlur?.(e);
               }}
            />

            {/* Password Toggle Icon */}
            {secureTextEntry && (
               <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="ml-3">
                  {isPasswordVisible ? (
                     <EyeOff size={iconSize[size]} color="#345C6F" />
                  ) : (
                     <Eye size={iconSize[size]} color="#345C6F" />
                  )}
               </TouchableOpacity>
            )}

            {/* Right Icon */}
            {rightIcon && !secureTextEntry && (
               <TouchableOpacity onPress={onPress} className="ml-3">
                  {rightIcon}
               </TouchableOpacity>
            )}
         </View>

         {/* Error Message */}
         {error && (
            <View className="flex-row items-center mt-1 sm:mt-2">
               <Text className="text-appError mr-1 text-sm sm:text-base">❗</Text>
               <Text className="text-appError text-sm sm:text-base font-appFont">{error}</Text>
            </View>
         )}
      </View>
   );
};

export default TextInputComponent;
