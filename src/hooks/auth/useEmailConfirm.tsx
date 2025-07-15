// hooks/useEmailConfirm.ts
import { useCallback, useState } from 'react';
import { useAsync, AsyncError } from '@hooks/modular/useAsync';
import authService from '@services/backend/authService';
import {
   EmailConfirmResponse,
   EmailConfirm,
   ResendCodeResponse,
   ResendCode,
} from '@apptypes/index';

// Error types for specific handling
export const EMAIL_CONFIRM_ERROR_CODES = {
   INVALID_CODE: 'INVALID_CODE',
   CODE_EXPIRED: 'CODE_EXPIRED',
   EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
   EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
   TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
   TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
   NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export interface UseEmailConfirmOptions {
   onConfirmSuccess?: (response: EmailConfirmResponse) => void;
   onConfirmError?: (error: AsyncError) => void;
   onResendSuccess?: (response: ResendCodeResponse) => void;
   onResendError?: (error: AsyncError) => void;
   onInvalidCode?: (error: AsyncError) => void;
   onCodeExpired?: (error: AsyncError) => void;
   onTooManyAttempts?: (error: AsyncError) => void;
   onEmailAlreadyVerified?: (error: AsyncError) => void;
}

export interface UseEmailConfirmReturn {
   // States
   loading: boolean;
   error: AsyncError | null;
   isEmailConfirmed: boolean;
   isCodeResent: boolean;

   // Methods
   confirmEmail: (emailOrIdentity: string, verificationCode: string) => Promise<void>;
   resendCode: (emailOrIdentity: string) => Promise<void>;

   // Utilities
   reset: () => void;
   resetConfirmState: () => void;
   resetResendState: () => void;

   // Helper methods for error checking
   isInvalidCode: () => boolean;
   isCodeExpired: () => boolean;
   isTooManyAttempts: () => boolean;
   isTooManyRequests: () => boolean;
   isEmailAlreadyVerified: () => boolean;
   isEmailNotFound: () => boolean;
   isNetworkError: () => boolean;
}

// Hook
export const useEmailConfirm = (options?: UseEmailConfirmOptions): UseEmailConfirmReturn => {
   // Email confirm async handler
   const {
      execute: executeConfirmEmail,
      loading: confirmLoading,
      error: confirmError,
      success: confirmSuccess,
      reset: resetConfirmState,
   } = useAsync(authService.confirmEmailApi, {
      onSuccess: (result: EmailConfirmResponse) => {
         options?.onConfirmSuccess?.(result);
      },
      onError: (error: AsyncError) => {
         // Specific error handling
         if (error.statusCode === 400) {
            if (error.code === EMAIL_CONFIRM_ERROR_CODES.INVALID_CODE) {
               options?.onInvalidCode?.(error);
            } else if (error.code === EMAIL_CONFIRM_ERROR_CODES.CODE_EXPIRED) {
               options?.onCodeExpired?.(error);
            }
         } else if (
            error.statusCode === 409 &&
            error.code === EMAIL_CONFIRM_ERROR_CODES.EMAIL_ALREADY_VERIFIED
         ) {
            options?.onEmailAlreadyVerified?.(error);
         } else if (error.statusCode === 429) {
            if (error.code === EMAIL_CONFIRM_ERROR_CODES.TOO_MANY_ATTEMPTS) {
               options?.onTooManyAttempts?.(error);
            }
         }

         options?.onConfirmError?.(error);
      },
      showNotificationOnError: false, // Error'ları form'da göstereceğiz
      showNotificationOnSuccess: true,
      successMessage: 'Email adresiniz başarıyla doğrulandı!',
   });

   // Resend code async handler
   const {
      execute: executeResendCode,
      loading: resendLoading,
      error: resendError,
      success: resendSuccess,
      reset: resetResendCodeState,
   } = useAsync(authService.resendEmailCodeApi, {
      onSuccess: (result: ResendCodeResponse) => {
         options?.onResendSuccess?.(result);
      },
      onError: (error: AsyncError) => {
         // Specific error handling for resend
         if (error.statusCode === 429) {
            // Too many resend requests
         } else if (error.statusCode === 404) {
            // Email not found
         }

         options?.onResendError?.(error);
      },
      showNotificationOnError: false,
      showNotificationOnSuccess: true,
      successMessage: 'Doğrulama kodu tekrar gönderildi.',
   });

   // Confirm email function
   const confirmEmail = useCallback(
      async (emailOrIdentity: string, verificationCode: string): Promise<void> => {
         // Client-side validation
         if (!emailOrIdentity) {
            throw new Error('Email adresi gereklidir.');
         }

         if (!verificationCode) {
            throw new Error('Doğrulama kodu gereklidir.');
         }

         if (verificationCode.length !== 6) {
            throw new Error('Doğrulama kodu 6 haneli olmalıdır.');
         }

         if (!verificationCode.match(/^[0-9]+$/)) {
            throw new Error('Doğrulama kodu sadece rakam içermelidir.');
         }

         await executeConfirmEmail({
            emailOrIdentity,
            verificationCode,
         });
      },
      [executeConfirmEmail],
   );

   // Resend code function
   const resendCode = useCallback(
      async (emailOrIdentity: string): Promise<void> => {
         if (!emailOrIdentity) {
            throw new Error('Email adresi gereklidir.');
         }

         await executeResendCode({
            emailOrIdentity,
         });
      },
      [executeResendCode],
   );

   // Reset all states
   const reset = useCallback(() => {
      resetConfirmState();
      resetResendCodeState();
   }, [resetConfirmState, resetResendCodeState]);

   // Helper methods for error checking
   const isInvalidCode = useCallback(() => {
      return (
         confirmError?.statusCode === 400 &&
         confirmError?.code === EMAIL_CONFIRM_ERROR_CODES.INVALID_CODE
      );
   }, [confirmError]);

   const isCodeExpired = useCallback(() => {
      return (
         confirmError?.statusCode === 400 &&
         confirmError?.code === EMAIL_CONFIRM_ERROR_CODES.CODE_EXPIRED
      );
   }, [confirmError]);

   const isTooManyAttempts = useCallback(() => {
      return (
         confirmError?.statusCode === 429 &&
         confirmError?.code === EMAIL_CONFIRM_ERROR_CODES.TOO_MANY_ATTEMPTS
      );
   }, [confirmError]);

   const isTooManyRequests = useCallback(() => {
      return (
         (confirmError?.statusCode === 429 || resendError?.statusCode === 429) &&
         (confirmError?.code === EMAIL_CONFIRM_ERROR_CODES.TOO_MANY_REQUESTS ||
            resendError?.code === EMAIL_CONFIRM_ERROR_CODES.TOO_MANY_REQUESTS)
      );
   }, [confirmError, resendError]);

   const isEmailAlreadyVerified = useCallback(() => {
      return (
         confirmError?.statusCode === 409 &&
         confirmError?.code === EMAIL_CONFIRM_ERROR_CODES.EMAIL_ALREADY_VERIFIED
      );
   }, [confirmError]);

   const isEmailNotFound = useCallback(() => {
      return (
         (confirmError?.statusCode === 404 || resendError?.statusCode === 404) &&
         (confirmError?.code === EMAIL_CONFIRM_ERROR_CODES.EMAIL_NOT_FOUND ||
            resendError?.code === EMAIL_CONFIRM_ERROR_CODES.EMAIL_NOT_FOUND)
      );
   }, [confirmError, resendError]);

   const isNetworkError = useCallback(() => {
      return (
         confirmError?.code === EMAIL_CONFIRM_ERROR_CODES.NETWORK_ERROR ||
         resendError?.code === EMAIL_CONFIRM_ERROR_CODES.NETWORK_ERROR
      );
   }, [confirmError, resendError]);

   return {
      // States
      loading: confirmLoading || resendLoading,
      error: confirmError || resendError,
      isEmailConfirmed: confirmSuccess,
      isCodeResent: resendSuccess,

      // Methods
      confirmEmail,
      resendCode,

      // Utilities
      reset,
      resetConfirmState,
      resetResendState: resetResendCodeState,

      // Helper methods
      isInvalidCode,
      isCodeExpired,
      isTooManyAttempts,
      isTooManyRequests,
      isEmailAlreadyVerified,
      isEmailNotFound,
      isNetworkError,
   };
};
