export interface ResetPasswordRequest {
   token: string;
   newPassword: string;
   newPasswordConfirmation: string;
}
