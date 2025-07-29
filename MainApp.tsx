// MainApp.tsx
import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@contexts/store';
import RootNavigator from '@navigation/RootNavigator';
import { NotificationContainer } from '@contexts/slices/notification/NotificationContainer';
import { useFonts } from 'expo-font';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colorScheme } from 'nativewind';

const MainApp = () => {
   return (
      <SafeAreaProvider>
         <NavigationContainer>
            <RootNavigator />
         </NavigationContainer>
      </SafeAreaProvider>
   );
};

export default MainApp;
