// useCityDistrict.ts
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from '@hooks/modular/useAsync';
import { getCache, setCache, clearCache } from '@hooks/modular/useCache';
import { RootState } from '@contexts/store';
import {
   setCities,
   setDistricts,
   setSelectedCity,
   setSelectedDistrict,
   clearDistricts,
} from '@contexts/slices/locationSlice/locationSlice';
import City from '@apptypes/entities/city';
import District from '@apptypes/entities/district';
import { fetchCitiesApi, fetchDistrictsApi } from '@services/backend/locationService';

// Cache keys ve expiration süreleri
const CACHE_KEYS = {
   CITIES: 'cities_cache',
   DISTRICTS: 'districts_cache',
} as const;

const CACHE_EXPIRATION = {
   CITIES: 24 * 60 * 60 * 1000, // 24 saat
   DISTRICTS: 24 * 60 * 60 * 1000, // 24 saat
} as const;

interface UseCityDistrictOptions {
   autoFetchCities?: boolean;
   autoFetchDistrictsOnCityChange?: boolean;
   enableCache?: boolean;
   onCityChange?: (city: City | null) => void;
   onDistrictChange?: (district: District | null) => void;
}

export function useCityDistrict(options: UseCityDistrictOptions = {}) {
   const {
      autoFetchCities = true,
      autoFetchDistrictsOnCityChange = true,
      enableCache = true,
      onCityChange,
      onDistrictChange,
   } = options;

   const dispatch = useDispatch();

   // Redux state'lerini al
   const {
      cities,
      districts,
      selectedCity,
      selectedDistrict,
      loading: reduxLoading,
   } = useSelector((state: RootState) => state.location);

   // Async hook'ları initialize et
   const {
      execute: executeFetchCities,
      loading: citiesLoading,
      error: citiesError,
      data: citiesData,
      retry: retryCities,
   } = useAsync(fetchCitiesApi, {
      onSuccess: async (result: City[]) => {
         dispatch(setCities(result));
         if (enableCache) {
            await setCache(CACHE_KEYS.CITIES, result);
         }
      },
      onError: error => console.error('Cities fetch error:', error),
      showNotificationOnError: true,
   });

   const {
      execute: executeFetchDistricts,
      loading: districtsLoading,
      error: districtsError,
      data: districtsData,
      retry: retryDistricts,
   } = useAsync(fetchDistrictsApi, {
      onSuccess: async (result: District[]) => {
         dispatch(setDistricts(result));
         if (enableCache) {
            await setCache(CACHE_KEYS.DISTRICTS, result);
         }
      },
      onError: error => console.error('Districts fetch error:', error),
      showNotificationOnError: true,
   });

   // Şehirleri getir
   const getCities = useCallback(
      async (forceRefresh = false) => {
         // Eğer force refresh değilse ve Redux'ta şehirler varsa, onları döndür
         if (!forceRefresh && cities.length > 0) {
            return cities;
         }

         // Cache'den kontrol et
         if (enableCache && !forceRefresh) {
            const cachedCities = await getCache(CACHE_KEYS.CITIES, CACHE_EXPIRATION.CITIES);
            if (cachedCities) {
               dispatch(setCities(cachedCities));
               return cachedCities;
            }
         }

         // API'den getir
         return await executeFetchCities();
      },
      [cities, enableCache, dispatch, executeFetchCities],
   );

   // İlçeleri getir
   const getDistricts = useCallback(
      async (cityId: string, forceRefresh = false) => {
         if (!cityId) return [];

         // Eğer force refresh değilse ve mevcut şehir aynıysa ve Redux'ta ilçeler varsa
         if (!forceRefresh && districts.length > 0 && selectedCity?.id === cityId) {
            return districts;
         }

         // Cache'den kontrol et
         if (enableCache && !forceRefresh) {
            const cachedDistricts = await getCache(
               CACHE_KEYS.DISTRICTS,
               CACHE_EXPIRATION.DISTRICTS,
            );
            if (cachedDistricts) {
               // Cache'den gelen tüm ilçeler içinden seçili şehre ait olanları filtrele
               const filteredDistricts = cachedDistricts.filter(
                  (d: District) => d.cityId === cityId,
               );
               if (filteredDistricts.length > 0) {
                  dispatch(setDistricts(filteredDistricts));
                  return filteredDistricts;
               }
            }
         }

         // API'den getir
         return await executeFetchDistricts(cityId);
      },
      [districts, selectedCity, enableCache, dispatch, executeFetchDistricts],
   );

   // Şehir seç
   const selectCity = useCallback(
      (city: City | null) => {
         dispatch(setSelectedCity(city));
         dispatch(clearDistricts());
         dispatch(setSelectedDistrict(null));

         onCityChange?.(city);

         if (city && autoFetchDistrictsOnCityChange) {
            getDistricts(city.id);
         }
      },
      [dispatch, onCityChange, autoFetchDistrictsOnCityChange, getDistricts],
   );

   // İlçe seç
   const selectDistrict = useCallback(
      (district: District | null) => {
         dispatch(setSelectedDistrict(district));
         onDistrictChange?.(district);
      },
      [dispatch, onDistrictChange],
   );

   // Cache temizleme fonksiyonları
   const clearCitiesCache = useCallback(async () => {
      await clearCache(CACHE_KEYS.CITIES);
   }, []);

   const clearDistrictsCache = useCallback(async () => {
      await clearCache(CACHE_KEYS.DISTRICTS);
   }, []);

   const clearAllCache = useCallback(async () => {
      await Promise.all([clearCache(CACHE_KEYS.CITIES), clearCache(CACHE_KEYS.DISTRICTS)]);
   }, []);

   // Şehir ID'sine göre şehir bul
   const findCityById = useCallback(
      (cityId: string): City | undefined => {
         return cities.find(city => city.id === cityId);
      },
      [cities],
   );

   // İlçe ID'sine göre ilçe bul
   const findDistrictById = useCallback(
      (districtId: string): District | undefined => {
         return districts.find(district => district.id === districtId);
      },
      [districts],
   );

   // Şehir adına göre şehir bul
   const findCityByName = useCallback(
      (cityName: string): City | undefined => {
         return cities.find(city => city.name.toLowerCase().includes(cityName.toLowerCase()));
      },
      [cities],
   );

   // İlçe adına göre ilçe bul
   const findDistrictByName = useCallback(
      (districtName: string): District | undefined => {
         return districts.find(district =>
            district.name.toLowerCase().includes(districtName.toLowerCase()),
         );
      },
      [districts],
   );

   // Mevcut şehre ait ilçeleri getir
   const currentCityDistricts = useMemo(() => {
      if (!selectedCity) return [];
      return districts.filter(district => district.cityId === selectedCity.id);
   }, [selectedCity, districts]);

   // Yükleme durumları
   const loading = citiesLoading || districtsLoading || reduxLoading;

   // Hata durumları
   const error = citiesError || districtsError;

   // Component mount olduğunda otomatik şehirleri getir
   useEffect(() => {
      if (autoFetchCities && cities.length === 0) {
         getCities();
      }
   }, [autoFetchCities, cities.length, getCities]);

   // Debugging için cache durumunu kontrol et
   const checkCacheStatus = useCallback(async () => {
      const citiesCache = await getCache(CACHE_KEYS.CITIES, CACHE_EXPIRATION.CITIES);
      const districtsCache = await getCache(CACHE_KEYS.DISTRICTS, CACHE_EXPIRATION.DISTRICTS);

      return {
         hasCitiesCache: !!citiesCache,
         hasDistrictsCache: !!districtsCache,
         citiesCacheCount: citiesCache?.length || 0,
         districtsCacheCount: districtsCache?.length || 0,
      };
   }, []);

   return {
      // Data
      cities,
      districts,
      currentCityDistricts,
      selectedCity,
      selectedDistrict,

      // Loading states
      loading,
      citiesLoading,
      districtsLoading,

      // Error states
      error,
      citiesError,
      districtsError,

      // Actions
      getCities,
      getDistricts,
      selectCity,
      selectDistrict,

      // Retry functions
      retryCities,
      retryDistricts,

      // Search functions
      findCityById,
      findDistrictById,
      findCityByName,
      findDistrictByName,

      // Cache functions
      clearCitiesCache,
      clearDistrictsCache,
      clearAllCache,
      checkCacheStatus, // Debug için eklendi

      // Computed values
      hasCities: cities.length > 0,
      hasDistricts: districts.length > 0,
      hasSelectedCity: !!selectedCity,
      hasSelectedDistrict: !!selectedDistrict,
   };
}
