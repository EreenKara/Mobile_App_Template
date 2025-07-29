import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { ProfileStackParamList } from './NavigationTypes';
import useTailwindColors from '@styles/tailwind.colors';
import NavBarTitle from '@screens/shared/navbarTitle';
import ProfileScreen from '@screens/profile/Profile';
import SettingsScreen from '@screens/profile/Settings';
import PaymentScreen from '@screens/profile/Payment';
import AddCardScreen from '@screens/profile/Payment/add.card';
import PersonalInformationScreen from '@screens/profile/PersonalInformation';
import AddressInformationScreen from '@screens/profile/AddressInformation';
import SharedNavigator from './SharedNavigator';
import AddressChangeScreen from '@screens/profile/AddressChange';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
   const tailwindColors = useTailwindColors();

   // Common screen options
   const commonScreenOptions = {
      headerShown: true,
      headerTitleAlign: 'center' as const,
      headerStyle: {
         backgroundColor: tailwindColors.appTransition,
      },
      headerTitleStyle: {
         fontFamily: 'Inter-Regular',
         fontWeight: '600' as const,
         fontSize: Platform.select({ ios: 17, android: 20 }),
         color: tailwindColors.appText,
      },
      headerTintColor: tailwindColors.appButton,
      headerBackTitleVisible: false,
      animation: 'slide_from_right' as const,
      // Status bar configuration
      statusBarStyle: 'dark' as const,
      statusBarBackgroundColor: tailwindColors.appBar,
   };

   return (
      <Stack.Navigator
         id={undefined}
         initialRouteName="ProfileMain"
         screenOptions={commonScreenOptions}>
         {/* Main Profile Screen */}
         <Stack.Screen
            name="ProfileMain"
            component={ProfileScreen}
            options={{
               title: 'Profil',
               headerShown: false,
            }}
         />

         {/* Settings Screens */}
         <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />

         <Stack.Screen
            name="PersonalInformation"
            component={PersonalInformationScreen}
            options={{ title: 'Kişisel Bilgiler' }}
         />

         <Stack.Screen
            name="AddressInformation"
            component={AddressInformationScreen}
            options={{ title: 'Adres Bilgileri' }}
         />

         <Stack.Screen
            name="AddressChange"
            component={AddressChangeScreen}
            options={{
               title: 'Adres Değiştir',
               presentation: 'modal',
            }}
         />

         {/* Payment Screens */}
         <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Ödeme Yöntemleri' }}
         />

         <Stack.Screen
            name="AddCard"
            component={AddCardScreen}
            options={{
               title: 'Kart Ekle',
               presentation: 'modal',
            }}
         />

         {/* Shared Navigator */}
         <Stack.Screen name="Shared" component={SharedNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
   );
};

export default ProfileNavigator;
