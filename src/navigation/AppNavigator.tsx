import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { AppTabParamList } from '@navigation/NavigationTypes';
import HomeNavigator from '@navigation/HomeNavigator';
import ProfileNavigator from '@navigation/ProfileNavigator';
import customColors from '@styles/tailwind.colors';
import { Home, User, Share2 } from 'lucide-react-native';

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
   // Enhanced tab bar styling with responsive design
   const getTabBarStyle = () => ({
      backgroundColor: customColors.appBar,
      borderTopWidth: 1,
      borderTopColor: customColors.appBorderColor,
      height: Platform.select({
         ios: 85,
         android: 70,
      }),
      paddingBottom: Platform.select({
         ios: 25,
         android: 10,
      }),
      paddingTop: 10,
      elevation: 8, // Android shadow
      shadowColor: customColors.appShadow, // iOS shadow
      shadowOffset: {
         width: 0,
         height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   });

   // Enhanced tab bar label styling
   const getTabBarLabelStyle = () => ({
      fontFamily: 'Inter-Regular',
      fontSize: Platform.select({
         ios: 12,
         android: 11,
      }),
      marginTop: 2,
      fontWeight: '500' as const,
   });

   return (
      <Tab.Navigator
         id={undefined}
         initialRouteName="Home"
         screenOptions={({ route }) => ({
            headerShown: false,
            // Enhanced tab bar styling
            tabBarStyle: getTabBarStyle(),

            // Enhanced label styling
            tabBarLabelStyle: getTabBarLabelStyle(),

            // Active/Inactive colors
            tabBarActiveTintColor: customColors.appButton,
            tabBarInactiveTintColor: customColors.appIcon,

            // Tab bar icon configuration
            tabBarIcon: ({ color, size, focused }) => {
               const config = tabConfig[route.name as keyof typeof tabConfig];
               const IconComponent = config.icon;

               // Enhanced icon sizing with focus state
               const iconSize = focused ? size + 2 : size;

               return (
                  <IconComponent size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
               );
            },

            // Enhanced label configuration
            tabBarLabel: ({ focused }) => {
               const config = tabConfig[route.name as keyof typeof tabConfig];
               return config.label;
            },

            // Enhanced interaction feedback
            tabBarItemStyle: {
               paddingVertical: 5,
            },

            // Accessibility enhancements
            tabBarAccessibilityLabel: route.name,

            // Animation settings
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
         {/*(<Tab.Screen
            name="Profile"
            component={tabConfig.Profile.component}
            options={{
               tabBarBadge: undefined, // Add badge count if needed
            }}
         />)*/}
      </Tab.Navigator>
   );
};

export default AppNavigator;
