import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@contexts/store';
import './global.css';
import ButtonComponent from '@mycomponents/Button/Button';
import SearchBarComponent from '@mycomponents/SearchBar/search.bar';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import { NotificationContainer } from '@contexts/reducers/notification/NotificationContainer';
import { useDispatch } from 'react-redux';
import { showNotification } from '@contexts/reducers/notification/notificationSlice';
import DenemeComp from './deneme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const App = () => {
   const [acikmi, setAcikmi] = useState(false);
   useEffect(() => {
      console.log('acikmi durumu:', acikmi);
   }, [acikmi]);

   return (
      <Provider store={store}>
         <SafeAreaProvider>
            <View className="flex-1 mt-10">
               <DenemeComp />
            </View>
            <NotificationContainer />
         </SafeAreaProvider>
      </Provider>
   );
};

export default App;
