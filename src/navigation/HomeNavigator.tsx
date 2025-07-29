import React from 'react';
import {
   createNativeStackNavigator,
   NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { HomeStackParamList } from './NavigationTypes';
import { HomeScreen } from '@screens/home/index';
import NavBarTitle from '@screens/shared/navbarTitle';
import SharedNavigator from './SharedNavigator';
import useTailwindColors from '@styles/tailwind.colors';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
   const tailwindColors = useTailwindColors();
   // Enhanced header title styling with responsive design
   const getHeaderTitleStyle = () => ({
      fontFamily: 'Inter-Regular',
      fontWeight: '600' as const,
      fontSize: Platform.select({
         ios: 17,
         android: 20,
      }),
      color: tailwindColors.appIcon,
      letterSpacing: Platform.select({
         ios: -0.24,
         android: 0,
      }),
   });

   // Enhanced header styling with elevation and shadows
   const getHeaderStyle = () => ({
      backgroundColor: tailwindColors.appTransition,
      elevation: 4, // Android shadow
      shadowColor: tailwindColors.appTransition, // iOS shadow
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   });

   // Common screen options for consistent styling
   const commonScreenOptions = {
      headerShown: true,
      headerTitleAlign: 'center' as const,
      headerStyle: getHeaderStyle(),
      headerTitleStyle: getHeaderTitleStyle(),
      headerTintColor: tailwindColors.appIcon,

      // Enhanced back button styling
      headerBackTitleVisible: false,
      headerBackButtonMenuEnabled: true,

      // Responsive header configuration
      headerLargeTitle: false,
      headerTransparent: false,
      headerBlurEffect: Platform.select({
         ios: 'regular' as const,
         android: undefined,
      }),

      // Animation configuration
      animation: 'slide_from_right' as const,
      animationDuration: 300,

      // Status bar configuration
      statusBarStyle: 'dark' as const,
      statusBarBackgroundColor: tailwindColors.appBar,
   };

   return (
      <Stack.Navigator
         id={undefined}
         initialRouteName="HomeMain"
         screenOptions={commonScreenOptions}>
         {/* Home Screen */}
         <Stack.Screen
            name="HomeMain"
            component={HomeScreen}
            options={{
               // Custom header with NavBarTitle component
               headerTitle: () => <NavBarTitle />,

               // Home screen specific styling
               headerStyle: {
                  ...getHeaderStyle(),
               },

               // Enhanced for main screen
               gestureEnabled: false, // Disable swipe back on main screen

               // Custom header height for home
               headerShadowVisible: true,

               // Animation for home screen
               animation: 'fade',
               animationDuration: 200,
            }}
         />

         {/* Shared Navigator for common screens */}
         <Stack.Screen
            name="Shared"
            component={SharedNavigator}
            options={({ route }) => ({
               // Dynamic header title based on nested route
               headerTitle: () => <NavBarTitle />,

               // Enhanced modal-like presentation for shared screens
               presentation: 'card',

               // Custom styling for shared screens
               headerStyle: {
                  ...getHeaderStyle(),
                  backgroundColor: tailwindColors.appBackground,
               },

               // Enhanced back button for shared screens
               headerBackVisible: true,
               headerBackTitleVisible: false,

               // Animation for shared screens
               animation: 'slide_from_right',
               animationDuration: 250,

               // Gesture configuration
               gestureEnabled: true,
               gestureDirection: 'horizontal',
            })}
         />
      </Stack.Navigator>
   );
};

export default HomeNavigator;
