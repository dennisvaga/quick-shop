// Generic pagination interface used across all APIs
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Generic API response metadata
export interface ApiMeta {
  processingTime: number;
  cacheStatus: string;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  meta: ApiMeta;
}

// Note: ApiError is now a class exported from ./errors.ts

// Generic filter interface that can be extended
export interface BaseFilters {
  page?: number;
  perPage?: number;
  order?: SortOrder;
  search?: string;
}

// Generic sort options
export type SortOrder = "asc" | "desc";

// Common API status types
export type ApiStatus = "idle" | "loading" | "success" | "error";

// Generic API state for components
export interface ApiState<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
}
