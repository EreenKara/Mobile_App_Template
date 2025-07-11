import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RadioButtonComponentProps {
   label: string;
   selected: boolean;
   onPress: () => void;
}

const RadioButtonComponent: React.FC<RadioButtonComponentProps> = ({
   label,
   selected,
   onPress,
}) => {
   return (
      <TouchableOpacity onPress={onPress} className="flex-row items-center my-0.5">
         <View
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-appButton mr-2 justify-center items-center ${
               selected ? 'border-appButton' : ''
            }`}>
            {selected && <View className="w-2.5 h-2.5 rounded-full bg-appButton" />}
         </View>
         <Text className="text-base text-black font-appFont">{label}</Text>
      </TouchableOpacity>
   );
};

export default RadioButtonComponent;
