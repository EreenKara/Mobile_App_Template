// Pagination Helper
export interface PaginationParams {
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
   search?: string;
}

export interface PaginatedResponse<T> {
   data: T[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
   };
}

export const buildPaginationParams = (params: PaginationParams): string => {
   const searchParams = new URLSearchParams();

   if (params.page) searchParams.append('page', params.page.toString());
   if (params.limit) searchParams.append('limit', params.limit.toString());
   if (params.sortBy) searchParams.append('sortBy', params.sortBy);
   if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
   if (params.search) searchParams.append('search', params.search);

   return searchParams.toString();
};
