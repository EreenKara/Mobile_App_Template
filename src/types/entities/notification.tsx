import { User } from './userProfile';

export interface Notification {
   message: string;
   sender: User;
   time: string;
   description: string;
   type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'system';
   isRead: boolean;
}
