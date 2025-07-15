import React from 'react';
import {
   createNativeStackNavigator,
   NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList, SharedStackParamList } from './NavigationTypes';
import NavBarTitle from '@screens/shared/navbar_title';
import ErrorScreen from '@screens/shared/Error/error.screen';
import SuccessScreen from '@screens/shared/Success/success.screen';
import customColors from '@styles/tailwind.colors';

const Stack = createNativeStackNavigator<SharedStackParamList>();

const SharedNavigator: React.FC = () => {
   const homeNavigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

   // Enhanced header title styling with responsive design
   const getHeaderTitleStyle = () => ({
      fontFamily: 'Inter-Regular',
      fontWeight: '600' as const,
      fontSize: Platform.select({
         ios: 17,
         android: 20,
      }),
      color: customColors.appText,
      letterSpacing: Platform.select({
         ios: -0.24,
         android: 0,
      }),
   });

   // Enhanced header styling with elevation and shadows
   const getHeaderStyle = () => ({
      backgroundColor: customColors.appBar,
      elevation: 4, // Android shadow
      shadowColor: customColors.appTransparentColor, // iOS shadow
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   });

   // Common screen options for shared screens
   const commonScreenOptions = {
      headerShown: true,
      headerTitle: () => <NavBarTitle />,
      headerTitleAlign: 'center' as const,
      headerStyle: getHeaderStyle(),
      headerTitleStyle: getHeaderTitleStyle(),
      headerTintColor: customColors.appButton,

      // Enhanced back button styling
      headerBackTitleVisible: false,
      headerBackButtonMenuEnabled: true,

      // Animation configuration
      animation: 'slide_from_right' as const,
      animationDuration: 300,

      // Gesture configuration
      gestureEnabled: true,
      gestureDirection: 'horizontal' as const,

      // Status bar configuration
      statusBarStyle: 'dark' as const,
      statusBarBackgroundColor: customColors.appBar,
      statusBarTranslucent: false,
   };

   return (
      <Stack.Navigator
         id={undefined}
         initialRouteName="Success"
         screenOptions={commonScreenOptions}>
         {/* Error Screen */}
         <Stack.Screen
            name="Error"
            component={ErrorScreen}
            options={{
               // Error screen specific styling
               headerTitle: () => <NavBarTitle />,

               // Enhanced error presentation
               presentation: 'modal',

               // Custom styling for error screens
               headerStyle: {
                  ...getHeaderStyle(),
                  backgroundColor: customColors.appError,
               },

               headerTitleStyle: {
                  ...getHeaderTitleStyle(),
                  color: customColors.appButtonText,
               },

               headerTintColor: customColors.appButtonText,

               // Error screen animations
               animation: 'slide_from_bottom',
               animationDuration: 400,

               // Prevent accidental dismissal
               gestureEnabled: false,

               // Status bar for error
               statusBarStyle: 'light' as const,
               statusBarBackgroundColor: customColors.appError,
            }}
         />

         {/* Success Screen */}
         <Stack.Screen
            name="Success"
            component={SuccessScreen}
            options={{
               // Success screen specific styling
               headerTitle: () => <NavBarTitle />,

               // Enhanced success presentation
               presentation: 'card',

               // Custom styling for success screens
               headerStyle: {
                  ...getHeaderStyle(),
                  backgroundColor: customColors.appButton,
               },

               headerTitleStyle: {
                  ...getHeaderTitleStyle(),
                  color: customColors.appButtonText,
               },

               headerTintColor: customColors.appButtonText,

               // Success screen animations
               animation: 'slide_from_right',
               animationDuration: 250,

               // Auto-dismiss gesture
               gestureEnabled: true,

               // Status bar for success
               statusBarStyle: 'light' as const,
               statusBarBackgroundColor: customColors.appButton,

               // Optional: Auto-hide after delay
               headerShadowVisible: true,
            }}
         />
      </Stack.Navigator>
   );
};

export default SharedNavigator;
