// components/ExtendedPicker/ExtendedPicker.tsx
import React, { useState, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   Animated,
   LayoutAnimation,
   Platform,
   UIManager,
} from 'react-native';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react-native';
import IconComponent from '@mycomponents/LucidImage';
import { useTailwindColors } from '@styles/tailwind.colors';
// Android için LayoutAnimation'ı aktif et
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
   UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExtendedPickerComponentProps {
   content: React.ReactNode;
   title: string;
   icon?: React.ReactNode;
   variant?: 'default' | 'compact' | 'card' | 'minimal';
   size?: 'small' | 'medium' | 'large';
   className?: string;
   disabled?: boolean;
   initialOpen?: boolean;
   showToggleButton?: boolean;
   animationType?: 'layout' | 'scale' | 'fade';
   onToggle?: (isOpen: boolean) => void;
   customHeader?: React.ReactNode;
   headerProps?: {
      showIcon?: boolean;
      showChevron?: boolean;
      iconPosition?: 'left' | 'right';
   };
   contentProps?: {
      showCloseButton?: boolean;
      closeButtonText?: string;
      closeButtonPosition?: 'center' | 'left' | 'right';
   };
}

export interface ExtendedPickerRef {
   toggle: () => void;
   open: () => void;
   close: () => void;
   isOpen: boolean;
}

const ExtendedPickerComponent = forwardRef<ExtendedPickerRef, ExtendedPickerComponentProps>(
   (
      {
         content,
         title,
         icon,
         variant = 'default',
         size = 'medium',
         className = '',
         disabled = false,
         initialOpen = false,
         showToggleButton = true,
         animationType = 'layout',
         onToggle,
         customHeader,
         headerProps = {
            showIcon: true,
            showChevron: true,
            iconPosition: 'left',
         },
         contentProps = {
            showCloseButton: true,
            closeButtonText: 'Kapat',
            closeButtonPosition: 'center',
         },
      },
      ref,
   ) => {
      const [isOpen, setIsOpen] = useState(initialOpen);
      const scaleAnim = useRef(new Animated.Value(initialOpen ? 1 : 0)).current;
      const fadeAnim = useRef(new Animated.Value(initialOpen ? 1 : 0)).current;
      const colors = useTailwindColors();
      // Size configurations
      const sizeConfig = {
         small: {
            container: 'gap-2',
            header: 'p-3 rounded-lg',
            content: 'p-3',
            closeButton: 'py-2 px-4 rounded-lg',
            title: 'text-sm',
            iconSize: 16,
            chevronSize: 16,
            closeButtonText: 'text-sm',
         },
         medium: {
            container: 'gap-3',
            header: 'p-4 rounded-xl',
            content: 'p-4',
            closeButton: 'py-3 px-6 rounded-xl',
            title: 'text-base',
            iconSize: 20,
            chevronSize: 20,
            closeButtonText: 'text-base',
         },
         large: {
            container: 'gap-4',
            header: 'p-5 rounded-2xl',
            content: 'p-5',
            closeButton: 'py-4 px-8 rounded-2xl',
            title: 'text-lg',
            iconSize: 24,
            chevronSize: 24,
            closeButtonText: 'text-lg',
         },
      };

      // Variant configurations
      const variantConfig = {
         default: {
            container: 'bg-appBackground border border-appBorderColor',
            header: 'bg-appTransition',
            headerActive: 'bg-appButton/10',
            content: 'bg-appBackground',
            title: 'text-appText',
            titleActive: 'text-appButton',
            closeButton: 'bg-appButton',
            closeButtonText: 'text-appButtonText',
            shadow: true,
         },
         compact: {
            container: 'bg-appCardBackground border border-appBorderColor',
            header: 'bg-appCardBackground',
            headerActive: 'bg-appButton/5',
            content: 'bg-appCardBackground',
            title: 'text-appCardText',
            titleActive: 'text-appButton',
            closeButton: 'bg-appCardButton',
            closeButtonText: 'text-appButtonText',
            shadow: false,
         },
         card: {
            container: 'bg-appCardBackground border border-appBorderColor',
            header: 'bg-appCardBackground',
            headerActive: 'bg-appButton/10',
            content: 'bg-appBackground',
            title: 'text-appCardText',
            titleActive: 'text-appButton',
            closeButton: 'bg-appButton',
            closeButtonText: 'text-appButtonText',
            shadow: true,
         },
         minimal: {
            container: 'bg-transparent',
            header: 'bg-appTransition border border-appBorderColor',
            headerActive: 'bg-appButton/5 border-appButton',
            content: 'bg-appBackground border-x border-b border-appBorderColor',
            title: 'text-appText',
            titleActive: 'text-appButton',
            closeButton: 'bg-appTransparentColor border border-appBorderColor',
            closeButtonText: 'text-appText',
            shadow: false,
         },
      };

      const currentSize = sizeConfig[size];
      const currentVariant = variantConfig[variant];

      // Animation presets
      const animationPresets = {
         layout: LayoutAnimation.Presets.easeInEaseOut,
         scale: {
            duration: 300,
            create: { type: 'easeInEaseOut', property: 'scaleY' },
            update: { type: 'easeInEaseOut' },
         },
         fade: {
            duration: 300,
            create: { type: 'easeInEaseOut', property: 'opacity' },
            update: { type: 'easeInEaseOut' },
         },
      };

      // Toggle function
      const handleToggle = useCallback(() => {
         if (disabled) return;

         const newIsOpen = !isOpen;

         // Layout Animation
         if (animationType === 'layout') {
            LayoutAnimation.configureNext(animationPresets.layout);
         }

         // Scale Animation
         if (animationType === 'scale') {
            Animated.timing(scaleAnim, {
               toValue: newIsOpen ? 1 : 0,
               duration: 300,
               useNativeDriver: true,
            }).start();
         }

         // Fade Animation
         if (animationType === 'fade') {
            Animated.timing(fadeAnim, {
               toValue: newIsOpen ? 1 : 0,
               duration: 300,
               useNativeDriver: true,
            }).start();
         }

         setIsOpen(newIsOpen);
         onToggle?.(newIsOpen);
      }, [isOpen, disabled, animationType, scaleAnim, fadeAnim, onToggle]);

      const handleOpen = useCallback(() => {
         if (!isOpen) handleToggle();
      }, [isOpen, handleToggle]);

      const handleClose = useCallback(() => {
         if (isOpen) handleToggle();
      }, [isOpen, handleToggle]);

      // Ref methods
      useImperativeHandle(
         ref,
         () => ({
            toggle: handleToggle,
            open: handleOpen,
            close: handleClose,
            isOpen,
         }),
         [handleToggle, handleOpen, handleClose, isOpen],
      );

      // Render default icon
      const renderDefaultIcon = () => {
         if (icon) return icon;
         return (
            <IconComponent
               Icon={MoreHorizontal}
               className="text-appIcon"
               size={currentSize.iconSize}
            />
         );
      };

      // Render chevron
      const renderChevron = () => {
         const ChevronIcon = isOpen ? ChevronUp : ChevronDown;
         return (
            <IconComponent
               Icon={ChevronIcon}
               className={isOpen ? 'text-appButton' : 'text-appIcon'}
               size={currentSize.chevronSize}
            />
         );
      };

      // Render header content
      const renderHeader = () => {
         if (customHeader) return customHeader;

         return (
            <View className="flex-row items-center justify-between">
               <View className="flex-row items-center flex-1">
                  {headerProps.showIcon && headerProps.iconPosition === 'left' && (
                     <View className="mr-3">{renderDefaultIcon()}</View>
                  )}

                  <Text
                     className={`
                ${isOpen ? currentVariant.titleActive : currentVariant.title} 
                font-appFont font-medium 
                ${currentSize.title}
                flex-1
              `}
                     numberOfLines={1}>
                     {title}
                  </Text>

                  {headerProps.showIcon && headerProps.iconPosition === 'right' && (
                     <View className="ml-3">{renderDefaultIcon()}</View>
                  )}
               </View>

               {headerProps.showChevron && <View className="ml-3">{renderChevron()}</View>}
            </View>
         );
      };

      // Render close button
      const renderCloseButton = () => {
         if (!contentProps.showCloseButton) return null;

         const buttonAlignmentClass =
            contentProps.closeButtonPosition === 'left'
               ? 'self-start'
               : contentProps.closeButtonPosition === 'right'
                 ? 'self-end'
                 : 'self-center';

         return (
            <TouchableOpacity
               onPress={handleClose}
               className={`
            ${currentVariant.closeButton}
            ${currentSize.closeButton}
            ${buttonAlignmentClass}
            mt-4
            active:opacity-70
          `}
               activeOpacity={0.7}>
               <Text
                  className={`
              ${currentVariant.closeButtonText} 
              font-appFont font-medium 
              ${currentSize.closeButtonText}
              text-center
            `}>
                  {contentProps.closeButtonText}
               </Text>
            </TouchableOpacity>
         );
      };

      // Render content with animations
      const renderContent = () => {
         if (!isOpen) return null;

         let animatedProps = {};

         if (animationType === 'scale') {
            animatedProps = {
               style: {
                  transform: [{ scaleY: scaleAnim }],
                  opacity: scaleAnim,
               },
            };
         } else if (animationType === 'fade') {
            animatedProps = {
               style: { opacity: fadeAnim },
            };
         }

         const ContentWrapper = animationType !== 'layout' ? Animated.View : View;

         return (
            <ContentWrapper {...animatedProps}>
               <View
                  className={`
              ${currentVariant.content}
              ${currentSize.content}
              ${variant === 'minimal' ? 'rounded-b-xl' : 'rounded-xl mt-1'}
              ${currentVariant.shadow ? 'shadow-md' : ''}
               `}>
                  {content}
                  {renderCloseButton()}
               </View>
            </ContentWrapper>
         );
      };

      return (
         <View
            className={`
          ${currentVariant.container}
          ${currentSize.container}
          ${variant !== 'minimal' ? 'rounded-xl' : ''}
          ${disabled ? 'opacity-50' : ''}
          ${className}
          ${currentVariant.shadow ? 'shadow-md' : ''}
        `}>
            {/* Header */}
            {showToggleButton && (
               <TouchableOpacity
                  onPress={handleToggle}
                  disabled={disabled}
                  className={`
              ${isOpen ? currentVariant.headerActive : currentVariant.header}
              ${currentSize.header}
              ${variant === 'minimal' && isOpen ? 'rounded-t-xl' : 'rounded-xl'}
              active:opacity-90
            `}
                  activeOpacity={0.9}>
                  {renderHeader()}
               </TouchableOpacity>
            )}

            {/* Content */}
            {renderContent()}
         </View>
      );
   },
);

ExtendedPickerComponent.displayName = 'ExtendedPickerComponent';

export default ExtendedPickerComponent;
