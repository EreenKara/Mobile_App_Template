/**
 * Search Service
 *
 * API client kullanarak search işlemlerini yöneten service.
 * Farklı endpoint'leri destekler, cache yönetimi yapar.
 *
 * @author Frontend Developer
 */

import { apiClient } from './apiClient';
import { buildPaginationParams } from './pagination';
import {
   SearchQueryParams,
   SearchResponse,
   SearchEndpoint,
   SearchServiceConfig,
   SearchFilters,
   SearchSortOptions,
} from '../../types/search.types';

// ==================== SEARCH SERVICE CLASS ====================

class SearchService {
   private config: SearchServiceConfig;
   private cache: Map<string, { data: SearchResponse; timestamp: number }> = new Map();

   constructor(config: SearchServiceConfig) {
      this.config = config;
   }

   // ==================== PRIVATE METHODS ====================

   /**
    * Cache key oluşturur
    */
   private generateCacheKey(params: SearchQueryParams, endpoint: string): string {
      const key = JSON.stringify({ params, endpoint });
      return btoa(key); // Base64 encode
   }

   /**
    * Cache'den veri getirir
    */
   private getFromCache(key: string): SearchResponse | null {
      if (!this.config.cache?.enabled) return null;

      const cached = this.cache.get(key);
      if (!cached) return null;

      const now = Date.now();
      const ttl = this.config.cache.ttl || 5 * 60 * 1000; // 5 dakika default

      if (now - cached.timestamp > ttl) {
         this.cache.delete(key);
         return null;
      }

      return cached.data;
   }

   /**
    * Cache'e veri kaydeder
    */
   private setToCache(key: string, data: SearchResponse): void {
      if (!this.config.cache?.enabled) return;

      this.cache.set(key, {
         data,
         timestamp: Date.now(),
      });
   }

   /**
    * Query parametrelerini backend formatına çevirir
    */
   private buildQueryParams(params: SearchQueryParams): string {
      const searchParams = new URLSearchParams();

      // Temel parametreler
      if (params.query) searchParams.append('q', params.query);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.searchType) searchParams.append('type', params.searchType);
      if (params.includeFeatured) searchParams.append('featured', 'true');

      // Sıralama
      if (params.sort) {
         searchParams.append('sortBy', params.sort.field);
         searchParams.append('sortOrder', params.sort.order);
      }

      // Filtreler
      if (params.filters) {
         Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
               if (Array.isArray(value)) {
                  value.forEach(v => searchParams.append(`filter[${key}][]`, v));
               } else if (typeof value === 'object') {
                  // Date range, price range vb.
                  Object.entries(value).forEach(([subKey, subValue]) => {
                     searchParams.append(`filter[${key}][${subKey}]`, subValue as string);
                  });
               } else {
                  searchParams.append(`filter[${key}]`, value.toString());
               }
            }
         });
      }

      // Facets
      if (params.facets && params.facets.length > 0) {
         params.facets.forEach(facet => {
            searchParams.append('facets[]', facet);
         });
      }

      return searchParams.toString();
   }

   /**
    * Endpoint'i resolve eder
    */
   private resolveEndpoint(searchType?: string): SearchEndpoint {
      if (searchType && this.config.endpoints?.[searchType]) {
         return this.config.endpoints[searchType];
      }
      return this.config.defaultEndpoint;
   }

   /**
    * Response'u transform eder
    */
   private transformResponse(response: any, endpoint: SearchEndpoint): SearchResponse {
      if (endpoint.transform) {
         return endpoint.transform(response);
      }

      // Default transform
      return {
         results: response.data?.results || response.data || [],
         pagination: response.data?.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
         },
         metadata: response.data?.metadata || {
            total: 0,
            searchTime: 0,
         },
         success: response.success ?? true,
         message: response.message,
         timestamp: response.timestamp || new Date().toISOString(),
      };
   }

   // ==================== PUBLIC METHODS ====================

   /**
    * Arama yapar
    */
   async search<T = any>(params: SearchQueryParams): Promise<SearchResponse<T>> {
      try {
         // Varsayılan parametrelerle birleştir
         const finalParams = {
            ...this.config.defaultParams,
            ...params,
         };

         // Endpoint'i resolve et
         const endpoint = this.resolveEndpoint(finalParams.searchType);

         // Cache kontrolü
         const cacheKey = this.generateCacheKey(finalParams, endpoint.url);
         const cached = this.getFromCache(cacheKey);
         if (cached) {
            return cached as SearchResponse<T>;
         }

         // Query string oluştur
         const queryString = this.buildQueryParams(finalParams);
         const url = `${endpoint.url}?${queryString}`;

         // API çağrısı
         const response = await apiClient.get(url, {
            headers: endpoint.headers,
         });

         // Response'u transform et
         const transformedResponse = this.transformResponse(response, endpoint);

         // Cache'e kaydet
         this.setToCache(cacheKey, transformedResponse);

         return transformedResponse as SearchResponse<T>;
      } catch (error) {
         console.error('Search error:', error);
         throw error;
      }
   }

   /**
    * Öneri getirir (autocomplete)
    */
   async getSuggestions(query: string, type?: string): Promise<string[]> {
      try {
         const endpoint = this.resolveEndpoint(type);
         const url = `${endpoint.url}/suggestions?q=${encodeURIComponent(query)}`;

         const response = await apiClient.get(url, {
            headers: endpoint.headers,
         });

         return response.data?.suggestions || [];
      } catch (error) {
         console.error('Suggestions error:', error);
         return [];
      }
   }

   /**
    * Popüler aramaları getirir
    */
   async getPopularSearches(type?: string): Promise<string[]> {
      try {
         const endpoint = this.resolveEndpoint(type);
         const url = `${endpoint.url}/popular`;

         const response = await apiClient.get(url, {
            headers: endpoint.headers,
         });

         return response.data?.popular || [];
      } catch (error) {
         console.error('Popular searches error:', error);
         return [];
      }
   }

   /**
    * Cache'i temizler
    */
   clearCache(): void {
      this.cache.clear();
   }

   /**
    * Belirli bir key'in cache'ini temizler
    */
   clearCacheForKey(params: SearchQueryParams, endpoint?: string): void {
      const resolvedEndpoint = endpoint || this.resolveEndpoint(params.searchType);
      const cacheKey = this.generateCacheKey(
         params,
         typeof resolvedEndpoint === 'string' ? resolvedEndpoint : resolvedEndpoint.url,
      );
      this.cache.delete(cacheKey);
   }

   /**
    * Konfigürasyonu günceller
    */
   updateConfig(config: Partial<SearchServiceConfig>): void {
      this.config = { ...this.config, ...config };
   }
}

// ==================== SERVICE INSTANCES ====================

// Varsayılan search service
export const searchService = new SearchService({
   defaultEndpoint: {
      url: '/search',
      method: 'GET',
   },
   defaultParams: {
      page: 1,
      limit: 20,
   },
   cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5 dakika
   },
});

// Kullanıcı search service
export const userSearchService = new SearchService({
   defaultEndpoint: {
      url: '/search/users',
      method: 'GET',
   },
   defaultParams: {
      page: 1,
      limit: 15,
   },
   cache: {
      enabled: true,
      ttl: 3 * 60 * 1000, // 3 dakika
   },
});

// Ürün search service
export const productSearchService = new SearchService({
   defaultEndpoint: {
      url: '/search/products',
      method: 'GET',
   },
   endpoints: {
      category: {
         url: '/search/products/category',
         method: 'GET',
      },
      featured: {
         url: '/search/products/featured',
         method: 'GET',
      },
   },
   defaultParams: {
      page: 1,
      limit: 12,
      includeFeatured: true,
   },
   cache: {
      enabled: true,
      ttl: 10 * 60 * 1000, // 10 dakika
   },
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Search service factory
 */
export const createSearchService = (config: SearchServiceConfig): SearchService => {
   return new SearchService(config);
};

/**
 * Search parametrelerini validate eder
 */
export const validateSearchParams = (params: SearchQueryParams): boolean => {
   if (params.page && params.page < 1) return false;
   if (params.limit && (params.limit < 1 || params.limit > 100)) return false;
   if (params.query && params.query.length > 500) return false;

   return true;
};

/**
 * Search URL'ini oluşturur
 */
export const buildSearchUrl = (baseUrl: string, params: SearchQueryParams): string => {
   const service = new SearchService({
      defaultEndpoint: { url: baseUrl },
   });

   const queryString = (service as any).buildQueryParams(params);
   return `${baseUrl}?${queryString}`;
};

export default searchService;
