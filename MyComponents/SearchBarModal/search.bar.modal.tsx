import React, { useCallback, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import SearchBarComponent from '@mycomponents/SearchBar/search.bar';
import customColors from '@styles/tailwind.colors';
import FullModalComponent from '@mycomponents/Modal/FullModal/full.modal';
interface SearchBarModalComponentProps {
   handleSearch: () => void;
   title?: string;
   modalTitle?: string;
   searchBarTitle?: string;
   iconTitleStyle?: any;
   style?: any;
   children?: React.ReactNode;
   isOpened?: boolean;
   setIsOpened?: (opened: boolean) => void;
}

const SearchBarModalComponent: React.FC<SearchBarModalComponentProps> = ({
   style,
   title = '',
   iconTitleStyle,
   modalTitle = 'Search',
   searchBarTitle = '',
   handleSearch,
   children,
   isOpened,
   setIsOpened,
}) => {
   const [isOpen, setIsOpen] = useState<boolean>(false);

   const Open = useCallback(() => {
      if (isOpened !== undefined) {
         setIsOpened?.(true);
      } else {
         setIsOpen(true);
      }
   }, [isOpened, setIsOpened]);

   const Close = useCallback(() => {
      if (isOpened !== undefined) {
         setIsOpened?.(false);
      } else {
         setIsOpen(false);
      }
   }, [isOpened, setIsOpened]);

   return (
      <View className="w-4" style={style}>
         {/* Buton */}
         <TouchableOpacity
            onPress={Open}
            className="flex-row items-center self-center px-4 py-2 bg-background rounded-md">
            <Text className="text-base pr-2 text-foreground" style={iconTitleStyle}>
               {title}
            </Text>
            <Image
               source={require('@assets/images/search-icon.png')}
               className="w-5 h-5"
               style={{ tintColor: customColors?.appIcon }} // Tailwind text-gray-500
            />
         </TouchableOpacity>

         {/* Modal */}
         <FullModalComponent isOpen={isOpened ?? isOpen} onClose={Close}>
            <View className="flex-1 bg-background">
               {/* Header */}
               <View className="pt-12 flex-row items-center justify-between px-4 pb-3 border-b border-gray-200">
                  <TouchableOpacity onPress={Close} className="px-2 py-1 rounded-md">
                     <Text className="text-appText">Kapat</Text>
                  </TouchableOpacity>
                  <Text className="text-xl font-bold text-center flex-1 px-6 text-appText">
                     {modalTitle}
                  </Text>
                  <View className="w-6 bg-transparent" />
               </View>

               {/* Search Bar */}
               <View className="flex-1 px-4">
                  {children ?? (
                     <SearchBarComponent
                        modalTitle={searchBarTitle}
                        titleStyle="font-semibold text-lg text-appText"
                        handleSearch={handleSearch}
                     />
                  )}
               </View>
            </View>
         </FullModalComponent>
      </View>
   );
};

export default SearchBarModalComponent;
