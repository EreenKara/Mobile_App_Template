import {
   View,
   Modal,
   SafeAreaView,
   TouchableOpacity,
   StatusBar,
   Image,
   Platform,
} from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from 'react-native-paper';
import ImageComponent from '@mycomponents/Image';

interface FullModalComponentProps {
   isOpen: boolean;
   onClose: () => void;
   withInput?: boolean;
   children: React.ReactNode;
   style?: string;
   title?: string;
}
const FullModalComponent: React.FC<FullModalComponentProps> = ({
   isOpen,
   title,
   children,
   style = '',
   onClose,
   ...rest
}) => {
   return (
      <Modal visible={isOpen} transparent animationType="fade" {...rest} onRequestClose={onClose}>
         <SafeAreaView className={`flex-1 bg-appCardBackground ${style}`}>
            {/* Navbar */}
            <View className="w-full bg-appCardText flex-row items-center justify-between pt-8 mb-4 px-2">
               {/* Sol Close Button */}
               <TouchableOpacity onPress={onClose} className="w-12 h-12 mx-2">
                  <ImageComponent
                     source={require('@assets/images/X.png')}
                     className="w-12 h-12 text-appIcon"
                     size="md"
                  />
               </TouchableOpacity>

               {/* Başlık */}
               <View className="flex-1">
                  <Text className="text-center text-2xl font-appFont text-appCardBackground">
                     {title}
                  </Text>
               </View>

               {/* Sağ boşluk (simetrik boşluk için) */}
               <View className="w-12 h-12 mx-2" />
            </View>

            {/* İçerik */}
            <KeyboardAwareScrollView
               className="flex-1 p-4"
               keyboardShouldPersistTaps="always"
               contentContainerStyle={{ flexGrow: 1 }}>
               {children}
            </KeyboardAwareScrollView>
         </SafeAreaView>
      </Modal>
   );
};

export default FullModalComponent;
