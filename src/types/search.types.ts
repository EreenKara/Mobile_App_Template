// ==================== SEARCH QUERY TYPES ====================

export interface SearchFilters {
   [key: string]: any;
   category?: string;
   tags?: string[];
   dateRange?: {
      start: string;
      end: string;
   };
   priceRange?: {
      min: number;
      max: number;
   };
   status?: string;
   location?: string;
}

export interface SearchSortOptions {
   field: string;
   order: 'asc' | 'desc';
}

export interface SearchQueryParams {
   /** Arama terimi */
   query?: string;

   /** Sayfa numarası */
   page?: number;

   /** Sayfa başına sonuç sayısı */
   limit?: number;

   /** Sıralama seçenekleri */
   sort?: SearchSortOptions;

   /** Filtreleme seçenekleri */
   filters?: SearchFilters;

   /** Arama kategorisi/tipi */
   searchType?: string;

   /** Öne çıkanları dahil et */
   includeFeatured?: boolean;

   /** Faceted search için alanlar */
   facets?: string[];
}

// ==================== SEARCH RESPONSE TYPES ====================

export interface SearchFacet {
   field: string;
   values: Array<{
      value: string;
      count: number;
      selected?: boolean;
   }>;
}

export interface SearchSuggestion {
   text: string;
   type: 'query' | 'category' | 'tag';
   count?: number;
}

export interface SearchMetadata {
   /** Toplam sonuç sayısı */
   total: number;

   /** Arama süresi (ms) */
   searchTime: number;

   /** Düzeltilen sorgu (spell check) */
   correctedQuery?: string;

   /** Önerilen sorgular */
   suggestions?: SearchSuggestion[];

   /** Facet bilgileri */
   facets?: SearchFacet[];

   /** Arama kategorisi */
   searchType?: string;
}

export interface SearchPagination {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
   hasNext: boolean;
   hasPrev: boolean;
}

export interface SearchResponse<T = any> {
   /** Arama sonuçları */
   results: T[];

   /** Pagination bilgileri */
   pagination: SearchPagination;

   /** Arama metadata'sı */
   metadata: SearchMetadata;

   /** API response bilgileri */
   success: boolean;
   message?: string;
   timestamp: string;
}

// ==================== SEARCH HOOK TYPES ====================

export interface SearchHookOptions {
   /** Debounce delay (ms) */
   debounceDelay?: number;

   /** Minimum query length */
   minQueryLength?: number;

   /** Otomatik arama */
   autoSearch?: boolean;

   /** Cache süresi (ms) */
   cacheTime?: number;

   /** Başlangıç query'si */
   initialQuery?: string;

   /** Başlangıç filtreleri */
   initialFilters?: SearchFilters;

   /** Sayfa başına sonuç sayısı */
   pageSize?: number;

   /** Hata durumunda notification göster */
   showNotificationOnError?: boolean;

   /** Başarı durumunda notification göster */
   showNotificationOnSuccess?: boolean;
}

export interface SearchHookReturn<T = any> {
   /** Arama sonuçları */
   results: T[];

   /** Loading durumu */
   loading: boolean;

   /** Hata durumu */
   error: string | null;

   /** Mevcut query */
   query: string;

   /** Mevcut filtreler */
   filters: SearchFilters;

   /** Pagination bilgileri */
   pagination: SearchPagination | null;

   /** Metadata */
   metadata: SearchMetadata | null;

   /** Arama fonksiyonu */
   search: (query: string, options?: Partial<SearchQueryParams>) => Promise<void>;

   /** Filtre güncelleme */
   updateFilters: (filters: Partial<SearchFilters>) => void;

   /** Sayfa değiştirme */
   changePage: (page: number) => void;

   /** Sıralama değiştirme */
   changeSort: (sort: SearchSortOptions) => void;

   /** Temizleme */
   clearSearch: () => void;

   /** Yeniden arama */
   refetch: () => Promise<void>;

   /** Sonraki sayfa */
   loadMore: () => Promise<void>;

   /** Cache temizleme */
   clearCache: () => void;
}

// ==================== SEARCH SERVICE TYPES ====================

export interface SearchEndpoint {
   /** Endpoint URL'i */
   url: string;

   /** HTTP method */
   method?: 'GET' | 'POST';

   /** Özel header'lar */
   headers?: Record<string, string>;

   /** Response transform fonksiyonu */
   transform?: (response: any) => SearchResponse;
}

export interface SearchServiceConfig {
   /** Varsayılan endpoint */
   defaultEndpoint: SearchEndpoint;

   /** Kategori bazlı endpoint'ler */
   endpoints?: Record<string, SearchEndpoint>;

   /** Varsayılan parametreler */
   defaultParams?: Partial<SearchQueryParams>;

   /** Cache ayarları */
   cache?: {
      enabled: boolean;
      ttl: number; // Time to live (ms)
   };
}

// ==================== SEARCH CONTEXT TYPES ====================

export interface SearchContextValue {
   /** Global search state */
   globalQuery: string;

   /** Son aramalar */
   recentSearches: string[];

   /** Popüler aramalar */
   popularSearches: string[];

   /** Global search fonksiyonu */
   setGlobalQuery: (query: string) => void;

   /** Son aramaya ekle */
   addRecentSearch: (query: string) => void;

   /** Son aramaları temizle */
   clearRecentSearches: () => void;
}

// ==================== UTILITY TYPES ====================

export type SearchResultType = 'user' | 'product' | 'post' | 'category' | 'tag' | 'location';

export interface SearchableItem {
   id: string;
   type: SearchResultType;
   title: string;
   description?: string;
   imageUrl?: string;
   url?: string;
   metadata?: Record<string, any>;
}

export interface SearchHighlight {
   field: string;
   matches: Array<{
      text: string;
      highlighted: boolean;
   }>;
}

export interface EnhancedSearchResult<T = any> extends SearchableItem {
   /** Orijinal data */
   data: T;

   /** Relevance score */
   score: number;

   /** Highlight bilgileri */
   highlights?: SearchHighlight[];

   /** Öne çıkan mı */
   featured?: boolean;
}
