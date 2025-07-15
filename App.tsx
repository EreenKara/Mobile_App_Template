import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import './global.css';
import { NotificationContainer } from '@contexts/slices/notification/NotificationContainer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@navigation/RootNavigator';
import { store } from '@contexts/store'; // Import your Redux store
import { initializeTheme, toggleDarkMode } from '@contexts/slices/settings/settingsSlice';
import { colorScheme } from 'nativewind';
const App = () => {
   // 🚀 App başlangıcında tema'yı initialize et
   useEffect(() => {
      store.dispatch(initializeTheme());
   }, [store]);
   const darkMode = store.getState().settings.darkMode;
   // Single point of theme control
   useEffect(() => {
      colorScheme.set(darkMode ? 'dark' : 'light');
   }, [darkMode]);

   const [fontsLoaded] = useFonts({
      'Inter-Regular': require('./assets/fonts/inter-regular.ttf'),
   });

   if (!fontsLoaded) {
      return <LoadingComponent />; // veya loading screen
   }

   return (
      <Provider store={store}>
         <SafeAreaProvider>
            <NavigationContainer>
               <StatusBar
                  barStyle={darkMode ? 'light-content' : 'dark-content'}
                  backgroundColor={darkMode ? '#1e293b' : '#CBF2F6'}
               />
               <RootNavigator />
            </NavigationContainer>
            <NotificationContainer />
         </SafeAreaProvider>
      </Provider>
   );
};

export default App;
