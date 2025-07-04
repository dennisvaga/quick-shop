import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProduct,
  getProducts,
  getProductsByCategory,
  getProductVariations,
  ProductFilters,
  searchProducts,
} from "~/api/products";
import { ApiError } from "~/types/errors";
import { Product, ProductSummary } from "../types/product";

// Re-export types for convenience
export type { Product, ProductFilters, ProductSummary };

/**
 * Hook for fetching products with filtering and pagination
 * Uses TanStack Query for caching, background updates, and smart error handling
 */
export const useProducts = (filters?: ProductFilters) => {
  const queryResult = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Smart retry logic based on error type
      if (error instanceof ApiError) {
        // Don't retry non-retryable errors
        if (!error.retryable) {
          return false;
        }
        // Retry retryable errors up to 3 times with exponential backoff
        return failureCount < 3;
      }
      // Retry unknown errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
    },
    refetchOnWindowFocus: false,
  });

  // Manual retry function that preserves error context
  const retry = () => {
    queryResult.refetch();
  };

  return {
    ...queryResult,
    retry,
    // Expose error as ApiError if available
    error: queryResult.error instanceof ApiError ? queryResult.error : null,
  };
};

/**
 * Hook for fetching a single product by ID
 * Automatically enabled/disabled based on whether ID is provided
 */
export const useProduct = (id: number | null | undefined) => {
  const queryResult = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id, // Only run query if ID is provided
    staleTime: 5 * 60 * 1000, // Show cached data for 5 minutes (reduced for faster navigation)
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry PRODUCT_NOT_FOUND errors
        if (error.code === "PRODUCT_NOT_FOUND") {
          return false;
        }
        return error.retryable && failureCount < 3;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  const retry = () => {
    queryResult.refetch();
  };

  return {
    ...queryResult,
    retry,
    error: queryResult.error instanceof ApiError ? queryResult.error : null,
  };
};

/**
 * Hook for searching products with debounced query
 * Only searches when query is at least 2 characters long
 */
export const useProductSearch = (query: string, page: number = 1) => {
  const queryResult = useQuery({
    queryKey: ["products", "search", query, page],
    queryFn: () => searchProducts(query, page),
    enabled: query.length >= 2, // Only search with 2+ characters
    staleTime: 2 * 60 * 1000, // Shorter cache for search results (2 minutes)
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry INVALID_SEARCH errors
        if (error.code === "INVALID_SEARCH") {
          return false;
        }
        return error.retryable && failureCount < 2;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 5000),
  });

  const retry = () => {
    queryResult.refetch();
  };

  return {
    ...queryResult,
    retry,
    error: queryResult.error instanceof ApiError ? queryResult.error : null,
  };
};

/**
 * Hook for fetching products by category
 * Useful for category pages and filtering
 */
export const useProductsByCategory = (
  categoryId: number | null | undefined,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["products", "category", categoryId, page],
    queryFn: () => getProductsByCategory(categoryId!, page),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

/**
 * Hook for fetching product variations (sizes, colors, etc.)
 * Used on product detail pages
 */
export const useProductVariations = (productId: number | null | undefined) => {
  return useQuery({
    queryKey: ["product", productId, "variations"],
    queryFn: () => getProductVariations(productId!),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // Cache variations longer
    retry: 3,
  });
};

/**
 * Hook for infinite scrolling products
 * Perfect for mobile apps and long product lists
 */
export const useInfiniteProducts = (filters?: Omit<ProductFilters, "page">) => {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", filters],
    queryFn: ({ pageParam }) =>
      getProducts({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext
        ? lastPage.pagination.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.pagination.hasPrev
        ? firstPage.pagination.currentPage - 1
        : undefined,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

/**
 * Hook for infinite search results
 * Combines search functionality with infinite scrolling
 */
export const useInfiniteProductSearch = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["products", "search", "infinite", query],
    queryFn: ({ pageParam }) => searchProducts(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext
        ? lastPage.pagination.currentPage + 1
        : undefined,
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook for prefetching products
 * Useful for preloading next page or related products
 */
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  const prefetchProducts = (filters?: ProductFilters) => {
    queryClient.prefetchQuery({
      queryKey: ["products", filters],
      queryFn: () => getProducts(filters),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchProduct = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ["product", id],
      queryFn: () => getProduct(id),
      staleTime: 10 * 60 * 1000,
    });
  };

  return {
    prefetchProducts,
    prefetchProduct,
  };
};

/**
 * Hook for getting cached product data without triggering a request
 * Useful for optimistic updates or displaying cached data
 */
export const useCachedProduct = (id: number) => {
  const queryClient = useQueryClient();

  const getCachedProduct = (): Product | undefined => {
    return queryClient.getQueryData(["product", id]);
  };

  const getCachedProducts = (filters?: ProductFilters): ProductSummary[] => {
    const data = queryClient.getQueryData(["products", filters]);
    return (data as any)?.products || [];
  };

  return {
    getCachedProduct,
    getCachedProducts,
  };
};
