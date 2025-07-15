import { apiClient } from '@services/backend/apiClient'; // API client'ınızı buraya import edin
import { User } from '@apptypes/index';

const ENDPOINTS = {
   ME: '/user/me',
} as const;

export const me = async (): Promise<User> => {
   const response = await apiClient.get<User>(ENDPOINTS.ME);
   return response.data;
};

const userService = {
   me: me,
};
export default userService;
