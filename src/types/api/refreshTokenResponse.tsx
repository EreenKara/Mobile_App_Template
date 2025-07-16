import User from '@apptypes/entities/userProfile';

export interface RefreshTokenResponse {
   access_token: string;
   refresh_token: string;
   user: User;
   expires_in: number;
}
