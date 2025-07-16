import { useState, useCallback } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

// Enhanced image result interface
export interface ImageResult {
   uri: string;
   width?: number;
   height?: number;
   containerWidth?: number;
   containerHeight?: number;
   type?: string;
   fileName?: string;
   fileSize?: number;
   base64?: string;
   exif?: any;
   mimeType?: string;
   duration?: number; // For videos
}

// Hook options interface
interface UseCameraOptions {
   quality?: number; // 0-1, image quality
   allowsEditing?: boolean;
   mediaTypes?: 'images' | 'videos' | 'all';
   includeBase64?: boolean;
   maxContainerHeight?: number;
   aspectRatio?: [number, number];
   showActionSheet?: boolean;
   customActionSheet?: boolean;
   onError?: (error: string) => void;
   onPermissionDenied?: () => void;
   onImageSelected?: (image: ImageResult) => void;
   onVideoSelected?: (video: ImageResult) => void;
   compressImageQuality?: number;
   saveToGallery?: boolean;
}

// Action sheet options
interface ActionSheetOption {
   title: string;
   action: () => void;
   icon?: string;
   destructive?: boolean;
   disabled?: boolean;
}

export const useCamera = (options: UseCameraOptions = {}) => {
   const {
      quality = 0.8,
      allowsEditing = true,
      mediaTypes = 'images',
      includeBase64 = false,
      maxContainerHeight = 300,
      aspectRatio,
      showActionSheet = true,
      customActionSheet = false,
      onError,
      onPermissionDenied,
      onImageSelected,
      onVideoSelected,
      compressImageQuality = 0.7,
      saveToGallery = false,
   } = options;

   const { width: screenWidth } = useWindowDimensions();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [hasPermission, setHasPermission] = useState<boolean | null>(null);

   // Calculate container dimensions
   const calculateContainerDimensions = useCallback(
      (imageWidth: number, imageHeight: number) => {
         if (!imageWidth || !imageHeight) return { containerWidth: 0, containerHeight: 0 };

         const ratio = imageWidth / imageHeight;
         const containerWidth = (screenWidth - 32) * 0.75; // 32px padding, 75% of available width
         const containerHeight = Math.min(containerWidth / ratio, maxContainerHeight);

         return {
            containerWidth: Math.round(containerWidth),
            containerHeight: Math.round(containerHeight),
         };
      },
      [screenWidth, maxContainerHeight],
   );

   // Check and request permissions
   const checkPermissions = useCallback(
      async (forCamera: boolean = false) => {
         try {
            let permissionResult;

            if (forCamera) {
               permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            } else {
               permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }

            if (!permissionResult.granted) {
               const permissionName = forCamera ? 'kamera' : 'medya kütüphanesi';
               const errorMsg = `${permissionName} izni gerekli`;
               setError(errorMsg);
               onError?.(errorMsg);
               onPermissionDenied?.();
               return false;
            }

            setHasPermission(true);
            return true;
         } catch (err) {
            const errorMsg = 'İzin kontrolü sırasında hata oluştu';
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
         }
      },
      [onError, onPermissionDenied],
   );

   // Process selected image/video
   const processSelectedMedia = useCallback(
      async (result: ImagePicker.ImagePickerResult): Promise<ImageResult | null> => {
         if (result.canceled || !result.assets || result.assets.length === 0) {
            return null;
         }

         const asset = result.assets[0];

         try {
            // Get file info
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);

            // Calculate container dimensions for images
            const containerDimensions =
               asset.width && asset.height
                  ? calculateContainerDimensions(asset.width, asset.height)
                  : { containerWidth: 0, containerHeight: 0 };

            // Save to gallery if requested
            if (saveToGallery && asset.type === 'image') {
               try {
                  const galleryPermission = await MediaLibrary.requestPermissionsAsync();
                  if (galleryPermission.granted) {
                     await MediaLibrary.saveToLibraryAsync(asset.uri);
                  }
               } catch (galleryError) {
                  console.warn('Gallery save failed:', galleryError);
               }
            }

            const processedImage: ImageResult = {
               uri: asset.uri,
               width: asset.width,
               height: asset.height,
               ...containerDimensions,
               type: asset.type,
               fileName: asset.fileName || `image_${Date.now()}.jpg`,
               fileSize: fileInfo.exists ? fileInfo.size : asset.fileSize,
               base64: includeBase64 ? asset.base64 : undefined,
               exif: asset.exif,
               mimeType: asset.mimeType,
               duration: asset.duration,
            };

            return processedImage;
         } catch (err) {
            const errorMsg = 'Medya işleme sırasında hata oluştu';
            setError(errorMsg);
            onError?.(errorMsg);
            return null;
         }
      },
      [calculateContainerDimensions, includeBase64, saveToGallery, onError],
   );

   // Launch camera
   const launchCamera = useCallback(async (): Promise<ImageResult | null> => {
      setLoading(true);
      setError(null);

      try {
         const hasPermission = await checkPermissions(true);
         if (!hasPermission) {
            setLoading(false);
            return null;
         }

         const result = await ImagePicker.launchCameraAsync({
            mediaTypes:
               mediaTypes === 'images'
                  ? ImagePicker.MediaTypeOptions.Images
                  : mediaTypes === 'videos'
                    ? ImagePicker.MediaTypeOptions.Videos
                    : ImagePicker.MediaTypeOptions.All,
            allowsEditing,
            aspect: aspectRatio,
            quality,
            base64: includeBase64,
         });

         const processedResult = await processSelectedMedia(result);

         if (processedResult) {
            if (processedResult.type === 'image') {
               onImageSelected?.(processedResult);
            } else if (processedResult.type === 'video') {
               onVideoSelected?.(processedResult);
            }
         }

         return processedResult;
      } catch (err) {
         const errorMsg = 'Kamera açılırken hata oluştu';
         setError(errorMsg);
         onError?.(errorMsg);
         return null;
      } finally {
         setLoading(false);
      }
   }, [
      checkPermissions,
      mediaTypes,
      allowsEditing,
      aspectRatio,
      quality,
      includeBase64,
      processSelectedMedia,
      onImageSelected,
      onVideoSelected,
      onError,
   ]);

   // Launch image library
   const launchImageLibrary = useCallback(async (): Promise<ImageResult | null> => {
      setLoading(true);
      setError(null);

      try {
         const hasPermission = await checkPermissions(false);
         if (!hasPermission) {
            setLoading(false);
            return null;
         }

         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
               mediaTypes === 'images'
                  ? ImagePicker.MediaTypeOptions.Images
                  : mediaTypes === 'videos'
                    ? ImagePicker.MediaTypeOptions.Videos
                    : ImagePicker.MediaTypeOptions.All,
            allowsEditing,
            aspect: aspectRatio,
            quality,
            base64: includeBase64,
            selectionLimit: 1,
         });

         const processedResult = await processSelectedMedia(result);

         if (processedResult) {
            if (processedResult.type === 'image') {
               onImageSelected?.(processedResult);
            } else if (processedResult.type === 'video') {
               onVideoSelected?.(processedResult);
            }
         }

         return processedResult;
      } catch (err) {
         const errorMsg = 'Galeri açılırken hata oluştu';
         setError(errorMsg);
         onError?.(errorMsg);
         return null;
      } finally {
         setLoading(false);
      }
   }, [
      checkPermissions,
      mediaTypes,
      allowsEditing,
      aspectRatio,
      quality,
      includeBase64,
      processSelectedMedia,
      onImageSelected,
      onVideoSelected,
      onError,
   ]);

   // Show action sheet
   const showImagePicker = useCallback(
      (callback?: (image: ImageResult) => void) => {
         if (customActionSheet) {
            // Return options for custom action sheet
            const options: ActionSheetOption[] = [
               {
                  title: 'Kamera',
                  action: async () => {
                     const result = await launchCamera();
                     if (result && callback) callback(result);
                  },
                  icon: 'camera',
               },
               {
                  title: 'Galeri',
                  action: async () => {
                     const result = await launchImageLibrary();
                     if (result && callback) callback(result);
                  },
                  icon: 'image',
               },
            ];
            return options;
         }

         if (showActionSheet) {
            Alert.alert(
               'Resim Seç',
               'Resmi nereden seçmek istiyorsunuz?',
               [
                  {
                     text: 'Kamera',
                     onPress: async () => {
                        const result = await launchCamera();
                        if (result && callback) callback(result);
                     },
                  },
                  {
                     text: 'Galeri',
                     onPress: async () => {
                        const result = await launchImageLibrary();
                        if (result && callback) callback(result);
                     },
                  },
                  {
                     text: 'İptal',
                     style: 'cancel',
                  },
               ],
               { cancelable: true },
            );
         }
      },
      [customActionSheet, showActionSheet, launchCamera, launchImageLibrary],
   );

   // Generic handler for any callback (backward compatibility)
   const handleImageSelection = useCallback(
      (callback: (image: ImageResult) => void) => {
         showImagePicker(callback);
      },
      [showImagePicker],
   );

   // Formik helper (for backward compatibility)
   const handleFormikImage = useCallback(
      (fieldName: string, setFieldValue: (field: string, value: ImageResult) => void) => {
         handleImageSelection(image => {
            setFieldValue(fieldName, image);
         });
      },
      [handleImageSelection],
   );

   return {
      // Main functions
      launchCamera,
      launchImageLibrary,
      showImagePicker,
      handleImageSelection,

      // Formik compatibility
      handleFormikImage,

      // State
      loading,
      error,
      hasPermission,

      // Utility functions
      checkPermissions,
      calculateContainerDimensions,

      // Clear error
      clearError: () => setError(null),
   };
};
