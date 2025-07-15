// useCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCache = async (
   cacheKey: string,
   cacheExpiration: number, // bu tür eksikti, ekledim
): Promise<any> => {
   const cachedData = await AsyncStorage.getItem(cacheKey);
   if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < cacheExpiration) {
         return data; // TypeScript'e "eminim" diyorsun
      }
   }
   return null;
};

export const setCache = async (cacheKey: string, data: any): Promise<void> => {
   await AsyncStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
};

export const clearCache = async (cacheKey: string): Promise<void> => {
   await AsyncStorage.removeItem(cacheKey);
};
