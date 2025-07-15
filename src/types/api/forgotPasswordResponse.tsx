export interface ForgotPasswordResponse {
   success: boolean;
   message: string;
   resetTokenSent?: boolean;
   expiresIn?: number; // Token expiration time in minutes
}
