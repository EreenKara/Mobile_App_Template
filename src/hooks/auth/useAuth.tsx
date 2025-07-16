// hooks/useAuth.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@contexts/store';
import { loginAction, logoutAction } from '@contexts/slices/auth/authSlice';
import { useAsync, AsyncError } from '@hooks/modular/useAsync';
import { apiClient } from '@services/backend/apiClient';
import type { UserProfile } from '@apptypes/entities/userProfile';
import { LoginCredentials } from '@apptypes/entities/loginCredentials';
import { LoginResponse } from '@apptypes/api/loginResponse';
import { LogoutResponse } from '@apptypes/api/logoutResponse';
import { loginApi, logoutApi } from '@services/backend/authService';

// Error types for specific handling
export const AUTH_ERROR_CODES = {
   EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
   INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
   ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
   NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export interface UseAuthOptions {
   onLoginSuccess?: (user: UserProfile) => void;
   onLoginError?: (error: AsyncError) => void;
   onLogoutSuccess?: () => void;
   onLogoutError?: (error: AsyncError) => void;
}

export interface UseAuthReturn {
   // States
   loading: boolean;
   error: AsyncError | null;
   isAuthenticated: boolean;
   user: UserProfile | null;

   // Methods
   login: (credentials: LoginCredentials) => Promise<void>;
   logout: () => Promise<void>;

   // Utilities
   reset: () => void;

   // Helper methods for error checking
   isEmailNotVerified: () => boolean;
   isInvalidCredentials: () => boolean;
   isNetworkError: () => boolean;
}

// Hook
export const useAuth = (options?: UseAuthOptions): UseAuthReturn => {
   const dispatch = useDispatch();
   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

   // Login async handler
   const {
      execute: executeLogin,
      loading: loginLoading,
      error: loginError,
      reset: resetLogin,
   } = useAsync(loginApi, {
      onSuccess: async (result: LoginResponse) => {
         // Set auth data to cache
         await apiClient.setAuthCreadiantialsToCache(
            result.access_token,
            result.refresh_token,
            result.user,
         );

         // Update Redux state
         dispatch(
            loginAction({
               accessToken: result.access_token,
               refreshToken: result.refresh_token,
               user: result.user,
            }),
         );

         // Call custom success callback
         options?.onLoginSuccess?.(result.user);
      },
      onError: (error: AsyncError) => {
         // Custom error handling
         options?.onLoginError?.(error);
      },
      showNotificationOnError: false, // Error'ları form'da göstereceğiz
      showNotificationOnSuccess: true,
      successMessage: 'Başarıyla giriş yaptınız!',
   });

   // Logout async handler
   const {
      execute: executeLogout,
      loading: logoutLoading,
      error: logoutError,
      reset: resetLogout,
   } = useAsync(logoutApi, {
      onSuccess: async () => {
         // Clear auth data from cache
         await apiClient.clearAuthData();

         // Update Redux state
         dispatch(logoutAction());

         // Call custom success callback
         options?.onLogoutSuccess?.();
      },
      onError: (error: AsyncError) => {
         // Even if logout fails, clear local data
         apiClient.clearAuthData();
         dispatch(logoutAction());

         // Call custom error callback
         options?.onLogoutError?.(error);
      },
      showNotificationOnError: true,
      showNotificationOnSuccess: true,
      successMessage: 'Başarıyla çıkış yaptınız!',
      errorMessage: 'Çıkış yapılırken bir hata oluştu.',
   });

   // Login function
   const login = useCallback(
      async (credentials: LoginCredentials): Promise<void> => {
         await executeLogin(credentials);
      },
      [executeLogin],
   );

   // Logout function
   const logout = useCallback(async (): Promise<void> => {
      await executeLogout();
   }, [executeLogout]);

   // Reset function - both login and logout errors
   const reset = useCallback(() => {
      resetLogin();
      resetLogout();
   }, [resetLogin, resetLogout]);

   // Helper methods for error checking
   const isEmailNotVerified = useCallback(() => {
      return (
         loginError?.statusCode === 403 || loginError?.code === AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED
      );
   }, [loginError]);

   const isInvalidCredentials = useCallback(() => {
      return (
         loginError?.statusCode === 401 || loginError?.code === AUTH_ERROR_CODES.INVALID_CREDENTIALS
      );
   }, [loginError]);

   const isNetworkError = useCallback(() => {
      return loginError?.code === AUTH_ERROR_CODES.NETWORK_ERROR;
   }, [loginError]);

   return {
      // States
      loading: loginLoading || logoutLoading,
      error: loginError || logoutError,
      isAuthenticated,
      user,

      // Methods
      login,
      logout,

      // Utilities
      reset,

      // Helper methods
      isEmailNotVerified,
      isInvalidCredentials,
      isNetworkError,
   };
};
