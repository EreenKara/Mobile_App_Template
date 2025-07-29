import React from 'react';
import {
   BottomTabBar,
   BottomTabBarProps,
   createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Platform, Text, View } from 'react-native';
import { AppTabParamList } from '@navigation/NavigationTypes';
import HomeNavigator from '@navigation/HomeNavigator';
import ProfileNavigator from '@navigation/ProfileNavigator';
import { Home, User, Share2 } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import IconComponent from '@mycomponents/LucidImage';
import useTailwindColors from '@styles/tailwind.colors';

const Tab = createBottomTabNavigator<AppTabParamList>();

// Tab configuration with icons and labels
const tabConfig = {
   Home: {
      icon: Home,
      label: 'Ana Sayfa',
      component: HomeNavigator,
   },
   Profile: {
      icon: User,
      label: 'Profil',
      component: ProfileNavigator,
   },
} as const;

const AppNavigator: React.FC = () => {
   const tailwindColors = useTailwindColors();
   return (
      <Tab.Navigator
         id={undefined}
         initialRouteName="Home"
         screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
               backgroundColor: tailwindColors.appTransition,
            },

            // ✅ Tab bar icon configuration - cssInterop destekli
            tabBarIcon: ({ color, size, focused }) => {
               const config = tabConfig[route.name as keyof typeof tabConfig];
               const Icon = config.icon;

               return (
                  <IconComponent
                     Icon={Icon}
                     className={`${focused ? 'text-appButton' : 'text-appError'}`}
                  />
               );
            },

            // ✅ Tab bar label configuration - cssInterop destekli
            tabBarLabel: ({ focused }) => {
               const config = tabConfig[route.name as keyof typeof tabConfig];

               return (
                  <Text
                     className={`
                        font-appFont 
                        text-xs 
                        mt-0.5 
                        mb-0.5 
                        font-medium
                        ${focused ? 'text-appButton' : 'text-appIcon'}`}>
                     {config.label}
                  </Text>
               );
            },

            // ✅ Enhanced interaction feedback
            tabBarItemStyle: {
               paddingVertical: 5,
            },

            // ✅ Accessibility enhancements
            tabBarAccessibilityLabel: route.name,

            // ✅ Animation settings
            tabBarHideOnKeyboard: true,
            tabBarVisibilityAnimationConfig: {
               show: {
                  animation: 'timing',
                  config: {
                     duration: 200,
                  },
               },
               hide: {
                  animation: 'timing',
                  config: {
                     duration: 200,
                  },
               },
            },
         })}>
         {/* Home Tab */}
         <Tab.Screen
            name="Home"
            component={tabConfig.Home.component}
            options={{
               tabBarBadge: undefined, // Add badge count if needed
            }}
         />

         {/* Profile Tab */}
         <Tab.Screen
            name="Profile"
            component={tabConfig.Profile.component}
            options={{
               tabBarBadge: undefined, // Add badge count if needed
            }}
         />
      </Tab.Navigator>
   );
};

export default AppNavigator;
