import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAsync } from '@hooks/modular/useAsync';
import { useCityDistrict } from './useCityDistrict';
import { RootState } from '@contexts/store';
import addressService from '@services/backend/addressService';
import type { CreateAddressData, UpdateAddressData } from '@services/backend/addressService';
import { UserAddress } from '@apptypes/index';
// ==================== MAIN HOOK ====================

export function useUserAddress() {
   const dispatch = useDispatch();

   // Redux state
   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

   // Local state
   const [addresses, setAddresses] = useState<UserAddress[]>([]);
   const [defaultAddress, setDefaultAddress] = useState<UserAddress | null>(null);

   // City/District hook
   const {
      cities,
      districts,
      selectedCity,
      selectedDistrict,
      selectCity,
      selectDistrict,
      findCityById,
      findDistrictById,
      getCities,
      getDistricts,
   } = useCityDistrict({
      autoFetchCities: true,
      autoFetchDistrictsOnCityChange: true,
   });

   // ==================== API CALLS ====================

   // Kullanıcının adreslerini getir
   const {
      execute: fetchAddresses,
      loading: addressesLoading,
      error: addressesError,
   } = useAsync(addressService.getUserAddressesApi, {
      onSuccess: result => {
         setAddresses(result);
         // Varsayılan adresi bul
         const defaultAddr = result.find(addr => addr.isDefault);
         setDefaultAddress(defaultAddr || null);
      },
      onError: error => {
         console.error('Addresses fetch error:', error);
      },
      showNotificationOnError: true,
   });

   // Yeni adres oluştur
   const {
      execute: createAddress,
      loading: createLoading,
      error: createError,
   } = useAsync(addressService.createAddressApi, {
      onSuccess: result => {
         setAddresses(prev => [...prev, result]);
         if (result.isDefault) {
            setDefaultAddress(result);
         }
      },
      onError: error => {
         console.error('Address creation error:', error);
      },
      showNotificationOnError: true,
   });

   // Adres güncelle
   const {
      execute: updateAddress,
      loading: updateLoading,
      error: updateError,
   } = useAsync(
      async (addressData: UpdateAddressData) => {
         return await addressService.updateAddressApi(addressData.id, addressData);
      },
      {
         onSuccess: result => {
            setAddresses(prev => prev.map(addr => (addr.id === result.id ? result : addr)));
            if (result.isDefault) {
               setDefaultAddress(result);
            }
         },
         onError: error => {
            console.error('Address update error:', error);
         },
         showNotificationOnError: true,
      },
   );

   // Adres sil
   const {
      execute: deleteAddress,
      loading: deleteLoading,
      error: deleteError,
   } = useAsync(addressService.deleteAddressApi, {
      onSuccess: addressId => {
         setAddresses(prev => prev.filter(addr => addr.id !== addressId));
         // Eğer silinen adres varsayılan adres ise, varsayılan adresi temizle
         if (defaultAddress?.id === addressId) {
            setDefaultAddress(null);
         }
      },
      onError: error => {
         console.error('Address deletion error:', error);
      },
      showNotificationOnError: true,
   });

   // Varsayılan adres belirle
   const {
      execute: setDefaultAddressApi,
      loading: setDefaultLoading,
      error: setDefaultError,
   } = useAsync(addressService.setDefaultAddressApi, {
      onSuccess: result => {
         setAddresses(prev =>
            prev.map(addr => ({
               ...addr,
               isDefault: addr.id === result.id,
            })),
         );
         setDefaultAddress(result);
      },
      onError: error => {
         console.error('Set default address error:', error);
      },
      showNotificationOnError: true,
   });

   // ==================== HELPER FUNCTIONS ====================

   // Adres tipine göre filtrele
   const getAddressesByType = useCallback(
      (type: 'home' | 'work' | 'other') => {
         return addresses.filter(addr => addr.type === type);
      },
      [addresses],
   );

   // Şehir adına göre adresleri filtrele
   const getAddressesByCity = useCallback(
      (cityName: string) => {
         return addresses.filter(addr =>
            addr.cityName.toLowerCase().includes(cityName.toLowerCase()),
         );
      },
      [addresses],
   );

   // Adres ID'sine göre adres bul
   const findAddressById = useCallback(
      (addressId: string) => {
         return addresses.find(addr => addr.id === addressId);
      },
      [addresses],
   );

   // Adres validasyonu - service'den kullan
   const validateAddress = useCallback((addressData: CreateAddressData) => {
      return addressService.validateAddressApi(addressData);
   }, []);

   // Adres formatla - service'den kullan
   const formatAddress = useCallback((address: UserAddress) => {
      return addressService.formatAddressApi(address);
   }, []);

   // Adres tipi label - service'den kullan
   const getAddressTypeLabel = useCallback((type: string) => {
      return addressService.getAddressTypeLabelApi(type);
   }, []);

   // Kısa adres formatı - service'den kullan
   const formatShortAddress = useCallback((address: UserAddress) => {
      return addressService.formatShortAddressApi(address);
   }, []);

   // Şehir/ilçe bilgilerini senkronize et
   const syncCityDistrict = useCallback(
      async (cityId: string, districtId?: string) => {
         const city = findCityById(cityId);
         if (city) {
            selectCity(city);

            if (districtId) {
               // İlçeleri getir ve seç
               await getDistricts(cityId);
               const district = findDistrictById(districtId);
               if (district) {
                  selectDistrict(district);
               }
            }
         }
      },
      [findCityById, findDistrictById, selectCity, selectDistrict, getDistricts],
   );

   // ==================== EFFECTS ====================

   // Kullanıcı girişi yaptığında adresleri getir
   useEffect(() => {
      if (isAuthenticated && user) {
         fetchAddresses();
      }
   }, [isAuthenticated, user, fetchAddresses]);

   // ==================== RETURN ====================

   return {
      // Data
      addresses,
      defaultAddress,

      // City/District data
      cities,
      districts,
      selectedCity,
      selectedDistrict,

      // Loading states
      loading: addressesLoading,
      createLoading,
      updateLoading,
      deleteLoading,
      setDefaultLoading,

      // Error states
      error: addressesError,
      createError,
      updateError,
      deleteError,
      setDefaultError,

      // Actions
      fetchAddresses,
      createAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress: setDefaultAddressApi,

      // City/District actions
      selectCity,
      selectDistrict,
      getCities,
      getDistricts,
      syncCityDistrict,

      // Helper functions
      getAddressesByType,
      getAddressesByCity,
      findAddressById,
      validateAddress,
      formatAddress,
      getAddressTypeLabel,
      formatShortAddress,

      // Computed values
      hasAddresses: addresses.length > 0,
      hasDefaultAddress: !!defaultAddress,
      homeAddresses: getAddressesByType('home'),
      workAddresses: getAddressesByType('work'),
      otherAddresses: getAddressesByType('other'),
   };
}

// Export types for convenience
export type { UserAddress, CreateAddressData, UpdateAddressData };
