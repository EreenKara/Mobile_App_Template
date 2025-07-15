import { apiClient } from '@services/backend/apiClient'; // API client'ınızı buraya import edin
import {
   User,
   LogoutResponse,
   LoginCredentials,
   LoginResponse,
   ForgotPasswordResponse,
   ForgotPasswordRequest,
   ResetPasswordRequest,
   ResetPasswordResponse,
   RegisterCredentials,
   RegisterResponse,
   EmailConfirm,
   EmailConfirmResponse,
   ResendCodeResponse,
   ResendCode,
} from '@apptypes/index';

const ENDPOINTS = {
   LOGIN: '/auth/login',
   REGISTER: '/auth/register',
   LOGOUT: '/auth/logout',
   SEND_RESET_EMAIL: '/auth/forgot-password',
   RESET_PASSWORD: '/auth/reset-password',
} as const;

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
   const response = await apiClient.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);
   return response.data;
};

export const logoutApi = async (): Promise<LogoutResponse> => {
   const response = await apiClient.post<LogoutResponse>(ENDPOINTS.LOGOUT);
   // Optionally clear auth data from cache or state management
   return response.data;
};
export const registerApi = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
   // Backend tam hazır olmadığı için esnek endpoint
   const response = await apiClient.post<RegisterResponse>(ENDPOINTS.REGISTER, {
      name: credentials.name,
      email: credentials.email,
      phone_number: credentials.phoneNumber, // Backend'in beklediği format
      password: credentials.password,
      terms_accepted: credentials.termsAccepted,
   });
   return response.data;
};

export const sendResetEmailApi = async (
   request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
   const response = await apiClient.post<ForgotPasswordResponse>(
      ENDPOINTS.SEND_RESET_EMAIL,
      request,
   );
   return response.data;
};

export const resetPasswordApi = async (
   request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
   const response = await apiClient.post<ResetPasswordResponse>(ENDPOINTS.RESET_PASSWORD, request);
   return response.data;
};

export const confirmEmailApi = async (request: EmailConfirm): Promise<EmailConfirmResponse> => {
   const response = await apiClient.post<EmailConfirmResponse>(ENDPOINTS.RESET_PASSWORD, request);
   return response.data;
};
export const resendEmailCodeApi = async (request: ResendCode): Promise<ResendCodeResponse> => {
   const response = await apiClient.post<ResendCodeResponse>(ENDPOINTS.RESET_PASSWORD, request);
   return response.data;
};

const authService = {
   loginApi: loginApi,
   registerApi: registerApi,
   logoutApi: logoutApi,
   sendResetEmailApi: sendResetEmailApi,
   resetPasswordApi: resetPasswordApi,
   confirmEmailApi: confirmEmailApi,
   resendEmailCodeApi: resendEmailCodeApi,
};

export default authService;
