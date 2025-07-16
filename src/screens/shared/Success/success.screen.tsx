// screens/SuccessScreen/SuccessScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import {
   CheckCircle,
   CheckCircle2,
   Award,
   Star,
   Heart,
   Zap,
   Home,
   ArrowRight,
   RotateCcw,
} from 'lucide-react-native';
import { SharedStackParamList } from '@navigation/NavigationTypes';
import { RootState } from '@contexts/store';

type Props = NativeStackScreenProps<SharedStackParamList, 'Success'>;

// Success Screen Configuration
export interface SuccessConfig {
   title?: string;
   description?: string;
   icon?: 'check' | 'award' | 'star' | 'heart' | 'zap' | 'custom';
   customIcon?: React.ReactNode;
   variant?: 'default' | 'card' | 'celebration' | 'minimal';
   animation?: 'bounce' | 'scale' | 'slide' | 'fade' | 'confetti';
   buttonText?: string;
   secondaryButtonText?: string;
   autoRedirect?: boolean;
   redirectDelay?: number; // seconds
   showProgressBar?: boolean;
   celebrationDuration?: number; // milliseconds
}

// Extended route params with navigation structure
interface SuccessParams {
   success?: string | SuccessConfig;
   fromScreen: string;
   toScreen: string;

   // Optional navigation parameters
   navigationParams?: any;
   resetNavigation?: boolean; // Whether to reset navigation stack

   // Secondary action (optional)
   secondaryAction?: {
      text: string;
      screen: string;
      params?: any;
   };

   config?: SuccessConfig;
}

const SuccessScreen: React.FC<Props> = ({ navigation, route }) => {
   const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

   // Parse route params
   const params = route.params as SuccessParams;
   const {
      success,
      fromScreen,
      toScreen,
      navigationParams,
      resetNavigation = false,
      secondaryAction,
      config,
   } = params;

   // Determine success configuration
   const successConfig: SuccessConfig = React.useMemo(() => {
      if (typeof success === 'object' && success !== null) {
         return { ...success, ...config };
      }

      return {
         title: 'Başarılı!',
         description: typeof success === 'string' ? success : 'İşlem başarıyla tamamlandı.',
         icon: 'check',
         variant: 'default',
         animation: 'bounce',
         buttonText: 'Devam Et',
         autoRedirect: false,
         redirectDelay: 3,
         showProgressBar: false,
         celebrationDuration: 2000,
         ...config,
      };
   }, [success, config]);

   // Navigation helper function
   const determineNavigationAction = (targetScreen: string, params?: any) => {
      // Root level screens
      if (targetScreen === 'Auth' || targetScreen === 'App') {
         return () =>
            navigation.reset({
               index: 0,
               routes: [{ name: targetScreen as any }],
            });
      }

      // Auth Stack screens
      const authScreens = [
         'Login',
         'Register',
         'ForgotPassword',
         'ResetPassword',
         'EmailConfirm',
         'Deneme',
      ];
      if (authScreens.includes(targetScreen)) {
         return () =>
            navigation.reset({
               index: 0,
               routes: [
                  {
                     name: 'Auth' as keyof SharedStackParamList,
                     state: {
                        routes: [{ name: targetScreen as any, params }],
                     },
                  },
               ],
            });
      }

      // App Tab screens
      if (targetScreen === 'Home') {
         return () =>
            navigation.reset({
               index: 0,
               routes: [
                  {
                     name: 'App' as keyof SharedStackParamList,
                     state: {
                        routes: [{ name: 'Home', params }],
                     },
                  },
               ],
            });
      }

      // Home Stack screens
      const homeScreens = ['HomeMain'];
      if (homeScreens.includes(targetScreen)) {
         return () =>
            navigation.reset({
               index: 0,
               routes: [
                  {
                     name: 'App' as keyof SharedStackParamList,
                     state: {
                        routes: [
                           {
                              name: 'Home',
                              state: {
                                 routes: [{ name: targetScreen as any, params }],
                              },
                           },
                        ],
                     },
                  },
               ],
            });
      }

      // Profile Stack screens
      const profileScreens = [
         'ProfileMain',
         'PersonalInformation',
         'AddressInformation',
         'AddressChange',
         'Payment',
         'AddCard',
         'Groups',
         'CreateGroup',
         'Group',
         'Settings',
         'Help',
         'About',
         'Security',
      ];
      if (profileScreens.includes(targetScreen)) {
         return () =>
            navigation.reset({
               index: 0,
               routes: [
                  {
                     name: 'App' as keyof SharedStackParamList,
                     state: {
                        routes: [
                           {
                              name: 'Profile',
                              state: {
                                 routes: [{ name: targetScreen as any, params }],
                              },
                           },
                        ],
                     },
                  },
               ],
            });
      }

      // Shared Stack screens (Error, Success)
      const sharedScreens = ['Error', 'Success'];
      if (sharedScreens.includes(targetScreen)) {
         return () => navigation.navigate(targetScreen as any, params);
      }

      // Default: try to navigate directly
      return () => navigation.navigate(targetScreen as any, params);
   };

   // Determine navigation target based on auth state
   const navigationAction = React.useMemo(() => {
      // If user is not authenticated and trying to access protected screens
      if (!isAuthenticated && !['Auth', 'Login', 'Register', 'ForgotPassword'].includes(toScreen)) {
         return determineNavigationAction('Login');
      }

      return determineNavigationAction(toScreen, navigationParams);
   }, [isAuthenticated, toScreen, navigationParams]);

   // Animation values
   const iconScale = useRef(new Animated.Value(0)).current;
   const iconRotation = useRef(new Animated.Value(0)).current;
   const contentOpacity = useRef(new Animated.Value(0)).current;
   const contentTranslateY = useRef(new Animated.Value(50)).current;
   const progressValue = useRef(new Animated.Value(0)).current;
   const celebrationOpacity = useRef(new Animated.Value(0)).current;

   // State
   const [showContent, setShowContent] = useState(false);
   const [countdown, setCountdown] = useState(successConfig.redirectDelay || 3);
   const [isRedirecting, setIsRedirecting] = useState(false);

   // Auto redirect countdown
   useEffect(() => {
      if (successConfig.autoRedirect && countdown > 0) {
         const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
         }, 1000);
         return () => clearTimeout(timer);
      } else if (successConfig.autoRedirect && countdown === 0) {
         handleRedirect();
      }
   }, [countdown, successConfig.autoRedirect]);

   // Progress bar animation
   useEffect(() => {
      if (successConfig.showProgressBar && successConfig.autoRedirect) {
         Animated.timing(progressValue, {
            toValue: 1,
            duration: (successConfig.redirectDelay || 3) * 1000,
            useNativeDriver: false,
         }).start();
      }
   }, [successConfig.showProgressBar, successConfig.autoRedirect, successConfig.redirectDelay]);

   // Main animations
   useEffect(() => {
      const animations = [];

      // Icon animation based on type
      switch (successConfig.animation) {
         case 'bounce':
            animations.push(
               Animated.sequence([
                  Animated.spring(iconScale, {
                     toValue: 1.2,
                     useNativeDriver: true,
                     tension: 100,
                     friction: 3,
                  }),
                  Animated.spring(iconScale, {
                     toValue: 1,
                     useNativeDriver: true,
                     tension: 100,
                     friction: 8,
                  }),
               ]),
            );
            break;

         case 'scale':
            animations.push(
               Animated.spring(iconScale, {
                  toValue: 1,
                  useNativeDriver: true,
                  tension: 80,
                  friction: 4,
               }),
            );
            break;

         case 'slide':
            animations.push(
               Animated.timing(iconScale, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
               }),
            );
            break;

         case 'fade':
            animations.push(
               Animated.timing(iconScale, {
                  toValue: 1,
                  duration: 800,
                  useNativeDriver: true,
               }),
            );
            break;

         case 'confetti':
            animations.push(
               Animated.sequence([
                  Animated.timing(iconScale, {
                     toValue: 1,
                     duration: 400,
                     useNativeDriver: true,
                  }),
                  Animated.timing(iconRotation, {
                     toValue: 1,
                     duration: 600,
                     useNativeDriver: true,
                  }),
               ]),
            );
            break;
      }

      // Content animation
      animations.push(
         Animated.parallel([
            Animated.timing(contentOpacity, {
               toValue: 1,
               duration: 600,
               useNativeDriver: true,
               delay: 400,
            }),
            Animated.timing(contentTranslateY, {
               toValue: 0,
               duration: 600,
               useNativeDriver: true,
               delay: 400,
            }),
         ]),
      );

      // Celebration animation
      if (successConfig.variant === 'celebration') {
         animations.push(
            Animated.sequence([
               Animated.timing(celebrationOpacity, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                  delay: 800,
               }),
               Animated.timing(celebrationOpacity, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                  delay: successConfig.celebrationDuration || 2000,
               }),
            ]),
         );
      }

      Animated.parallel(animations).start(() => {
         setShowContent(true);
      });

      // Status bar
      StatusBar.setBarStyle('light-content');

      return () => {
         StatusBar.setBarStyle('default');
      };
   }, []);

   // Handle redirect with navigation structure
   const handleRedirect = () => {
      setIsRedirecting(true);
      navigationAction();
   };

   // Handle secondary action
   const handleSecondaryAction = () => {
      if (secondaryAction) {
         const secondaryNavigationAction = determineNavigationAction(
            secondaryAction.screen,
            secondaryAction.params,
         );
         secondaryNavigationAction();
      }
   };

   // Render icon based on type
   const renderIcon = () => {
      const iconSize = successConfig.variant === 'minimal' ? 48 : 80;
      const iconColor =
         successConfig.variant === 'card'
            ? 'rgb(var(--color-app-button))'
            : 'rgb(var(--color-app-button-text))';

      const rotateZ = iconRotation.interpolate({
         inputRange: [0, 1],
         outputRange: ['0deg', '360deg'],
      });

      const iconStyle: any = {
         transform: [
            { scale: iconScale },
            ...(successConfig.animation === 'confetti' ? [{ rotateZ }] : []),
         ],
      };

      if (successConfig.customIcon) {
         return <Animated.View style={iconStyle}>{successConfig.customIcon}</Animated.View>;
      }

      const IconComponent =
         {
            check: CheckCircle,
            award: Award,
            star: Star,
            heart: Heart,
            zap: Zap,
         }[successConfig.icon || 'check'] || CheckCircle;

      return (
         <Animated.View style={iconStyle}>
            <IconComponent size={iconSize} color={iconColor} strokeWidth={2} />
         </Animated.View>
      );
   };

   // Render celebration particles
   const renderCelebration = () => {
      if (successConfig.variant !== 'celebration') return null;

      return (
         <Animated.View
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: celebrationOpacity }}>
            {/* Celebration particles/confetti could be added here */}
            <View className="flex-1 items-center justify-center">
               {[...Array(20)].map((_, index) => (
                  <Animated.View
                     key={index}
                     className="absolute w-2 h-2 bg-appButton rounded-full"
                     style={{
                        left: Math.random() * screenWidth,
                        top: Math.random() * screenHeight,
                        opacity: Math.random(),
                     }}
                  />
               ))}
            </View>
         </Animated.View>
      );
   };

   // Render progress bar
   const renderProgressBar = () => {
      if (!successConfig.showProgressBar || !successConfig.autoRedirect) return null;

      const progressWidth = progressValue.interpolate({
         inputRange: [0, 1],
         outputRange: ['0%', '100%'],
      });

      return (
         <View className="w-full mt-6">
            <Text className="text-appButtonText font-appFont text-sm text-center mb-2">
               {countdown} saniye sonra yönlendirileceksiniz...
            </Text>
            <View className="w-full h-1 bg-appButtonText/20 rounded-full overflow-hidden">
               <Animated.View
                  className="h-full bg-appButtonText rounded-full"
                  style={{ width: progressWidth }}
               />
            </View>
         </View>
      );
   };

   // Variant-specific container styles
   const getContainerClasses = () => {
      const baseClasses = 'flex-1 items-center justify-center px-6';

      switch (successConfig.variant) {
         case 'celebration':
            return `${baseClasses} bg-gradient-to-br from-appButton to-appButton/80`;
         case 'minimal':
            return `${baseClasses} bg-appBackground`;
         case 'card':
            return `${baseClasses} bg-appBackground`;
         default:
            return `${baseClasses} bg-appButton`;
      }
   };

   const getIconContainerClasses = () => {
      const baseClasses = 'items-center justify-center mb-8';

      switch (successConfig.variant) {
         case 'minimal':
            return `${baseClasses} w-24 h-24 bg-appButton/10 rounded-full`;
         case 'card':
            return `${baseClasses} w-32 h-32 bg-appButton/5 rounded-full border-2 border-appButton/20`;
         default:
            return `${baseClasses} w-40 h-40 bg-appButtonText/10 rounded-full`;
      }
   };

   const getTextColor = () => {
      switch (successConfig.variant) {
         case 'minimal':
         case 'card':
            return 'text-appText';
         default:
            return 'text-appButtonText';
      }
   };

   return (
      <View className={getContainerClasses()}>
         {/* Celebration Effects */}
         {renderCelebration()}

         {/* Main Content Container */}
         {successConfig.variant === 'card' ? (
            <View
               className="bg-appCardBackground border border-appBorderColor rounded-3xl p-8 w-full max-w-sm"
               style={{
                  shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                  elevation: 8,
               }}>
               {/* Icon */}
               <View className={getIconContainerClasses()}>{renderIcon()}</View>

               {/* Content */}
               <Animated.View
                  className="items-center"
                  style={{
                     opacity: contentOpacity,
                     transform: [{ translateY: contentTranslateY }],
                  }}>
                  <Text
                     className={`font-appFont font-bold text-2xl text-center mb-4 ${getTextColor()}`}>
                     {successConfig.title}
                  </Text>

                  <Text
                     className={`font-appFont text-base text-center mb-6 ${getTextColor()} opacity-80`}>
                     {successConfig.description}
                  </Text>

                  {/* Progress Bar */}
                  {renderProgressBar()}

                  {/* Buttons */}
                  <View className="w-full gap-3 mt-6">
                     <TouchableOpacity
                        onPress={handleRedirect}
                        disabled={isRedirecting}
                        className={`
                  w-full py-4 px-6 rounded-xl
                  bg-appButton
                  ${isRedirecting ? 'opacity-50' : 'active:opacity-70'}
                `}
                        activeOpacity={0.7}>
                        <Text className="text-appButtonText font-appFont font-medium text-base text-center">
                           {isRedirecting ? 'Yönlendiriliyor...' : successConfig.buttonText}
                        </Text>
                     </TouchableOpacity>

                     {secondaryAction && (
                        <TouchableOpacity
                           onPress={handleSecondaryAction}
                           disabled={isRedirecting}
                           className={`
                    w-full py-3 px-6 rounded-xl border border-appBorderColor
                    bg-appTransition
                    ${isRedirecting ? 'opacity-50' : 'active:opacity-70'}
                  `}
                           activeOpacity={0.7}>
                           <Text className="text-appText font-appFont font-medium text-base text-center">
                              {secondaryAction.text}
                           </Text>
                        </TouchableOpacity>
                     )}
                  </View>
               </Animated.View>
            </View>
         ) : (
            <>
               {/* Icon */}
               <View className={getIconContainerClasses()}>{renderIcon()}</View>

               {/* Content */}
               <Animated.View
                  className="items-center px-4"
                  style={{
                     opacity: contentOpacity,
                     transform: [{ translateY: contentTranslateY }],
                  }}>
                  <Text
                     className={`font-appFont font-bold text-3xl text-center mb-4 ${getTextColor()}`}>
                     {successConfig.title}
                  </Text>

                  <Text
                     className={`font-appFont text-lg text-center mb-8 ${getTextColor()} opacity-90`}>
                     {successConfig.description}
                  </Text>

                  {/* Progress Bar */}
                  {renderProgressBar()}

                  {/* Buttons */}
                  <View className="w-full max-w-sm gap-4 mt-8">
                     <TouchableOpacity
                        onPress={handleRedirect}
                        disabled={isRedirecting}
                        className={`
                  w-full py-4 px-8 rounded-2xl flex-row items-center justify-center
                  ${
                     (successConfig.variant as string) === 'card' ||
                     successConfig.variant === 'minimal'
                        ? 'bg-appButton'
                        : 'bg-appButtonText'
                  }
                  ${isRedirecting ? 'opacity-50' : 'active:opacity-70'}
                `}
                        activeOpacity={0.7}>
                        <Text
                           className={`
                    font-appFont font-medium text-lg mr-2
                    ${
                       successConfig.variant === 'minimal' ||
                       (successConfig.variant as string) === 'card'
                          ? 'text-appButtonText'
                          : 'text-appButton'
                    }
                  `}>
                           {isRedirecting ? 'Yönlendiriliyor...' : successConfig.buttonText}
                        </Text>
                        {!isRedirecting && (
                           <ArrowRight
                              size={20}
                              color={
                                 successConfig.variant === 'minimal' ||
                                 (successConfig.variant as string) === 'card'
                                    ? 'rgb(var(--color-app-button-text))'
                                    : 'rgb(var(--color-app-button))'
                              }
                           />
                        )}
                     </TouchableOpacity>

                     {secondaryAction && (
                        <TouchableOpacity
                           onPress={handleSecondaryAction}
                           disabled={isRedirecting}
                           className={`
                    w-full py-3 px-8 rounded-2xl
                    ${
                       successConfig.variant === 'minimal' ||
                       (successConfig.variant as string) === 'card'
                          ? 'bg-appTransition border border-appBorderColor'
                          : 'bg-appButtonText/20'
                    }
                    ${isRedirecting ? 'opacity-50' : 'active:opacity-70'}
                  `}
                           activeOpacity={0.7}>
                           <Text
                              className={`
                      font-appFont font-medium text-base text-center
                      ${
                         successConfig.variant === 'minimal' ||
                         (successConfig.variant as string) === 'card'
                            ? 'text-appText'
                            : 'text-appButtonText'
                      }
                    `}>
                              {secondaryAction.text}
                           </Text>
                        </TouchableOpacity>
                     )}
                  </View>
               </Animated.View>
            </>
         )}
      </View>
   );
};

export default SuccessScreen;
