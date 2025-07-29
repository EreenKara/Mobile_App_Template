import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import { useDebounce } from '@hooks/modular/useDebounce';

interface SearchBarComponentProps {
   modalTitle?: string;
   placeholder?: string;
   handleSearch?: (value: string) => void;
   inputStyle?: string;
   titleStyle?: string;
   debounceTime?: number;
   debounce?: boolean;
}

const SearchIcon = () => {
   return <Image source={require('@assets/images/search-icon.png')} className="w-5 h-5" />;
};

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
   placeholder = '',
   modalTitle = '',
   handleSearch,
   inputStyle,
   titleStyle,
   debounceTime = 500,
   debounce = false,
}) => {
   const [value, setValue] = useState('');
   const debouncedValue = useDebounce(value, debounceTime);

   useEffect(() => {
      if (debounce) {
         handleSearch?.(debouncedValue);
      }
   }, [debouncedValue]);

   return (
      <View className="w-full px-4">
         <Text className={`text-xl font-semibold text-center mb-2 ${titleStyle}`}>
            {modalTitle}
         </Text>
         <TextInputComponent
            placeholder={placeholder}
            viewStyle={`${inputStyle}`}
            leftIcon={<SearchIcon />}
            value={value}
            onChangeText={setValue}
         />
      </View>
   );
};

export default SearchBarComponent;
