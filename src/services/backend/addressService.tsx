import { apiClient } from '@services/backend/apiClient';
import { UserAddress } from '@apptypes/index';

export interface CreateAddressData {
   type: 'home' | 'work' | 'other';
   title: string;
   cityId: string;
   districtId: string;
   fullAddress: string;
   buildingNo?: string;
   apartmentNo?: string;
   floor?: string;
   postalCode?: string;
   isDefault?: boolean;
}

export interface UpdateAddressData extends CreateAddressData {
   id: string;
}

// API Endpoints
const ENDPOINTS = {
   GET_USER_ADDRESSES: '/user/addresses',
   CREATE_ADDRESS: '/user/addresses',
   UPDATE_ADDRESS: '/user/addresses',
   DELETE_ADDRESS: '/user/addresses',
   SET_DEFAULT_ADDRESS: '/user/addresses/default',
} as const;

// ==================== ADDRESS SERVICE CLASS ====================

const getUserAddressesApi = async (): Promise<UserAddress[]> => {
   try {
      const response = await apiClient.get<UserAddress[]>(ENDPOINTS.GET_USER_ADDRESSES);
      return response.data;
   } catch (error) {
      console.error('Get user addresses error:', error);
      throw error;
   }
};

/**
 * Yeni adres oluştur
 */
const createAddressApi = async (addressData: CreateAddressData): Promise<UserAddress> => {
   try {
      const response = await apiClient.post<UserAddress>(ENDPOINTS.CREATE_ADDRESS, addressData);
      return response.data;
   } catch (error) {
      console.error('Create address error:', error);
      throw error;
   }
};

/**
 * Adres güncelle
 */
const updateAddressApi = async (
   addressId: string,
   addressData: CreateAddressData,
): Promise<UserAddress> => {
   try {
      const response = await apiClient.put<UserAddress>(
         `${ENDPOINTS.UPDATE_ADDRESS}/${addressId}`,
         addressData,
      );
      return response.data;
   } catch (error) {
      console.error('Update address error:', error);
      throw error;
   }
};

/**
 * Adres sil
 */
const deleteAddressApi = async (addressId: string): Promise<string> => {
   try {
      await apiClient.delete(`${ENDPOINTS.DELETE_ADDRESS}/${addressId}`);
      return addressId;
   } catch (error) {
      console.error('Delete address error:', error);
      throw error;
   }
};

/**
 * Varsayılan adres belirle
 */
const setDefaultAddressApi = async (addressId: string): Promise<UserAddress> => {
   try {
      const response = await apiClient.put<UserAddress>(
         `${ENDPOINTS.SET_DEFAULT_ADDRESS}/${addressId}`,
      );
      return response.data;
   } catch (error) {
      console.error('Set default address error:', error);
      throw error;
   }
};

/**
 * Adres ID'sine göre adres getir
 */
const getAddressByIdApi = async (addressId: string): Promise<UserAddress> => {
   try {
      const response = await apiClient.get<UserAddress>(
         `${ENDPOINTS.GET_USER_ADDRESSES}/${addressId}`,
      );
      return response.data;
   } catch (error) {
      console.error('Get address by ID error:', error);
      throw error;
   }
};

/**
 * Adres tipine göre adresleri getir
 */
const getAddressesByTypeApi = async (type: 'home' | 'work' | 'other'): Promise<UserAddress[]> => {
   try {
      const response = await apiClient.get<UserAddress[]>(
         `${ENDPOINTS.GET_USER_ADDRESSES}?type=${type}`,
      );
      return response.data;
   } catch (error) {
      console.error('Get addresses by type error:', error);
      throw error;
   }
};

/**
 * Varsayılan adresi getir
 */
const getDefaultAddressApi = async (): Promise<UserAddress | null> => {
   try {
      const response = await apiClient.get<UserAddress>(`${ENDPOINTS.GET_USER_ADDRESSES}/default`);
      return response.data;
   } catch (error) {
      console.error('Get default address error:', error);
      // Varsayılan adres bulunamadığında null döndür
      return null;
   }
};

/**
 * Adres validasyonu
 */
const validateAddressApi = (
   addressData: CreateAddressData,
): { isValid: boolean; errors: string[] } => {
   const errors: string[] = [];

   if (!addressData.title.trim()) {
      errors.push('Adres başlığı gereklidir');
   }

   if (!addressData.cityId) {
      errors.push('Şehir seçimi gereklidir');
   }

   if (!addressData.districtId) {
      errors.push('İlçe seçimi gereklidir');
   }

   if (!addressData.fullAddress.trim()) {
      errors.push('Detaylı adres gereklidir');
   }

   if (addressData.fullAddress.length < 10) {
      errors.push('Detaylı adres en az 10 karakter olmalıdır');
   }

   if (!['home', 'work', 'other'].includes(addressData.type)) {
      errors.push('Geçerli bir adres tipi seçin');
   }

   return {
      isValid: errors.length === 0,
      errors,
   };
};

/**
 * Adres formatla (görüntüleme için)
 */
const formatAddressApi = (address: UserAddress): string => {
   const parts = [
      address.fullAddress,
      address.buildingNo && `Bina No: ${address.buildingNo}`,
      address.apartmentNo && `Daire: ${address.apartmentNo}`,
      address.floor && `Kat: ${address.floor}`,
      address.districtName,
      address.cityName,
      address.postalCode && `Posta Kodu: ${address.postalCode}`,
   ].filter(Boolean);

   return parts.join(', ');
};

/**
 * Adres tipine göre label getir
 */
const getAddressTypeLabelApi = (type: string): string => {
   switch (type) {
      case 'home':
         return 'Ev';
      case 'work':
         return 'İş';
      case 'other':
         return 'Diğer';
      default:
         return 'Bilinmeyen';
   }
};

/**
 * Kısa adres formatı
 */
const formatShortAddressApi = (address: UserAddress): string => {
   return `${address.districtName}, ${address.cityName}`;
};

const addressService = {
   getUserAddressesApi,
   createAddressApi,
   updateAddressApi,
   deleteAddressApi,
   setDefaultAddressApi,
   getAddressByIdApi,
   getAddressesByTypeApi,
   getDefaultAddressApi,
   validateAddressApi,
   formatAddressApi,
   getAddressTypeLabelApi,
   formatShortAddressApi,
};
export default addressService;
