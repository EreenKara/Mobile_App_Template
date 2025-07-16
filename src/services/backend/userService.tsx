import { apiClient } from '@services/backend/apiClient';
import { UserProfile } from '@apptypes/index';

const ENDPOINTS = {
   ME: '/user/me',
   USER_ADDRESSES: '/user/addresses',
   CREATE_ADDRESS: '/user/addresses',
   UPDATE_ADDRESS: '/user/addresses',
   DELETE_ADDRESS: '/user/addresses',
   SET_DEFAULT_ADDRESS: '/user/addresses/default',
} as const;

// User Profile API
export const me = async (): Promise<UserProfile> => {
   const response = await apiClient.get<UserProfile>(ENDPOINTS.ME);
   return response.data;
};

// User Address APIs
export const getUserAddressesApi = async (): Promise<any[]> => {
   const response = await apiClient.get<any[]>(ENDPOINTS.USER_ADDRESSES);
   return response.data;
};

export const createAddressApi = async (addressData: any): Promise<any> => {
   const response = await apiClient.post<any>(ENDPOINTS.CREATE_ADDRESS, addressData);
   return response.data;
};

export const updateAddressApi = async (addressId: string, addressData: any): Promise<any> => {
   const response = await apiClient.put<any>(
      `${ENDPOINTS.UPDATE_ADDRESS}/${addressId}`,
      addressData,
   );
   return response.data;
};

export const deleteAddressApi = async (addressId: string): Promise<string> => {
   await apiClient.delete(`${ENDPOINTS.DELETE_ADDRESS}/${addressId}`);
   return addressId;
};

export const setDefaultAddressApi = async (addressId: string): Promise<any> => {
   const response = await apiClient.put<any>(`${ENDPOINTS.SET_DEFAULT_ADDRESS}/${addressId}`);
   return response.data;
};

const userService = {
   me,
   getUserAddressesApi,
   createAddressApi,
   updateAddressApi,
   deleteAddressApi,
   setDefaultAddressApi,
};

export default userService;
