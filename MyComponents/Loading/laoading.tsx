import React, { useEffect, useRef } from 'react';
import {
   View,
   ActivityIndicator as RNActivityIndicator,
   Animated,
   Text,
   Dimensions,
} from 'react-native';
import { Loader2, RotateCw } from 'lucide-react-native';
import IconComponent from '@mycomponents/LucidImage';
// ==================== TYPES & INTERFACES ====================

export interface LoadingComponentProps {
   /** Loading component boyutu */
   size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

   /** Loading component varyantı */
   variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'icon';

   /** Ana renk */
   color?: string;

   /** Tam ekran overlay modu */
   fullScreen?: boolean;

   /** Loading mesajı */
   message?: string;

   /** Arka plan blur efekti */
   blurBackground?: boolean;

   /** Animasyon hızı */
   speed?: 'slow' | 'normal' | 'fast';

   /** Özel stil */
   className?: string;

   /** Test ID */
   testID?: string;
}

// ==================== CONSTANTS ====================

const SIZES = {
   xs: { indicator: 16, container: 'w-8 h-8', text: 'text-xs' },
   sm: { indicator: 20, container: 'w-10 h-10', text: 'text-sm' },
   md: { indicator: 24, container: 'w-12 h-12', text: 'text-base' },
   lg: { indicator: 32, container: 'w-16 h-16', text: 'text-lg' },
   xl: { indicator: 40, container: 'w-20 h-20', text: 'text-xl' },
} as const;

const ANIMATION_SPEEDS = {
   slow: 1500,
   normal: 1000,
   fast: 600,
} as const;

// ==================== MAIN COMPONENT ====================

const LoadingComponent: React.FC<LoadingComponentProps> = ({
   size = 'md',
   variant = 'spinner',
   color = '#056161',
   fullScreen = false,
   message,
   blurBackground = false,
   speed = 'normal',
   className = '',
   testID = 'loading-component',
}) => {
   // ==================== ANIMATION REFS ====================

   const spinValue = useRef(new Animated.Value(0)).current;
   const pulseValue = useRef(new Animated.Value(0.3)).current;
   const dotValues = useRef([
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
   ]).current;
   const skeletonValue = useRef(new Animated.Value(0)).current;

   // ==================== ANIMATION FUNCTIONS ====================

   const startSpinAnimation = () => {
      Animated.loop(
         Animated.timing(spinValue, {
            toValue: 1,
            duration: ANIMATION_SPEEDS[speed],
            useNativeDriver: true,
         }),
      ).start();
   };

   const startPulseAnimation = () => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(pulseValue, {
               toValue: 1,
               duration: ANIMATION_SPEEDS[speed] / 2,
               useNativeDriver: true,
            }),
            Animated.timing(pulseValue, {
               toValue: 0.3,
               duration: ANIMATION_SPEEDS[speed] / 2,
               useNativeDriver: true,
            }),
         ]),
      ).start();
   };

   const startDotsAnimation = () => {
      const createDotAnimation = (dotValue: Animated.Value, delay: number) => {
         return Animated.loop(
            Animated.sequence([
               Animated.timing(dotValue, {
                  toValue: 1,
                  duration: ANIMATION_SPEEDS[speed] / 3,
                  delay,
                  useNativeDriver: true,
               }),
               Animated.timing(dotValue, {
                  toValue: 0.3,
                  duration: ANIMATION_SPEEDS[speed] / 3,
                  useNativeDriver: true,
               }),
            ]),
         );
      };

      Animated.parallel([
         createDotAnimation(dotValues[0], 0),
         createDotAnimation(dotValues[1], ANIMATION_SPEEDS[speed] / 6),
         createDotAnimation(dotValues[2], ANIMATION_SPEEDS[speed] / 3),
      ]).start();
   };

   const startSkeletonAnimation = () => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(skeletonValue, {
               toValue: 1,
               duration: ANIMATION_SPEEDS[speed],
               useNativeDriver: true,
            }),
            Animated.timing(skeletonValue, {
               toValue: 0,
               duration: ANIMATION_SPEEDS[speed],
               useNativeDriver: true,
            }),
         ]),
      ).start();
   };

   // ==================== LIFECYCLE ====================

   useEffect(() => {
      switch (variant) {
         case 'spinner':
         case 'icon':
            startSpinAnimation();
            break;
         case 'pulse':
            startPulseAnimation();
            break;
         case 'dots':
            startDotsAnimation();
            break;
         case 'skeleton':
            startSkeletonAnimation();
            break;
      }
   }, [variant, speed]);

   // ==================== RENDER FUNCTIONS ====================

   const renderSpinner = () => (
      <Animated.View
         style={{
            transform: [
               {
                  rotate: spinValue.interpolate({
                     inputRange: [0, 1],
                     outputRange: ['0deg', '360deg'],
                  }),
               },
            ],
         }}>
         <RNActivityIndicator
            size={SIZES[size].indicator}
            color={color}
            testID={`${testID}-spinner`}
         />
      </Animated.View>
   );

   const renderIcon = () => (
      <Animated.View
         style={{
            transform: [
               {
                  rotate: spinValue.interpolate({
                     inputRange: [0, 1],
                     outputRange: ['0deg', '360deg'],
                  }),
               },
            ],
         }}>
         <IconComponent
            Icon={Loader2}
            size={SIZES[size].indicator}
            color={color}
            strokeWidth={2.5}
            stroke={color}
         />
      </Animated.View>
   );

   const renderDots = () => (
      <View className="flex-row items-center space-x-1">
         {dotValues.map((dotValue, index) => (
            <Animated.View
               key={index}
               className={`rounded-full ${
                  size === 'xs'
                     ? 'w-1 h-1'
                     : size === 'sm'
                       ? 'w-1.5 h-1.5'
                       : size === 'md'
                         ? 'w-2 h-2'
                         : size === 'lg'
                           ? 'w-2.5 h-2.5'
                           : 'w-3 h-3'
               }`}
               style={{
                  backgroundColor: color,
                  opacity: dotValue,
                  transform: [
                     {
                        scale: dotValue.interpolate({
                           inputRange: [0.3, 1],
                           outputRange: [0.8, 1.2],
                        }),
                     },
                  ],
               }}
            />
         ))}
      </View>
   );

   const renderPulse = () => (
      <Animated.View
         className={`${SIZES[size].container} rounded-full border-2`}
         style={{
            borderColor: color,
            opacity: pulseValue,
            transform: [
               {
                  scale: pulseValue.interpolate({
                     inputRange: [0.3, 1],
                     outputRange: [0.8, 1.1],
                  }),
               },
            ],
         }}>
         <View className="flex-1 rounded-full" style={{ backgroundColor: `${color}20` }} />
      </Animated.View>
   );

   const renderSkeleton = () => (
      <View className="space-y-3">
         {[1, 2, 3].map((_, index) => (
            <Animated.View
               key={index}
               className={`rounded-lg ${
                  index === 0 ? 'h-4 w-3/4' : index === 1 ? 'h-4 w-full' : 'h-4 w-2/3'
               }`}
               style={{
                  backgroundColor: color,
                  opacity: skeletonValue.interpolate({
                     inputRange: [0, 1],
                     outputRange: [0.3, 0.7],
                  }),
               }}
            />
         ))}
      </View>
   );

   const renderLoadingContent = () => {
      switch (variant) {
         case 'spinner':
            return renderSpinner();
         case 'icon':
            return renderIcon();
         case 'dots':
            return renderDots();
         case 'pulse':
            return renderPulse();
         case 'skeleton':
            return renderSkeleton();
         default:
            return renderSpinner();
      }
   };

   // ==================== STYLE HELPERS ====================

   const getContainerClasses = () => {
      const baseClasses = `items-center justify-center ${className}`;

      if (fullScreen) {
         return `${baseClasses} absolute inset-0 z-[999] ${
            blurBackground ? 'bg-appTransparentColor/80 backdrop-blur-sm' : 'bg-appBackground/90'
         }`;
      }

      return `${baseClasses} p-4`;
   };

   const getMessageClasses = () => {
      return `${SIZES[size].text} font-medium text-appText mt-3 text-center`;
   };

   // ==================== RENDER ====================

   return (
      <View className={getContainerClasses()} testID={testID}>
         {/* Loading Animation */}
         <View className="items-center justify-center">{renderLoadingContent()}</View>

         {/* Loading Message */}
         {message && (
            <Text className={getMessageClasses()} testID={`${testID}-message`}>
               {message}
            </Text>
         )}

         {/* Responsive Enhancement */}
         {fullScreen && (
            <View className="absolute bottom-safe-area-bottom pb-8">
               <Text className="text-appText/60 text-sm text-center">Lütfen bekleyin...</Text>
            </View>
         )}
      </View>
   );
};

export default LoadingComponent;
