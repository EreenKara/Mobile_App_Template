import {
   TouchableWithoutFeedback,
   View,
   Modal,
   KeyboardAvoidingView,
   Platform,
} from 'react-native';
import React from 'react';

interface CenteredModalComponentProps {
   isOpen: boolean;
   onClose: () => void;
   withInput?: boolean;
   children: React.ReactNode;
   style?: string;
}

const CenteredModalComponent: React.FC<CenteredModalComponentProps> = ({
   isOpen,
   withInput,
   children,
   style = '',
   onClose,
   ...rest
}) => {
   const content = withInput ? (
      <TouchableWithoutFeedback onPress={onClose}>
         <View className="flex-1 items-center justify-center bg-appTransparentColor w-full h-full">
            <TouchableWithoutFeedback>
               <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  className={`bg-appCardBackground p-4 mx-4 w-[90%] h-[35%] rounded-2xl items-center shadow-md ${style}`}>
                  {children}
               </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
         </View>
      </TouchableWithoutFeedback>
   ) : (
      <TouchableWithoutFeedback onPress={onClose}>
         <View className="flex-1 items-center justify-center bg-appTransparentColor w-full h-full">
            <TouchableWithoutFeedback>
               <View
                  className={`bg-appCardBackground p-4 mx-4 w-[90%] h-[35%] rounded-lg items-center shadow-md ${style}`}>
                  {children}
               </View>
            </TouchableWithoutFeedback>
         </View>
      </TouchableWithoutFeedback>
   );

   return (
      <Modal
         visible={isOpen}
         transparent
         animationType="fade"
         statusBarTranslucent
         {...rest}
         onRequestClose={onClose}>
         {content}
      </Modal>
   );
};

export default CenteredModalComponent;
