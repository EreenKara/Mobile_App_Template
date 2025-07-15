import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';

import ButtonComponent from '@mycomponents/Button/Button';
import { useDispatch } from 'react-redux';
import { showNotification } from '@contexts/slices/notification/notificationSlice';

interface props {}
const DenemeComp: React.FC<props> = () => {
   const dispatch = useDispatch();

   return (
      <View className="flex-1 mt-10">
         <ButtonComponent
            title="show notification"
            onPress={() => {
               dispatch(
                  showNotification({
                     message: 'Kayıt başarıyla tamamlandı',
                     type: 'success',
                     duration: 3000,
                  }),
               );
            }}
         />
      </View>
   );
};

export default DenemeComp;
