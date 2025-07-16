import React, { useCallback, useState } from 'react';
import {
   View,
   Pressable,
   ImageBackground,
   Text,
   Image,
   TouchableOpacity,
   StyleProp,
   ViewStyle,
   ActivityIndicator,
   Alert,
} from 'react-native';
import { Camera, Image as ImageIcon, RefreshCw, X, AlertCircle } from 'lucide-react-native';
import { useCamera, ImageResult } from '@hooks/common/useCamera';

export interface ImagePickerComponentProps {
   image: ImageResult | null;
   onImageSelected: (image: ImageResult) => void;
   onImageRemoved?: () => void;
   fieldName?: string; // Backward compatibility
   setFieldValue?: (field: string, value: ImageResult) => void; // Backward compatibility
   variant?: 'default' | 'compact' | 'circular' | 'minimal';
   size?: 'small' | 'medium' | 'large';
   aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
   showRemoveButton?: boolean;
   showEditButton?: boolean;
   disabled?: boolean;
   placeholder?: string;
   errorMessage?: string;
   className?: string;
   style?: StyleProp<ViewStyle>;
   imageStyle?: StyleProp<ViewStyle>;
   allowsEditing?: boolean;
   quality?: number;
   includeBase64?: boolean;
   showActionSheet?: boolean;
   customActionSheet?: boolean;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
   image,
   onImageSelected,
   onImageRemoved,
   fieldName, // Backward compatibility
   setFieldValue, // Backward compatibility
   variant = 'default',
   size = 'medium',
   aspectRatio = 'auto',
   showRemoveButton = true,
   showEditButton = false,
   disabled = false,
   placeholder,
   errorMessage,
   className = '',
   style,
   allowsEditing = true,
   quality = 0.8,
   includeBase64 = false,
   showActionSheet = true,
   customActionSheet = false,
}) => {
   const [isPressed, setIsPressed] = useState(false);

   // Handle image selection
   const handleImageSelect = useCallback(
      (selectedImage: ImageResult) => {
         onImageSelected(selectedImage);
         // Backward compatibility
         if (fieldName && setFieldValue) {
            setFieldValue(fieldName, selectedImage);
         }
      },
      [onImageSelected, fieldName, setFieldValue],
   );

   // Handle image removal
   const handleRemoveImage = useCallback(() => {
      if (onImageRemoved) {
         onImageRemoved();
      } else {
         // Default behavior - set to null
         onImageSelected(null as any);
      }
      // Backward compatibility
      if (fieldName && setFieldValue) {
         setFieldValue(fieldName, null as any);
      }
   }, [onImageRemoved, onImageSelected, fieldName, setFieldValue]);

   // Handle errors
   const handleError = useCallback((error: string) => {
      Alert.alert('Hata', error, [{ text: 'Tamam' }]);
   }, []);

   // useCamera hook
   const { showImagePicker, launchCamera, launchImageLibrary, loading, error, clearError } =
      useCamera({
         allowsEditing,
         quality,
         includeBase64,
         showActionSheet,
         customActionSheet,
         onImageSelected: handleImageSelect,
         onError: handleError,
         mediaTypes: 'images',
      });

   // Size configurations
   const sizeConfig = {
      small: {
         container: 'w-20 h-20',
         defaultHeight: 80,
         text: 'text-xs',
         iconSize: 16,
         padding: 'p-2',
      },
      medium: {
         container: 'w-32 h-32',
         defaultHeight: 128,
         text: 'text-sm',
         iconSize: 20,
         padding: 'p-3',
      },
      large: {
         container: 'w-48 h-48',
         defaultHeight: 192,
         text: 'text-base',
         iconSize: 24,
         padding: 'p-4',
      },
   };

   // Variant configurations
   const variantConfig = {
      default: {
         container: 'rounded-xl border-2 border-dashed border-appBorderColor',
         overlay: 'bg-appTransparentColor/70 rounded-lg',
         text: 'text-appText',
         background: 'bg-appTransition',
      },
      compact: {
         container: 'rounded-lg border border-appBorderColor',
         overlay: 'bg-appTransparentColor/60 rounded-md',
         text: 'text-appText',
         background: 'bg-appBackground',
      },
      circular: {
         container: 'rounded-full border-2 border-appBorderColor',
         overlay: 'bg-appTransparentColor/70 rounded-full',
         text: 'text-appText',
         background: 'bg-appTransition',
      },
      minimal: {
         container: 'rounded-lg border border-appBorderColor/50',
         overlay: 'bg-appTransparentColor/50 rounded-lg',
         text: 'text-appText/80',
         background: 'bg-appBackground/50',
      },
   };

   // Aspect ratio configurations
   const aspectRatioConfig = {
      square: 'aspect-square',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
      auto: '',
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];
   const currentAspectRatio = aspectRatioConfig[aspectRatio];

   // Container dimensions
   const containerDimensions =
      image?.containerWidth && image?.containerHeight && aspectRatio === 'auto'
         ? { width: image.containerWidth, height: image.containerHeight }
         : {};

   // Placeholder text
   const placeholderText = placeholder || (image ? 'Resmi Değiştir' : 'Resim Seç');

   // Handle press
   const handlePress = useCallback(() => {
      if (disabled || loading) return;

      clearError();
      if (customActionSheet) {
         const options = showImagePicker();
         // Handle custom action sheet options here
      } else {
         showImagePicker(handleImageSelect);
      }
   }, [disabled, loading, clearError, customActionSheet, showImagePicker, handleImageSelect]);

   return (
      <View className={`w-full items-center justify-center ${className}`}>
         {/* Main Container */}
         <View className="relative">
            <Pressable
               onPress={handlePress}
               onPressIn={() => setIsPressed(true)}
               onPressOut={() => setIsPressed(false)}
               disabled={disabled || loading}
               className={`
                  overflow-hidden items-center justify-center
                  ${aspectRatio === 'auto' ? 'w-full' : currentSize.container}
                  ${currentAspectRatio}
                  ${currentVariant.container}
                  ${currentVariant.background}
                  ${disabled ? 'opacity-50' : ''}
                  ${isPressed ? 'scale-95' : 'scale-100'}
                  transition-transform duration-150
               `}
               style={[
                  containerDimensions,
                  aspectRatio === 'auto' && !image ? { height: currentSize.defaultHeight } : {},
                  style,
               ]}>
               {/* Image or Placeholder */}
               {image?.uri ? (
                  <Image
                     source={{ uri: image.uri }}
                     className="w-full h-full"
                     style={[
                        {
                           resizeMode: variant === 'circular' ? 'cover' : 'contain',
                           opacity: isPressed ? 0.8 : 1,
                        },
                     ]}
                  />
               ) : (
                  <View className="w-full h-full items-center justify-center">
                     <Camera
                        size={currentSize.iconSize * 2}
                        color="rgb(var(--color-app-icon))"
                        strokeWidth={1.5}
                     />
                  </View>
               )}

               {/* Overlay */}
               {(isPressed || !image) && (
                  <View
                     className={`
                     absolute inset-0 items-center justify-center
                     ${currentVariant.overlay}
                  `}>
                     <View className={`items-center ${currentSize.padding}`}>
                        {loading ? (
                           <ActivityIndicator
                              size="small"
                              color="rgb(var(--color-app-button-text))"
                           />
                        ) : (
                           <>
                              <ImageIcon
                                 size={currentSize.iconSize}
                                 color="rgb(var(--color-app-button-text))"
                                 strokeWidth={2}
                              />
                              <Text
                                 className={`
                                 ${currentSize.text} 
                                 text-appButtonText 
                                 font-appFont 
                                 font-medium 
                                 text-center 
                                 mt-1
                              `}>
                                 {placeholderText}
                              </Text>
                           </>
                        )}
                     </View>
                  </View>
               )}
            </Pressable>

            {/* Action Buttons */}
            {image && !disabled && (
               <View className="absolute -top-2 -right-2 flex-row space-x-1">
                  {/* Edit Button */}
                  {showEditButton && (
                     <TouchableOpacity
                        onPress={handlePress}
                        className="w-8 h-8 rounded-full bg-appButton items-center justify-center"
                        style={{
                           shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                           elevation: 4,
                        }}
                        activeOpacity={0.8}>
                        <RefreshCw
                           size={14}
                           color="rgb(var(--color-app-button-text))"
                           strokeWidth={2}
                        />
                     </TouchableOpacity>
                  )}

                  {/* Remove Button */}
                  {showRemoveButton && (
                     <TouchableOpacity
                        onPress={handleRemoveImage}
                        className="w-8 h-8 rounded-full bg-appError items-center justify-center"
                        style={{
                           shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                           elevation: 4,
                        }}
                        activeOpacity={0.8}>
                        <X size={14} color="white" strokeWidth={2} />
                     </TouchableOpacity>
                  )}
               </View>
            )}
         </View>

         {/* Error Message */}
         {(error || errorMessage) && (
            <View className="flex-row items-center mt-2 px-2">
               <AlertCircle size={14} color="rgb(var(--color-app-error))" strokeWidth={2} />
               <Text className="text-appError font-appFont text-sm ml-1">
                  {error || errorMessage}
               </Text>
            </View>
         )}

         {/* Image Info */}
         {image && (
            <View className="mt-2 px-2">
               <Text className="text-appIcon font-appFont text-xs text-center">
                  {image.fileName} •{' '}
                  {image.fileSize ? `${Math.round(image.fileSize / 1024)}KB` : 'N/A'}
               </Text>
               {image.width && image.height && (
                  <Text className="text-appIcon font-appFont text-xs text-center">
                     {image.width}x{image.height}
                  </Text>
               )}
            </View>
         )}
      </View>
   );
};

export default ImagePickerComponent;
