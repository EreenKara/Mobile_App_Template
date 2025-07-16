import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, Animated, StatusBar, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { XCircle, AlertTriangle, Info, AlertOctagon, Home, RotateCcw } from 'lucide-react-native';
import ButtonComponent from '@mycomponents/Button/Button';
import { SharedStackParamList } from '@navigation/NavigationTypes';

// ==================== TYPES & INTERFACES ====================

/**
 * Error Screen Configuration Interface
 * Ekranın görünümünü ve davranışını kontrol eder
 */
export interface ErrorConfig {
   title?: string;
   description?: string;
   icon?: 'error' | 'warning' | 'info' | 'critical' | 'custom';
   customIcon?: React.ReactNode;
   variant?: 'default' | 'card' | 'minimal';
   animation?: 'bounce' | 'scale' | 'fade' | 'shake';
   buttonText?: string;
   secondaryButtonText?: string;
   showRetryButton?: boolean;
   autoRetry?: boolean;
   retryDelay?: number; // seconds
}

/**
 * Route Parameters Interface
 * Navigation'dan gelen parametreleri tanımlar
 */
interface ErrorParams {
   error?: string | ErrorConfig;
   toScreen: string;
   fromScreen?: string;
   config?: ErrorConfig;

   // Navigation parameters
   navigationParams?: any;
   resetNavigation?: boolean;

   // Action configurations
   secondaryAction?: {
      text: string;
      screen: string;
      params?: any;
   };

   retryAction?: {
      text: string;
      action: () => void;
   };
}

type Props = NativeStackScreenProps<SharedStackParamList, 'Error'>;

// ==================== CONSTANTS ====================

const DEFAULT_CONFIG: ErrorConfig = {
   title: 'Hata Oluştu',
   description: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
   icon: 'error',
   variant: 'default',
   animation: 'bounce',
   buttonText: 'Geri Dön',
   showRetryButton: false,
   autoRetry: false,
   retryDelay: 3,
};

const ICON_COMPONENTS = {
   error: XCircle,
   warning: AlertTriangle,
   info: Info,
   critical: AlertOctagon,
} as const;

// ==================== MAIN COMPONENT ====================

const ErrorScreen: React.FC<Props> = ({ navigation, route }) => {
   // ==================== HOOKS & STATE ====================

   const params = route.params as ErrorParams;

   // Animation refs
   const iconScale = useRef(new Animated.Value(0)).current;
   const iconShake = useRef(new Animated.Value(0)).current;
   const contentOpacity = useRef(new Animated.Value(0)).current;
   const contentTranslateY = useRef(new Animated.Value(30)).current;

   // ==================== COMPUTED VALUES ====================

   // Navigation target'ı auth durumuna göre ayarla

   // Error konfigürasyonunu birleştir
   const errorConfig: ErrorConfig = useMemo(() => {
      const { error, config } = params;

      if (typeof error === 'object' && error !== null) {
         return { ...DEFAULT_CONFIG, ...error, ...config };
      }

      return {
         ...DEFAULT_CONFIG,
         description: typeof error === 'string' ? error : DEFAULT_CONFIG.description,
         ...config,
      };
   }, [params]);

   // ==================== ANIMATION FUNCTIONS ====================

   const startAnimations = useCallback(() => {
      const animations: Animated.CompositeAnimation[] = [];

      // Icon animation based on type
      switch (errorConfig.animation) {
         case 'bounce':
            animations.push(
               Animated.sequence([
                  Animated.spring(iconScale, {
                     toValue: 1.1,
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

         case 'shake':
            animations.push(
               Animated.sequence([
                  Animated.timing(iconScale, {
                     toValue: 1,
                     duration: 300,
                     useNativeDriver: true,
                  }),
                  Animated.sequence([
                     Animated.timing(iconShake, {
                        toValue: 10,
                        duration: 100,
                        useNativeDriver: true,
                     }),
                     Animated.timing(iconShake, {
                        toValue: -10,
                        duration: 100,
                        useNativeDriver: true,
                     }),
                     Animated.timing(iconShake, {
                        toValue: 10,
                        duration: 100,
                        useNativeDriver: true,
                     }),
                     Animated.timing(iconShake, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                     }),
                  ]),
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

         case 'fade':
         default:
            animations.push(
               Animated.timing(iconScale, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
               }),
            );
            break;
      }

      // Content animation
      animations.push(
         Animated.parallel([
            Animated.timing(contentOpacity, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true,
               delay: 200,
            }),
            Animated.timing(contentTranslateY, {
               toValue: 0,
               duration: 500,
               useNativeDriver: true,
               delay: 200,
            }),
         ]),
      );

      Animated.parallel(animations).start();
   }, [errorConfig.animation, iconScale, iconShake, contentOpacity, contentTranslateY]);

   // ==================== LIFECYCLE ====================

   useEffect(() => {
      startAnimations();
   }, [startAnimations]);

   // ==================== EVENT HANDLERS ====================

   const handleRedirect = useCallback(() => {
      if (params.resetNavigation) {
         navigation.reset({
            index: 0,
            routes: [{ name: params.navigationParams.toScreen as any }],
         });
      } else {
         navigation.navigate(params.navigationParams.toScreen as any, params.navigationParams);
      }
   }, [navigation, params.navigationParams.toScreen, params]);

   const handleSecondaryAction = useCallback(() => {
      if (params.secondaryAction) {
         navigation.navigate(params.secondaryAction.screen as any, params.secondaryAction.params);
      }
   }, [navigation, params.secondaryAction]);

   const handleRetry = useCallback(() => {
      if (params.retryAction) {
         params.retryAction.action();
      }
   }, [params.retryAction]);

   // ==================== RENDER FUNCTIONS ====================

   const renderIcon = () => {
      const iconSize = errorConfig.variant === 'minimal' ? 48 : 72;
      const iconColor = getIconColor();

      const animatedStyle: any = {
         transform: [{ scale: iconScale }, { translateX: iconShake }],
      };

      if (errorConfig.customIcon) {
         return <Animated.View style={animatedStyle}>{errorConfig.customIcon}</Animated.View>;
      }

      const IconComponent = ICON_COMPONENTS[errorConfig.icon || 'error'];

      return (
         <Animated.View style={animatedStyle}>
            <IconComponent size={iconSize} color={iconColor} strokeWidth={2.5} />
         </Animated.View>
      );
   };

   const renderContent = () => (
      <Animated.View
         className="items-center px-4 w-full"
         style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
         }}>
         {/* Title */}
         <Text className={`font-bold text-2xl sm:text-3xl text-center mb-4 ${getTextColor()}`}>
            {errorConfig.title}
         </Text>

         {/* Description */}
         <Text
            className={`text-base sm:text-lg text-center mb-8 ${getTextColor()} opacity-90 leading-6`}>
            {errorConfig.description}
         </Text>

         {/* Action Buttons */}
         <View className="w-full max-w-sm gap-4">
            {/* Primary Button */}
            <ButtonComponent
               className={`w-full py-4 px-8 rounded-2xl ${getPrimaryButtonStyle()}`}
               title={errorConfig.buttonText || 'Geri Dön'}
               onPress={handleRedirect}
            />

            {/* Retry Button */}
            {errorConfig.showRetryButton && params.retryAction && (
               <TouchableOpacity
                  onPress={handleRetry}
                  className={`w-full py-3 px-8 rounded-2xl flex-row items-center justify-center ${getSecondaryButtonStyle()}`}
                  activeOpacity={0.7}>
                  <RotateCcw size={18} color={getSecondaryButtonTextColor()} className="mr-2" />
                  <Text className={`font-medium text-base ${getSecondaryButtonTextColor()}`}>
                     {params.retryAction.text}
                  </Text>
               </TouchableOpacity>
            )}

            {/* Secondary Action Button */}
            {params.secondaryAction && (
               <TouchableOpacity
                  onPress={handleSecondaryAction}
                  className={`w-full py-3 px-8 rounded-2xl ${getSecondaryButtonStyle()}`}
                  activeOpacity={0.7}>
                  <Text
                     className={`font-medium text-base text-center ${getSecondaryButtonTextColor()}`}>
                     {params.secondaryAction.text}
                  </Text>
               </TouchableOpacity>
            )}
         </View>
      </Animated.View>
   );

   // ==================== STYLE HELPERS ====================

   const getContainerClasses = () => {
      const base = 'flex-1 items-center justify-center px-6';

      switch (errorConfig.variant) {
         case 'minimal':
            return `${base} bg-appBackground`;
         case 'card':
            return `${base} bg-appBackground`;
         default:
            return `${base} bg-appError/5`;
      }
   };

   const getIconContainerClasses = () => {
      const base = 'items-center justify-center mb-8';

      switch (errorConfig.variant) {
         case 'minimal':
            return `${base} w-24 h-24 bg-appError/10 rounded-full`;
         case 'card':
            return `${base} w-32 h-32 bg-appError/5 rounded-full border-2 border-appError/20`;
         default:
            return `${base} w-40 h-40 bg-appError/10 rounded-full`;
      }
   };

   const getTextColor = () => {
      switch (errorConfig.variant) {
         case 'minimal':
         case 'card':
            return 'text-appText';
         default:
            return 'text-appError';
      }
   };

   const getIconColor = () => {
      switch (errorConfig.variant) {
         case 'minimal':
         case 'card':
            return 'rgb(var(--color-app-error))';
         default:
            return 'rgb(var(--color-app-error))';
      }
   };

   const getPrimaryButtonStyle = () => {
      switch (errorConfig.variant) {
         case 'minimal':
         case 'card':
            return 'bg-appError';
         default:
            return 'bg-appError';
      }
   };

   const getSecondaryButtonStyle = () => {
      switch (errorConfig.variant) {
         case 'minimal':
         case 'card':
            return 'border border-appError/30 bg-appError/10';
         default:
            return 'border border-appError/30 bg-appError/10';
      }
   };

   const getSecondaryButtonTextColor = () => {
      return 'text-appError';
   };

   // ==================== RENDER ====================

   return (
      <View className={getContainerClasses()}>
         {/* Card Variant */}
         {errorConfig.variant === 'card' ? (
            <View className="bg-appCardBackground border border-appBorderColor rounded-3xl p-8 w-full max-w-sm shadow-lg">
               <View className={getIconContainerClasses()}>{renderIcon()}</View>
               {renderContent()}
            </View>
         ) : (
            /* Default & Minimal Variants */
            <>
               <View className={getIconContainerClasses()}>{renderIcon()}</View>
               {renderContent()}
            </>
         )}
      </View>
   );
};

export default ErrorScreen;
