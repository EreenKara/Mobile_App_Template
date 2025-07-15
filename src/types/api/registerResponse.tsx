export interface RegisterResponse {
   success: boolean;
   message: string;
   user?: User;
   requiresEmailVerification?: boolean;
   // Backend tam hazır olmadığı için optional fields
   access_token?: string;
   refresh_token?: string;
}
