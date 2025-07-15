import { User } from '../entities/user';

export interface EmailConfirmResponse {
   success: boolean;
   message: string;
   user?: User | null; // User entity if needed
   requiresLogin?: boolean;
}
