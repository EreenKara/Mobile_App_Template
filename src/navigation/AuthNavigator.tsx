// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { AuthStackParamList } from './NavigationTypes';
import { LoginScreen } from '@screens/auth/index';
import { RegisterScreen } from '@screens/auth/index';
import { ForgotPasswordScreen } from '@screens/auth/index';
import EmailConfirmScreen from '@screens/auth/EmailConfirm';
import DenemeScreen from '@screens/auth/Deneme';
import customColors, { defaultColors } from '@styles/tailwind.colors';
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
   // Responsive header title styles based on platform and screen size
   const getHeaderTitleStyle = () => ({
      fontFamily: 'Inter-Regular', // appFont
      fontWeight: '600' as const,
      fontSize: Platform.select({
         ios: 17,
         android: 20,
      }),
      color: customColors.appText, // appText color
   });

   // Common screen options with Tailwind colors
   const commonScreenOptions = {
      headerStyle: {
         backgroundColor: customColors.appTransition, // appTransition color from tailwind.config.js
      },
      headerTintColor: customColors.appIcon, // appText color
      headerTitleStyle: getHeaderTitleStyle(),
      headerShadowVisible: false,
      headerShown: true,
      headerTitleAlign: 'center' as const,
      // Responsive header styling
      headerBackTitleVisible: false,
      headerBackButtonMenuEnabled: false,
      // Animation and presentation
      animation: 'slide_from_right' as const,
      animationDuration: 300,
   };

   return (
      <Stack.Navigator id={undefined} initialRouteName="Login" screenOptions={commonScreenOptions}>
         {/* Login Screen - No Header */}
         <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
               title: 'Giriş Yap',
               headerShown: false,
               // Custom animation for entry screen
               animation: 'fade',
               animationDuration: 200,
            }}
         />

         {/* Register Screen */}
         <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
               title: 'Kayıt Ol',
               headerShown: false,
               // Custom back button styling
               headerTintColor: customColors.appIcon, // appButton color
               headerStyle: {
                  backgroundColor: customColors.appTransition, // appTransition
               },
               // Responsive title positioning
               headerTitleAlign: Platform.select({
                  ios: 'center',
                  android: 'left',
               }),
            }}
         />

         {/* Forgot Password Screen - Modal Presentation */}
         <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
               title: 'Şifremi Unuttum',
               presentation: 'modal',
               headerShown: true,
               // Modal specific styling
               headerStyle: {
                  backgroundColor: customColors.appBackground, // appBackground for modals
               },
               headerTitleStyle: {
                  ...getHeaderTitleStyle(),
                  fontSize: Platform.select({
                     ios: 16,
                     android: 18,
                  }),
               },
               // Modal animations
               animation: 'slide_from_bottom',
               animationDuration: 400,
            }}
         />

         {/* Email Confirmation Screen - Modal */}
         <Stack.Screen
            name="EmailConfirm"
            component={EmailConfirmScreen}
            options={{
               title: 'Email Doğrulama',
               presentation: 'modal',
               headerShown: true,
               // Success/confirmation styling
               headerStyle: {
                  backgroundColor: customColors.appBackground, // appBackground
               },
               headerTintColor: customColors.appIcon, // appButton
               headerTitleStyle: {
                  ...getHeaderTitleStyle(),
                  color: customColors.appButton, // appButton color for confirmation
               },
               // Prevent dismissal by swipe for important screens
               gestureEnabled: false,
               animation: 'slide_from_bottom',
            }}
         />

         {/* Demo/Test Screen */}
         <Stack.Screen
            name="Deneme"
            component={DenemeScreen}
            options={{
               title: 'Test Sayfası',
               presentation: 'modal',
               headerShown: true,
               // Development/test styling
               headerStyle: {
                  backgroundColor: customColors.appTransition, // appTransition
               },
               headerTitleStyle: {
                  ...getHeaderTitleStyle(),
                  color: customColors.appIcon, // appIcon color for test screens
               },
               animation: 'fade_from_bottom',
            }}
         />
      </Stack.Navigator>
   );
};

export default AuthNavigator;
