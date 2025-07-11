import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@contexts/store';
import RootNavigator from '@navigation/RootNavigator'; // kendi navigasyonunuz
import './global.css';
const App = () => {
   return (
      <Provider store={store}>
         <View>
            <Text>Selam</Text>
            <Text>Merhaba</Text>
            <Text>Merhaba</Text>
            <Text>Merhaba</Text>
            <Text>Merhaba</Text>
            <Text className={`text-appbuttonText`}>Merhaba</Text>
         </View>
      </Provider>
   );
};

export default App;
