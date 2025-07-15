// hooks/useAsync.ts
import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '@contexts/slices/notification/notificationSlice';
import type {
   NotificationType,
   NotificationModalType,
} from '@contexts/slices/notification/notificationSlice';
import { AxiosError } from 'axios';

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

// Geliştirilmiş Error interface'i
export interface AsyncError {
   message: string;
   statusCode?: number;
   code?: string;
   details?: any;
   originalError?: any; // Orijinal error object
}

interface UseAsyncOptions<T> {
   onSuccess?: (result: T) => void;
   onError?: (error: AsyncError) => void; // Error callback'i geliştirdik
   showNotificationOnError?: boolean;
   showNotificationOnSuccess?: boolean;
   successMessage?: string;
   errorMessage?: string;
   notificationType?: NotificationType;
   modalType?: NotificationModalType;
   duration?: number;
}

// Error parsing utility
const parseError = (error: any, customMessage?: string): AsyncError => {
   const asyncError: AsyncError = {
      message: customMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      originalError: error,
   };

   // Axios Error handling
   if (error?.response) {
      asyncError.statusCode = error.response.status;
      asyncError.code = error.response.data?.code;
      asyncError.details = error.response.data?.details;

      // Backend'den gelen mesajı kullan
      if (error.response.data?.message) {
         asyncError.message = customMessage || error.response.data.message;
      }
   }
   // Network Error
   else if (error?.request) {
      asyncError.message =
         customMessage || 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
      asyncError.code = 'NETWORK_ERROR';
   }
   // Other errors
   else if (error?.message) {
      asyncError.message = customMessage || error.message;
   }

   return asyncError;
};

export function useAsync<T>(asyncFunction: AsyncFunction<T>, options?: UseAsyncOptions<T>) {
   if (typeof asyncFunction !== 'function') {
      throw new Error('Passed asyncFunction is not a function');
   }

   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<AsyncError | null>(null); // AsyncError tipinde
   const [data, setData] = useState<T | null>(null);
   const [success, setSuccess] = useState<boolean>(false);
   const lastArgsRef = useRef<any[]>([]);

   const dispatch = useDispatch();

   const execute = useCallback(
      async (...args: any[]) => {
         setLoading(true);
         setError(null);
         setSuccess(false);
         lastArgsRef.current = args;

         try {
            const result = await asyncFunction(...args);
            setData(result);
            setSuccess(true);

            // Call success callback
            options?.onSuccess?.(result);

            // Show success notification if enabled and message provided
            if (options?.showNotificationOnSuccess && options?.successMessage) {
               dispatch(
                  showNotification({
                     message: options.successMessage,
                     type: options?.notificationType || 'success',
                     modalType: options?.modalType || 'snackbar',
                     duration: options?.duration || 3000,
                  }),
               );
            }

            return result;
         } catch (err) {
            console.log('Error:', err);

            // Parse error
            const parsedError = parseError(err, options?.errorMessage);
            setError(parsedError);

            // Show error notification (default: true)
            if (options?.showNotificationOnError !== false) {
               dispatch(
                  showNotification({
                     message: parsedError.message,
                     type: options?.notificationType || 'error',
                     modalType: options?.modalType || 'snackbar',
                     duration: options?.duration || 3000,
                  }),
               );
            }

            // Call error callback with parsed error
            options?.onError?.(parsedError);

            // Error'ı throw etme, null return et
            return null;
         } finally {
            setLoading(false);
         }
      },
      [asyncFunction, dispatch, options],
   );

   const retry = useCallback(() => {
      if (lastArgsRef.current.length > 0) {
         execute(...lastArgsRef.current);
      }
   }, [execute]);

   const reset = useCallback(() => {
      setData(null);
      setLoading(false);
      setError(null);
      setSuccess(false);
      lastArgsRef.current = [];
   }, []);

   return {
      execute,
      retry,
      reset,
      loading,
      error, // Artık AsyncError tipinde
      data,
      success,
   };
}
