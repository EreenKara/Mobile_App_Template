import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDebounce } from '../modular/useDebounce';
import { useAsync } from '../modular/useAsync';
import { searchService } from '../../services/backend/searchService';
import {
   SearchQueryParams,
   SearchResponse,
   SearchHookOptions,
   SearchHookReturn,
   SearchFilters,
   SearchSortOptions,
   SearchPagination,
   SearchMetadata,
} from '../../types/search.types';

// ==================== DEFAULT OPTIONS ====================

const DEFAULT_OPTIONS: Required<SearchHookOptions> = {
   debounceDelay: 300,
   minQueryLength: 2,
   autoSearch: true,
   cacheTime: 5 * 60 * 1000, // 5 dakika
   initialQuery: '',
   initialFilters: {},
   pageSize: 20,
   showNotificationOnError: true,
   showNotificationOnSuccess: false,
};

// ==================== MAIN HOOK ====================

export function useSearch<T = any>(
   service = searchService,
   options: SearchHookOptions = {},
): SearchHookReturn<T> {
   // ==================== STATE MANAGEMENT ====================

   const finalOptions = { ...DEFAULT_OPTIONS, ...options };

   // Core state
   const [query, setQuery] = useState<string>(finalOptions.initialQuery);
   const [filters, setFilters] = useState<SearchFilters>(finalOptions.initialFilters);
   const [sort, setSort] = useState<SearchSortOptions>({ field: 'relevance', order: 'desc' });
   const [currentPage, setCurrentPage] = useState<number>(1);

   // Results state
   const [results, setResults] = useState<T[]>([]);
   const [pagination, setPagination] = useState<SearchPagination | null>(null);
   const [metadata, setMetadata] = useState<SearchMetadata | null>(null);

   // UI state
   const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

   // Refs
   const lastSearchParams = useRef<SearchQueryParams>({});
   const abortController = useRef<AbortController | null>(null);

   // ==================== DEBOUNCED VALUES ====================

   const debouncedQuery = useDebounce(query, finalOptions.debounceDelay);

   // ==================== ASYNC SEARCH ====================

   const {
      execute: executeSearch,
      loading,
      error,
      reset: resetAsync,
   } = useAsync(
      async (params: SearchQueryParams) => {
         // Abort previous request
         if (abortController.current) {
            abortController.current.abort();
         }

         // Create new abort controller
         abortController.current = new AbortController();

         return await service.search<T>(params);
      },
      {
         showNotificationOnError: finalOptions.showNotificationOnError,
         showNotificationOnSuccess: finalOptions.showNotificationOnSuccess,
         onSuccess: (response: SearchResponse<T>) => {
            setResults(response.results);
            setPagination(response.pagination);
            setMetadata(response.metadata);
            setIsInitialLoad(false);
         },
         onError: error => {
            console.error('Search error:', error);
            setIsInitialLoad(false);
         },
      },
   );

   // ==================== SEARCH FUNCTIONS ====================

   /**
    * Ana arama fonksiyonu
    */
   const search = useCallback(
      async (searchQuery: string, additionalOptions?: Partial<SearchQueryParams>) => {
         // Minimum query length kontrolü
         if (searchQuery.length < finalOptions.minQueryLength && searchQuery.length > 0) {
            return;
         }

         // Search parametrelerini oluştur
         const searchParams: SearchQueryParams = {
            query: searchQuery,
            page: currentPage,
            limit: finalOptions.pageSize,
            sort,
            filters,
            ...additionalOptions,
         };

         // Aynı parametrelerle arama yapılmışsa skip et
         if (JSON.stringify(searchParams) === JSON.stringify(lastSearchParams.current)) {
            return;
         }

         lastSearchParams.current = searchParams;

         // Arama yap
         await executeSearch(searchParams);
      },
      [
         currentPage,
         finalOptions.pageSize,
         finalOptions.minQueryLength,
         sort,
         filters,
         executeSearch,
      ],
   );

   /**
    * Filtre güncelleme
    */
   const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
      setCurrentPage(1); // Reset to first page
   }, []);

   /**
    * Sayfa değiştirme
    */
   const changePage = useCallback((page: number) => {
      setCurrentPage(page);
   }, []);

   /**
    * Sıralama değiştirme
    */
   const changeSort = useCallback((newSort: SearchSortOptions) => {
      setSort(newSort);
      setCurrentPage(1); // Reset to first page
   }, []);

   /**
    * Arama temizleme
    */
   const clearSearch = useCallback(() => {
      setQuery('');
      setFilters(finalOptions.initialFilters);
      setSort({ field: 'relevance', order: 'desc' });
      setCurrentPage(1);
      setResults([]);
      setPagination(null);
      setMetadata(null);
      resetAsync();
   }, [finalOptions.initialFilters, resetAsync]);

   /**
    * Yeniden arama
    */
   const refetch = useCallback(async () => {
      await search(query);
   }, [search, query]);

   /**
    * Sonraki sayfa yükleme (infinite scroll)
    */
   const loadMore = useCallback(async () => {
      if (!pagination?.hasNext || loading) return;

      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      const searchParams: SearchQueryParams = {
         query,
         page: nextPage,
         limit: finalOptions.pageSize,
         sort,
         filters,
      };

      try {
         const response = await service.search<T>(searchParams);

         // Sonuçları mevcut sonuçlara ekle
         setResults(prev => [...prev, ...response.results]);
         setPagination(response.pagination);
         setMetadata(response.metadata);
      } catch (error) {
         console.error('Load more error:', error);
      }
   }, [pagination, loading, currentPage, query, finalOptions.pageSize, sort, filters, service]);

   /**
    * Cache temizleme
    */
   const clearCache = useCallback(() => {
      service.clearCache();
   }, [service]);

   // ==================== EFFECTS ====================

   /**
    * Debounced query değişikliği
    */
   useEffect(() => {
      if (finalOptions.autoSearch) {
         search(debouncedQuery);
      }
   }, [debouncedQuery, finalOptions.autoSearch, search]);

   /**
    * Filtre ve sıralama değişikliği
    */
   useEffect(() => {
      if (finalOptions.autoSearch && !isInitialLoad) {
         search(query);
      }
   }, [filters, sort, finalOptions.autoSearch, isInitialLoad, search, query]);

   /**
    * Sayfa değişikliği
    */
   useEffect(() => {
      if (finalOptions.autoSearch && !isInitialLoad && currentPage > 1) {
         search(query);
      }
   }, [currentPage, finalOptions.autoSearch, isInitialLoad, search, query]);

   /**
    * Cleanup
    */
   useEffect(() => {
      return () => {
         if (abortController.current) {
            abortController.current.abort();
         }
      };
   }, []);

   // ==================== MEMOIZED VALUES ====================

   const searchState = useMemo(
      () => ({
         hasResults: results.length > 0,
         isEmpty: !loading && results.length === 0 && query.length >= finalOptions.minQueryLength,
         isSearching: loading,
         canLoadMore: pagination?.hasNext ?? false,
         totalResults: metadata?.total ?? 0,
         searchTime: metadata?.searchTime ?? 0,
      }),
      [results.length, loading, query.length, finalOptions.minQueryLength, pagination, metadata],
   );

   // ==================== RETURN ====================

   return {
      // Data
      results,
      pagination,
      metadata,

      // State
      loading,
      error: error?.message || null,
      query,
      filters,

      // Actions
      search: async (searchQuery: string, additionalOptions?: Partial<SearchQueryParams>) => {
         setQuery(searchQuery);
         await search(searchQuery, additionalOptions);
      },
      updateFilters,
      changePage,
      changeSort,
      clearSearch,
      refetch,
      loadMore,
      clearCache,

      // Computed state
      ...searchState,
   };
}

export default useSearch;
