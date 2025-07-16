// services/apiClient.ts
import axios, {
   AxiosInstance,
   AxiosRequestConfig,
   AxiosResponse,
   AxiosError,
   InternalAxiosRequestConfig,
} from 'axios';
import { getCache, setCache, clearCache } from '@hooks/modular/useCache';
import { UserProfile } from '@apptypes/entities/userProfile'; // Import your User type
import { store } from '@contexts/store'; // Import your Redux store
import { loginAction } from '@contexts/slices/auth/authSlice';
import { RefreshTokenResponse } from '@apptypes/api/refreshTokenResponse'; // Import your RefreshTokenResponse type

// Constants
const API_BASE_URL = __DEV__
   ? 'http://localhost:3000/api' // Development
   : 'https://your-production-api.com/api'; // Production

const ENDPOINTS = {
   REFRESH_TOKEN: API_BASE_URL + '/auth/refresh',
};

// Configuration
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

const HEADERS = {
   X_DEVICE_TYPE: 'mobile', // or 'web' based on your app type
   X_APP_VERSION: '1.0.0', // Update this with your app version
};

// Storage keys
const STORAGE_KEYS = {
   ACCESS_TOKEN: 'access_token',
   REFRESH_TOKEN: 'refresh_token',
   USER_DATA: 'user_data',
} as const;

// Types
export interface ApiResponse<T = any> {
   data: T;
   message?: string;
   success: boolean;
   timestamp: string;
}

export interface ApiError {
   message: string;
   code?: string;
   details?: any;
   statusCode?: number;
}

interface funcType {
   accessToken: string;
   refreshToken: string;
   user: UserProfile;
}

// Token Management
class AuthManager {
   private static instance: AuthManager;
   private isRefreshing = false;
   private refreshSubscribers: ((funcType) => void)[] = [];

   static getInstance(): AuthManager {
      if (!AuthManager.instance) {
         AuthManager.instance = new AuthManager();
      }
      return AuthManager.instance;
   }
   async getAccessToken(): Promise<string | null> {
      const accessToken = await getCache(STORAGE_KEYS.ACCESS_TOKEN, EXPIRATION_TIME);
      return accessToken || null;
   }

   // Kullanıcı uygulamayı açtığında çalışacak.
   // Refresh token'ı alarak kullanıcının access token'ını güncelleyecek
   async loginFromCache(): Promise<any> {
      const result = await this.refreshAccessTokenFromCache();
      if (result === null) {
         // Eğer refresh token yoksa, kullanıcıyı login sayfasına yönlendirin
         console.log('No refresh token found or happen an error, redirecting to login...');
         return false;
      }
      store.dispatch(loginAction(result));
      return true;
   }

   async setLoginCreatiantialsToCache(
      accessToken: string,
      refreshToken: string,
      userData: UserProfile,
   ): Promise<void> {
      await Promise.all([
         setCache(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
         setCache(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
         setCache(STORAGE_KEYS.USER_DATA, userData),
      ]);
   }

   async clearLoginCreadiantialsFromCache(): Promise<void> {
      await Promise.all([
         clearCache(STORAGE_KEYS.ACCESS_TOKEN),
         clearCache(STORAGE_KEYS.REFRESH_TOKEN),
         clearCache(STORAGE_KEYS.USER_DATA),
      ]);
   }

   // Token refresh logic
   // Glboal state'deki refresh token'ı kullanarka access token;'ı güncelleyecke
   async refreshAccessTokenFromCache(): Promise<funcType | null> {
      const refreshToken = await getCache(STORAGE_KEYS.REFRESH_TOKEN, EXPIRATION_TIME);
      if (!refreshToken) return null;

      if (this.isRefreshing) {
         return new Promise(resolve => {
            this.refreshSubscribers.push(resolve);
         });
      }

      this.isRefreshing = true;

      try {
         const response = await axios.post<RefreshTokenResponse>(
            ENDPOINTS.REFRESH_TOKEN,
            { refresh_token: refreshToken },
            { timeout: REQUEST_TIMEOUT },
         );
         const { access_token, refresh_token: newRefreshToken, user } = response.data;
         // Notify waiting requests
         this.refreshSubscribers.forEach(callback => callback(access_token));
         this.refreshSubscribers = [];

         // set to cache
         this.setLoginCreatiantialsToCache(access_token, newRefreshToken, user);

         return { accessToken: access_token, refreshToken: newRefreshToken, user };
      } catch (error) {
         console.error('Token refresh failed:', error);
         await this.clearLoginCreadiantialsFromCache();
         return null;
      } finally {
         this.isRefreshing = false;
      }
   }
}

// Request/Response Interceptors
class ApiClient {
   private axiosInstance: AxiosInstance;
   private authManager: AuthManager;

   constructor() {
      this.authManager = AuthManager.getInstance();
      this.axiosInstance = this.createAxiosInstance();
      this.setupInterceptors();
   }

   private createAxiosInstance(): AxiosInstance {
      return axios.create({
         baseURL: API_BASE_URL,
         timeout: REQUEST_TIMEOUT,
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
         },
      });
   }

   private setupInterceptors(): void {
      // Request Interceptor
      this.axiosInstance.interceptors.request.use(
         async (config: InternalAxiosRequestConfig) => {
            // Add timestamp for cache busting

            // Add auth token
            const token = await this.authManager.getAccessToken();
            if (token) {
               config.headers.Authorization = `Bearer ${token}`;
            }

            // Add device info
            config.headers['X-Device-Type'] = HEADERS.X_DEVICE_TYPE || 'mobile';
            config.headers['X-App-Version'] = HEADERS.X_APP_VERSION || '1.0.0'; // Expo Constants'dan alabilirsiniz

            // Log request (sadece development'ta)
            if (__DEV__) {
               console.log('🚀 API Request:', {
                  method: config.method?.toUpperCase(),
                  url: config.url,
                  headers: config.headers,
                  data: config.data,
               });
            }

            return config;
         },
         (error: AxiosError) => {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
         },
      );

      // Response Interceptor
      this.axiosInstance.interceptors.response.use(
         (response: AxiosResponse) => {
            // Log response time

            if (__DEV__) {
               console.log('✅ API Response:', {
                  method: response.config.method?.toUpperCase(),
                  url: response.config.url,
                  status: response.status,
                  data: response.data,
               });
            }

            return response;
         },
         async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & {
               _retry?: boolean;
               _retryCount?: number;
            };

            if (__DEV__) {
               console.error('❌ API Error:', {
                  method: originalRequest?.method?.toUpperCase(),
                  url: originalRequest?.url,
                  status: error.response?.status,
                  message: error.message,
                  data: error.response?.data,
               });
            }

            // Handle 401 Unauthorized
            if (error.response?.status === 401 && !originalRequest._retry) {
               originalRequest._retry = true;

               const newToken = await this.authManager.refreshAccessTokenFromCache();
               if (newToken) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                  return this.axiosInstance(originalRequest);
               } else {
                  // Redirect to login
                  this.handleUnauthorized();
               }
            }

            // Retry logic for network errors
            if (this.shouldRetry(error) && (originalRequest._retryCount || 0) < MAX_RETRIES) {
               originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

               // Exponential backoff
               const delay = Math.pow(2, originalRequest._retryCount) * 1000;
               await new Promise(resolve => setTimeout(resolve, delay));

               return this.axiosInstance(originalRequest);
            }

            return Promise.reject(this.formatError(error));
         },
      );
   }

   private shouldRetry(error: AxiosError): boolean {
      return (
         !error.response ||
         error.response.status >= 500 ||
         error.code === 'NETWORK_ERROR' ||
         error.code === 'TIMEOUT'
      );
   }

   private formatError(error: AxiosError): ApiError {
      const apiError: ApiError = {
         message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
         statusCode: error.response?.status,
      };

      if (error.response?.data) {
         const data = error.response.data as any;
         apiError.message = data.message || data.error || apiError.message;
         apiError.code = data.code;
         apiError.details = data.details;
      } else if (error.request) {
         apiError.message = 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
      } else {
         apiError.message = error.message || apiError.message;
      }

      return apiError;
   }

   private handleUnauthorized(): void {
      // Bu fonksiyonu navigation service ile implement edebilirsiniz
      console.log('User unauthorized, redirecting to login...');
      // NavigationService.navigate('Login');
   }

   // HTTP Methods
   async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.axiosInstance.get<T>(url, config);
   }

   async post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
   ): Promise<AxiosResponse<T>> {
      return this.axiosInstance.post<T>(url, data, config);
   }

   async put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
   ): Promise<AxiosResponse<T>> {
      return this.axiosInstance.put<T>(url, data, config);
   }

   async patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
   ): Promise<AxiosResponse<T>> {
      return this.axiosInstance.patch<T>(url, data, config);
   }

   async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
      return this.axiosInstance.delete<T>(url, config);
   }

   // File Upload
   async uploadFile<T = any>(
      url: string,
      file: FormData,
      config?: AxiosRequestConfig,
   ): Promise<AxiosResponse<T>> {
      return this.axiosInstance.post<T>(url, file, {
         ...config,
         headers: {
            'Content-Type': 'multipart/form-data',
            ...config?.headers,
         },
      });
   }

   // Download File
   async downloadFile(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Blob>> {
      return this.axiosInstance.get(url, {
         ...config,
         responseType: 'blob',
      });
   }

   // Utility methods
   getBaseURL(): string {
      return API_BASE_URL;
   }

   async clearAuthData(): Promise<void> {
      await this.authManager.clearLoginCreadiantialsFromCache();
   }

   async setAuthCreadiantialsToCache(
      accessToken: string,
      refreshToken: string,
      userData: UserProfile,
   ): Promise<void> {
      await this.authManager.setLoginCreatiantialsToCache(accessToken, refreshToken, userData);
   }
   async loginFromCache(): Promise<boolean> {
      return await this.authManager.loginFromCache();
   }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
