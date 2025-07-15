import User from '@apptypes/entities/user';

export interface LoginResponse {
   access_token: string;
   refresh_token: string;
   user: User;
   expires_in: number;
}
