import React, { useState } from 'react';
import {
   View,
   Text,
   TextInput,
   TextInputProps,
   TextProps,
   TouchableOpacity,
   ViewProps,
} from 'react-native';

interface TextInputComponentProps extends Omit<TextInputProps, 'style'> {
   label?: string;
   error?: string;
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   onPress?: () => void;
   style?: string;
   viewStyle?: string;
   labelStyle?: string;
   multiline?: boolean;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
   label = '',
   error,
   leftIcon,
   rightIcon,
   style,
   viewStyle,
   labelStyle,
   onFocus,
   onBlur,
   onPress,
   placeholderTextColor,
   multiline = false,
   ...restProps
}) => {
   const [isFocused, setIsFocused] = useState(false);

   return (
      <View className="w-full">
         {/* Label */}
         {label && <Text className={`text-base font-semibold mb-1 ${labelStyle}`}>{label}</Text>}

         {/* Input Container */}
         <View
            className={`
          flex-row items-center rounded-md px-3 py-2 bg-appBackground
          ${isFocused ? 'border-2 border-appButton' : 'border border-appBorderColor'}
          ${error ? 'border-appError' : ''}
          ${viewStyle ? viewStyle : ''}
        `}>
            {leftIcon && (
               <TouchableOpacity onPress={onPress}>
                  <View className="p-4 px-8">{leftIcon}</View>
               </TouchableOpacity>
            )}

            <TextInput
               {...restProps}
               className={`flex-1 text-base text-appText ${style}`}
               placeholderTextColor={placeholderTextColor}
               multiline={multiline}
               onFocus={e => {
                  setIsFocused(true);
                  onFocus?.(e);
               }}
               onBlur={e => {
                  setIsFocused(false);
                  onBlur?.(e);
               }}
            />

            {rightIcon && (
               <TouchableOpacity onPress={onPress}>
                  <View className="ml-2">{rightIcon}</View>
               </TouchableOpacity>
            )}
         </View>

         {/* Error */}
         {error && (
            <View className="flex-row items-center mt-1">
               <Text className="text-appError mr-1">❗</Text>
               <Text className="text-appError text-sm">{error}</Text>
            </View>
         )}
      </View>
   );
};

export default TextInputComponent;
