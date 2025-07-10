// useCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useCache<T>(cacheKey: string, cacheExpiration: number) {
  const getCache = async (): Promise<T | null> => {
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      const {data, timestamp} = JSON.parse(cachedData);
      if (Date.now() - timestamp < cacheExpiration) {
        return data as T;
      }
    }
    return null;
  };

  const setCache = async (data: T): Promise<void> => {
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({data, timestamp: Date.now()}),
    );
  };

  const clearCache = async (): Promise<void> => {
    await AsyncStorage.removeItem(cacheKey);
  };

  return {getCache, setCache, clearCache};
}
