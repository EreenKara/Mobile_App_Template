import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';
const fullConfig = resolveConfig(tailwindConfig);
interface ButtonProps {
   title: string;
   onPress: () => void;
   style?: string;
   textStyle?: string;
   disabled?: boolean;
   leftIcon?: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({
   title,
   onPress,
   style = '',
   textStyle = '',
   disabled = false,
   leftIcon,
   ...props
}) => {
   const baseStyle = `flex-row items-center justify-center px-4 py-3 
    rounded-2xl min-w-[160px] shadow-md bg-appButton`;

   const textBaseStyle = `text-appButtonText text-base font-semibold`;

   const disabledStyle = disabled ? 'opacity-50 bg-appDisabled' : '';

   return (
      <TouchableOpacity
         className={`${baseStyle} ${disabledStyle} ${style}`}
         onPress={onPress}
         disabled={disabled}
         {...props}>
         {leftIcon && <View className="mr-2">{leftIcon}</View>}
         <Text className={`${textBaseStyle} ${textStyle}`}>{title}</Text>
      </TouchableOpacity>
   );
};

export default ButtonComponent;
