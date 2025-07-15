import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { ProfileStackParamList } from './NavigationTypes';
import customColors from '@styles/tailwind.colors';
import NavBarTitle from '@screens/shared/navbar_title';
import ProfileScreen from '@screens/profile/Profile';
import SettingsScreen from '@screens/profile/Settings';
import PaymentScreen from '@screens/profile/Payment';
import AddCardScreen from '@screens/profile/Payment/add.card';
import PersonalInformationScreen from '@screens/profile/PersonalInformation';
import GroupsScreen from '@screens/profile/Groups';
import AddressInformationScreen from '@screens/profile/AddressInformation';
import CreateGroupScreen from '@screens/profile/CreateGroup';
import GroupScreen from '@screens/profile/Group';
import SharedNavigator from './SharedNavigator';
import AddressChangeScreen from '@screens/profile/AddressChange';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

// Screen configuration for better organization and maintainability
const screenConfig = {
   // Main profile section
   main: {
      ProfileMain: {
         component: ProfileScreen,
         title: 'Profil',
         headerShown: false,
         animation: 'fade' as const,
      },
   },

   // Settings and account management
   account: {
      Settings: {
         component: SettingsScreen,
         title: 'Ayarlar',
         icon: 'settings',
      },
      PersonalInformation: {
         component: PersonalInformationScreen,
         title: 'Kişisel Bilgiler',
         icon: 'user',
      },
      AddressInformation: {
         component: AddressInformationScreen,
         title: 'Adres Bilgileri',
         icon: 'map-pin',
      },
      AddressChange: {
         component: AddressChangeScreen,
         title: 'Adres Değiştir',
         icon: 'edit',
         presentation: 'modal' as const,
      },
   },

   // Payment and financial
   payment: {
      Payment: {
         component: PaymentScreen,
         title: 'Ödeme Yöntemleri',
         icon: 'credit-card',
      },
      AddCard: {
         component: AddCardScreen,
         title: 'Kart Ekle',
         icon: 'plus',
         presentation: 'modal' as const,
      },
   },

   // Groups and social features
   social: {
      Groups: {
         component: GroupsScreen,
         title: 'Gruplarım',
         icon: 'users',
      },
      Group: {
         component: GroupScreen,
         title: 'Grup Detayı',
         icon: 'users',
      },
      CreateGroup: {
         component: CreateGroupScreen,
         title: 'Grup Oluştur',
         icon: 'plus-circle',
         presentation: 'modal' as const,
      },
   },

   // Shared navigation
   shared: {
      Shared: {
         component: SharedNavigator,
         headerShown: false,
      },
   },
} as const;

const ProfileNavigator: React.FC = () => {
   // Enhanced header title styling
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

   // Enhanced header styling with professional appearance
   const getHeaderStyle = () => ({
      backgroundColor: customColors.appTransition,
      elevation: 2, // Subtle Android shadow
      shadowColor: customColors.appTransparentColor, // iOS shadow
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      borderBottomWidth: 0.5,
      borderBottomColor: customColors.appBorderColor,
   });

   // Common screen options for consistent styling
   const getCommonScreenOptions = () => ({
      headerShown: true,
      headerTitleAlign: 'center' as const,
      headerStyle: getHeaderStyle(),
      headerTitleStyle: getHeaderTitleStyle(),
      headerTintColor: customColors.appButton,

      // Enhanced back button styling
      headerBackTitleVisible: false,
      headerBackButtonMenuEnabled: true,

      // Navigation bar title component
      headerRight: () => <NavBarTitle />,

      // Animation configuration
      animation: 'slide_from_right' as const,
      animationDuration: 300,

      // Status bar configuration
      statusBarStyle: 'dark' as const,
      statusBarBackgroundColor: customColors.appTransition,

      // Gesture configuration
      gestureEnabled: true,
      gestureDirection: 'horizontal' as const,
   });

   // Get screen options based on type and configuration
   const getScreenOptions = (screenName: string, config: any) => {
      const baseOptions = getCommonScreenOptions();

      return {
         ...baseOptions,
         title: config.title,
         headerShown: config.headerShown ?? true,
         presentation: config.presentation ?? 'card',
         animation: config.animation ?? baseOptions.animation,

         // Modal-specific styling
         ...(config.presentation === 'modal' && {
            headerStyle: {
               ...getHeaderStyle(),
               backgroundColor: customColors.appBackground,
            },
            animationDuration: 400,
            gestureEnabled: false, // Disable swipe for modals
         }),

         // Main screen specific styling
         ...(screenName === 'ProfileMain' && {
            gestureEnabled: false, // Disable back gesture on main profile
         }),
      };
   };

   return (
      <Stack.Navigator
         id={undefined}
         initialRouteName="ProfileMain"
         screenOptions={getCommonScreenOptions()}>
         {/* Main Profile Screen */}
         <Stack.Screen
            name="ProfileMain"
            component={screenConfig.main.ProfileMain.component}
            options={getScreenOptions('ProfileMain', screenConfig.main.ProfileMain)}
         />

         {/* Account Management Screens */}
         <Stack.Screen
            name="Settings"
            component={screenConfig.account.Settings.component}
            options={getScreenOptions('Settings', screenConfig.account.Settings)}
         />
         <Stack.Screen
            name="PersonalInformation"
            component={screenConfig.account.PersonalInformation.component}
            options={getScreenOptions(
               'PersonalInformation',
               screenConfig.account.PersonalInformation,
            )}
         />
         <Stack.Screen
            name="AddressInformation"
            component={screenConfig.account.AddressInformation.component}
            options={getScreenOptions(
               'AddressInformation',
               screenConfig.account.AddressInformation,
            )}
         />
         <Stack.Screen
            name="AddressChange"
            component={screenConfig.account.AddressChange.component}
            options={getScreenOptions('AddressChange', screenConfig.account.AddressChange)}
         />

         {/* Payment Screens */}
         <Stack.Screen
            name="Payment"
            component={screenConfig.payment.Payment.component}
            options={getScreenOptions('Payment', screenConfig.payment.Payment)}
         />

         <Stack.Screen
            name="AddCard"
            component={screenConfig.payment.AddCard.component}
            options={getScreenOptions('AddCard', screenConfig.payment.AddCard)}
         />

         {/* Social Features Screens */}
         <Stack.Screen
            name="Groups"
            component={screenConfig.social.Groups.component}
            options={getScreenOptions('Groups', screenConfig.social.Groups)}
         />
         <Stack.Screen
            name="CreateGroup"
            component={screenConfig.social.Group.component}
            options={getScreenOptions('Group', screenConfig.social.Group)}
         />
         <Stack.Screen
            name="Group"
            component={screenConfig.social.CreateGroup.component}
            options={getScreenOptions('CreateGroup', screenConfig.social.CreateGroup)}
         />
         <Stack.Screen
            name="Shared"
            component={screenConfig.shared.Shared.component}
            options={getScreenOptions('Shared', screenConfig.shared.Shared)}
         />
      </Stack.Navigator>
   );
};
export default ProfileNavigator;
