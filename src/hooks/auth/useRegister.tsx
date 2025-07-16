// hooks/useRegister.ts
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAsync, AsyncError } from '@hooks/modular/useAsync';
import { apiClient } from '@services/backend/apiClient';
import authService from '@services/backend/authService';
// Types
import type { UserProfile, RegisterResponse, RegisterCredentials } from '@apptypes/index';

// Error types for specific handling
export const REGISTER_ERROR_CODES = {
   EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
   PHONE_ALREADY_EXISTS: 'PHONE_ALREADY_EXISTS',
   WEAK_PASSWORD: 'WEAK_PASSWORD',
   INVALID_EMAIL: 'INVALID_EMAIL',
   TERMS_NOT_ACCEPTED: 'TERMS_NOT_ACCEPTED',
   NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export interface UseRegisterOptions {
   onRegisterSuccess?: (response: RegisterResponse) => void;
   onRegisterError?: (error: AsyncError) => void;
   onEmailAlreadyExists?: (error: AsyncError) => void;
   onPhoneAlreadyExists?: (error: AsyncError) => void;
}

export interface UseRegisterReturn {
   // States
   loading: boolean;
   error: AsyncError | null;

   // Methods
   register: (credentials: RegisterCredentials) => Promise<void>;

   // Utilities
   reset: () => void;

   // Helper methods for error checking
   isEmailAlreadyExists: () => boolean;
   isPhoneAlreadyExists: () => boolean;
   isNetworkError: () => boolean;
   isInvalidEmail: () => boolean;
}

// Hook
export const useRegister = (options?: UseRegisterOptions): UseRegisterReturn => {
   const dispatch = useDispatch();

   // Register async handler
   const {
      execute: executeRegister,
      loading: registerLoading,
      error: registerError,
      reset: resetRegister,
   } = useAsync(authService.registerApi, {
      onSuccess: (result: RegisterResponse) => {
         // Call custom success callback
         options?.onRegisterSuccess?.(result);
      },
      onError: (error: AsyncError) => {
         // Specific error handling
         if (error.statusCode === 409) {
            // Conflict - email or phone already exists
            if (error.code === REGISTER_ERROR_CODES.EMAIL_ALREADY_EXISTS) {
               options?.onEmailAlreadyExists?.(error);
            } else if (error.code === REGISTER_ERROR_CODES.PHONE_ALREADY_EXISTS) {
               options?.onPhoneAlreadyExists?.(error);
            }
         }

         // General error callback
         options?.onRegisterError?.(error);
      },
      showNotificationOnError: false, // Error'ları form'da göstereceğiz
      showNotificationOnSuccess: true,
      successMessage: 'Kayıt işlemi başarılı! Email doğrulama linkini kontrol edin.',
   });

   // Register function
   const register = useCallback(
      async (credentials: RegisterCredentials): Promise<void> => {
         await executeRegister(credentials);
      },
      [executeRegister],
   );

   // Reset function
   const reset = useCallback(() => {
      resetRegister();
   }, [resetRegister]);

   // Helper methods for error checking
   const isEmailAlreadyExists = useCallback(() => {
      return (
         registerError?.statusCode === 409 &&
         registerError?.code === REGISTER_ERROR_CODES.EMAIL_ALREADY_EXISTS
      );
   }, [registerError]);

   const isPhoneAlreadyExists = useCallback(() => {
      return (
         registerError?.statusCode === 409 &&
         registerError?.code === REGISTER_ERROR_CODES.PHONE_ALREADY_EXISTS
      );
   }, [registerError]);

   const isNetworkError = useCallback(() => {
      return registerError?.code === REGISTER_ERROR_CODES.NETWORK_ERROR;
   }, [registerError]);

   const isInvalidEmail = useCallback(() => {
      return (
         registerError?.statusCode === 400 &&
         registerError?.code === REGISTER_ERROR_CODES.INVALID_EMAIL
      );
   }, [registerError]);

   return {
      // States
      loading: registerLoading,
      error: registerError,

      // Methods
      register,

      // Utilities
      reset,

      // Helper methods
      isEmailAlreadyExists,
      isPhoneAlreadyExists,
      isNetworkError,
      isInvalidEmail,
   };
};
