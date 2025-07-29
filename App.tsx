import React, { useEffect } from 'react';
import './global.css';
import { RootState, store } from '@contexts/store'; // Import your Redux store
import { Provider, useSelector } from 'react-redux';
import MainApp from 'MainApp';
import { View } from 'react-native';
import { colorScheme } from 'nativewind';
import DenemeComp from '@screens/swipe/Swipe';

const App = () => {
   useEffect(() => {}, [colorScheme.get()]);
   return (
      <Provider store={store}>
         <View className="flex-1">
            <DenemeComp />
         </View>
      </Provider>
   );
};

export default App;
