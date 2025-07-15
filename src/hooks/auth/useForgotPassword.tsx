// hooks/useForgotPassword.ts
import { useCallback, useState } from 'react';
import { useAsync, AsyncError } from '@hooks/modular/useAsync';
import { apiClient } from '@services/backend/apiClient';
import { ResetPasswordResponse, ForgotPasswordResponse } from '@apptypes/index';
import authService from '@services/backend/authService';

// Error types for specific handling
export const FORGOT_PASSWORD_ERROR_CODES = {
   EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
   EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
   INVALID_EMAIL: 'INVALID_EMAIL',
   TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
   NETWORK_ERROR: 'NETWORK_ERROR',
   INVALID_TOKEN: 'INVALID_TOKEN',
   TOKEN_EXPIRED: 'TOKEN_EXPIRED',
   WEAK_PASSWORD: 'WEAK_PASSWORD',
} as const;

export interface UseForgotPasswordOptions {
   onEmailSentSuccess?: (response: ForgotPasswordResponse) => void;
   onEmailSentError?: (error: AsyncError) => void;
   onResetSuccess?: (response: ResetPasswordResponse) => void;
   onResetError?: (error: AsyncError) => void;
   onEmailNotFound?: (error: AsyncError) => void;
   onTooManyRequests?: (error: AsyncError) => void;
}

export interface UseForgotPasswordReturn {
   // States
   loading: boolean;
   error: AsyncError | null;

   // Separate success states for each operation
   isEmailSent: boolean;
   isPasswordReset: boolean;

   // Methods
   sendResetEmail: (email: string) => Promise<void>;
   resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;

   // Utilities
   reset: () => void;
   resetEmailSentState: () => void;
   resetPasswordResetState: () => void;

   // Helper methods for error checking
   isEmailNotFound: () => boolean;
   isTooManyRequests: () => boolean;
   isInvalidToken: () => boolean;
   isTokenExpired: () => boolean;
   isWeakPassword: () => boolean;
   isNetworkError: () => boolean;
}

// Hook
export const useForgotPassword = (options?: UseForgotPasswordOptions): UseForgotPasswordReturn => {
   // Send reset email async handler
   const {
      execute: executeSendResetEmail,
      loading: emailLoading,
      error: emailError,
      success: emailSuccess,
      reset: resetEmailState,
   } = useAsync(authService.sendResetEmailApi, {
      onSuccess: (result: ForgotPasswordResponse) => {
         options?.onEmailSentSuccess?.(result);
      },
      onError: (error: AsyncError) => {
         // Specific error handling
         if (
            error.statusCode === 404 ||
            error.code === FORGOT_PASSWORD_ERROR_CODES.EMAIL_NOT_FOUND
         ) {
            options?.onEmailNotFound?.(error);
         } else if (
            error.statusCode === 429 ||
            error.code === FORGOT_PASSWORD_ERROR_CODES.TOO_MANY_REQUESTS
         ) {
            options?.onTooManyRequests?.(error);
         }

         options?.onEmailSentError?.(error);
      },
      showNotificationOnError: false, // Error'ları form'da göstereceğiz
      showNotificationOnSuccess: true,
      successMessage: 'Şifre sıfırlama linki email adresinize gönderildi.',
   });

   // Reset password async handler
   const {
      execute: executeResetPassword,
      loading: resetLoading,
      error: resetError,
      success: resetSuccess,
      reset: resetPasswordState,
   } = useAsync(authService.resetPasswordApi, {
      onSuccess: (result: ResetPasswordResponse) => {
         options?.onResetSuccess?.(result);
      },
      onError: (error: AsyncError) => {
         options?.onResetError?.(error);
      },
      showNotificationOnError: false,
      showNotificationOnSuccess: true,
      successMessage: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.',
   });

   // Send reset email function
   const sendResetEmail = useCallback(
      async (email: string): Promise<void> => {
         if (!email) {
            throw new Error('Email adresi gereklidir.');
         }

         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
            throw new Error('Geçerli bir email adresi girin.');
         }

         await executeSendResetEmail({ email });
      },
      [executeSendResetEmail],
   );

   // Reset password function
   const resetPassword = useCallback(
      async (token: string, newPassword: string, confirmPassword: string): Promise<void> => {
         if (!token) {
            throw new Error("Geçersiz sıfırlama token'ı.");
         }

         if (!newPassword) {
            throw new Error('Yeni şifre gereklidir.');
         }

         if (newPassword !== confirmPassword) {
            throw new Error('Şifreler eşleşmiyor.');
         }

         if (newPassword.length < 8) {
            throw new Error('Şifre en az 8 karakter olmalıdır.');
         }

         await executeResetPassword({
            token,
            newPassword,
            newPasswordConfirmation: confirmPassword,
         });
      },
      [executeResetPassword],
   );

   // Reset all states
   const reset = useCallback(() => {
      resetEmailState();
      resetPasswordState();
   }, [resetEmailState, resetPasswordState]);

   // Reset only email sent state
   const resetEmailSentState = useCallback(() => {
      resetEmailState();
   }, [resetEmailState]);

   // Reset only password reset state
   const resetPasswordResetState = useCallback(() => {
      resetPasswordState();
   }, [resetPasswordState]);

   // Helper methods for error checking
   const isEmailNotFound = useCallback(() => {
      return (
         emailError?.statusCode === 404 ||
         emailError?.code === FORGOT_PASSWORD_ERROR_CODES.EMAIL_NOT_FOUND
      );
   }, [emailError]);

   const isTooManyRequests = useCallback(() => {
      return (
         emailError?.statusCode === 429 ||
         emailError?.code === FORGOT_PASSWORD_ERROR_CODES.TOO_MANY_REQUESTS
      );
   }, [emailError]);

   const isInvalidToken = useCallback(() => {
      return (
         resetError?.statusCode === 400 ||
         resetError?.code === FORGOT_PASSWORD_ERROR_CODES.INVALID_TOKEN
      );
   }, [resetError]);

   const isTokenExpired = useCallback(() => {
      return (
         resetError?.statusCode === 410 ||
         resetError?.code === FORGOT_PASSWORD_ERROR_CODES.TOKEN_EXPIRED
      );
   }, [resetError]);

   const isWeakPassword = useCallback(() => {
      return (
         resetError?.statusCode === 400 ||
         resetError?.code === FORGOT_PASSWORD_ERROR_CODES.WEAK_PASSWORD
      );
   }, [resetError]);

   const isNetworkError = useCallback(() => {
      return (
         emailError?.code === FORGOT_PASSWORD_ERROR_CODES.NETWORK_ERROR ||
         resetError?.code === FORGOT_PASSWORD_ERROR_CODES.NETWORK_ERROR
      );
   }, [emailError, resetError]);

   return {
      // States
      loading: emailLoading || resetLoading,
      error: emailError || resetError,

      // Separate success states - bu sayede hangi işlemin başarılı olduğunu anlayabilirsin
      isEmailSent: emailSuccess,
      isPasswordReset: resetSuccess,

      // Methods
      sendResetEmail,
      resetPassword,

      // Utilities
      reset,
      resetEmailSentState,
      resetPasswordResetState,

      // Helper methods
      isEmailNotFound,
      isTooManyRequests,
      isInvalidToken,
      isTokenExpired,
      isWeakPassword,
      isNetworkError,
   };
};
