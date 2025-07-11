import React, { useState } from 'react';
import { View, Text } from 'react-native';
import RadioButtonComponent from '@mycomponents/RadioButton/radio.button';

interface OptionGroupProps {
   title: string;
   options: string[];
   onOptionSelect?: (selectedOption: string) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({ title, options, onOptionSelect }) => {
   const [selectedOption, setSelectedOption] = useState<string | null>(null);

   const handlePress = (option: string) => {
      setSelectedOption(option);
      onOptionSelect?.(option);
   };

   return (
      <View className="flex-1 my-4">
         <Text className="text-lg font-semibold text-center mb-4 text-appText font-appFont">
            {title}
         </Text>

         <View className="flex-wrap bg-appTransition p-4 border border-appButton rounded-2xl">
            {options.map(option => (
               <RadioButtonComponent
                  key={option}
                  label={option}
                  selected={selectedOption === option}
                  onPress={() => handlePress(option)}
               />
            ))}
         </View>
      </View>
   );
};

export default OptionGroup;
