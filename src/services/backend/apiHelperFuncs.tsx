// utils/apiUtils.ts
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { apiClient } from './apiClient';

// Network Status Check
export const checkNetworkStatus = async (): Promise<boolean> => {
   try {
      const netInfo = await NetInfo.fetch();
      return netInfo.isConnected ?? false;
   } catch (error) {
      console.error('Network check failed:', error);
      return false;
   }
};

// API Error Handler
export const handleApiError = (error: any, showAlert = true): string => {
   let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';

   if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
   } else if (error?.message) {
      errorMessage = error.message;
   }

   if (showAlert) {
      Alert.alert('Hata', errorMessage, [{ text: 'Tamam' }]);
   }

   return errorMessage;
};

// File Upload Helper
export const uploadFileWithProgress = async (
   url: string,
   file: FormData,
   onProgress?: (progress: number) => void,
): Promise<any> => {
   try {
      const response = await apiClient.uploadFile(url, file, {
         onUploadProgress: progressEvent => {
            if (progressEvent.total) {
               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
               onProgress?.(progress);
            }
         },
      });

      return response.data;
   } catch (error) {
      throw error;
   }
};

// Download Helper
export const downloadFileWithProgress = async (
   url: string,
   onProgress?: (progress: number) => void,
): Promise<Blob> => {
   try {
      const response = await apiClient.downloadFile(url, {
         onDownloadProgress: progressEvent => {
            if (progressEvent.total) {
               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
               onProgress?.(progress);
            }
         },
      });

      return response.data;
   } catch (error) {
      throw error;
   }
};

// Cache Helper
export const createCacheKey = (endpoint: string, params?: any): string => {
   const paramsString = params ? JSON.stringify(params) : '';
   return `${endpoint}_${paramsString}`;
};

// Environment Helper
export const getApiEndpoint = (path: string): string => {
   const baseUrl = apiClient.getBaseURL();
   return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Type Guards
export const isApiError = (error: any): error is { response: { status: number; data: any } } => {
   return error && error.response && typeof error.response.status === 'number';
};

export const isNetworkError = (error: any): boolean => {
   return error && (error.code === 'NETWORK_ERROR' || error.message?.includes('Network'));
};

// Format helpers
export const formatFileSize = (bytes: number): string => {
   if (bytes === 0) return '0 Bytes';
   const k = 1024;
   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
