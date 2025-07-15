// services/locationService.ts

import City from '@apptypes/entities/city'; // Entity tiplerinizi buraya import edin
import District from '@apptypes/entities/district'; // Entity tiplerinizi buraya import edin
import { apiClient } from '@services/backend/apiClient'; // API client'ınızı buraya import edin

// API endpoints
const ENDPOINTS = {
   FETCH_CITIES: '/api/cities',
   FETCH_DISTRICTS: '/api/districts',
   FETCH_CITIES_BY_ID: '/api/cities',
   FETCH_DISTRICTS_BY_ID: '/api/districts/detail',
   SEARCH_CITIES: '/api/cities/search',
   SEARCH_DISTRICTS: '/api/districts/search',
} as const;

/**
 * Tüm şehirleri getirir
 */
export const fetchCitiesApi = async (): Promise<City[]> => {
   try {
      const response = await apiClient.get<City[]>(ENDPOINTS.FETCH_CITIES);
      return response.data;
   } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
   }
};

/**
 * Belirli bir şehre ait ilçeleri getirir
 */
export const fetchDistrictsApi = async (cityId: string): Promise<District[]> => {
   try {
      const response = await apiClient.get<District[]>(`${ENDPOINTS.FETCH_DISTRICTS}/${cityId}`);
      return response.data;
   } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
   }
};

/**
 * Şehir ID'sine göre şehir detayını getirir
 */
export const fetchCityByIdApi = async (cityId: string): Promise<City> => {
   try {
      const response = await apiClient.get<City>(`${ENDPOINTS.FETCH_CITIES_BY_ID}/${cityId}`);
      return response.data;
   } catch (error) {
      console.error('Error fetching city by ID:', error);
      throw error;
   }
};

/**
 * İlçe ID'sine göre ilçe detayını getirir
 */
export const fetchDistrictByIdApi = async (districtId: string): Promise<District> => {
   try {
      const response = await apiClient.get<District>(
         `${ENDPOINTS.FETCH_DISTRICTS_BY_ID}/detail/${districtId}`,
      );
      return response.data;
   } catch (error) {
      console.error('Error fetching district by ID:', error);
      throw error;
   }
};

/**
 * Şehir adına göre arama yapar
 */
export const searchCitiesApi = async (query: string): Promise<City[]> => {
   try {
      const response = await apiClient.get<City[]>(`${ENDPOINTS.SEARCH_CITIES}/search`, {
         params: { q: query },
      });
      return response.data;
   } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
   }
};

/**
 * İlçe adına göre arama yapar
 */
export const searchDistrictsApi = async (query: string, cityId?: string): Promise<District[]> => {
   try {
      const params: any = { q: query };
      if (cityId) params.cityId = cityId;

      const response = await apiClient.get<District[]>(`${ENDPOINTS.SEARCH_DISTRICTS}/search`, {
         params,
      });
      return response.data;
   } catch (error) {
      console.error('Error searching districts:', error);
      throw error;
   }
};
