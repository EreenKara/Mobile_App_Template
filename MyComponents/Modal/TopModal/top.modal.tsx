import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';

interface TopModalComponentProps {
   isOpen: boolean;
   children: React.ReactNode;
   style?: any;
   onClose: () => void;
   message?: string;
   description?: string;
}

const TopModalComponent: React.FC<TopModalComponentProps> = ({
   isOpen,
   children,
   style,
   onClose,
   message = 'Bilgilendirme',
   description = '',
}) => {
   useEffect(() => {
      if (isOpen) {
         Toast.show({
            type: 'info',
            text1: message,
            text2: description,
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 50,
            onHide: onClose,
         });
      }
   }, [isOpen]);

   return (
      <View className={`absolute top-0 left-4 right-4 z-[1000] ${style}`}>
         <Toast
            config={{
               info: ({ text1, text2 }) => (
                  <View className="bg-appCardBackground px-6 py-4 rounded-lg flex-row items-center justify-between shadow-md">
                     <View className="flex-1">
                        <Text className="text-base text-appText" numberOfLines={2}>
                           {text1}
                        </Text>
                        {text2 ? (
                           <Text className="text-base text-appText mt-1" numberOfLines={1}>
                              {text2}
                           </Text>
                        ) : null}
                        {children && <View className="mt-2">{children}</View>}
                     </View>
                     <View className="ml-4">
                        <Text>📈</Text>
                     </View>
                  </View>
               ),
            }}
         />
      </View>
   );
};

export default TopModalComponent;
