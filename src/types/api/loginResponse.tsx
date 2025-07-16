import User from '@apptypes/entities/userProfile';

export interface LoginResponse {
   access_token: string;
   refresh_token: string;
   user: User;
   expires_in: number;
}
