export interface ResendCodeResponse {
   success: boolean;
   message: string;
   expiresIn?: number; // Code expiration time in minutes
}
