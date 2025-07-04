import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

/**
 * Cache invalidation helpers
 * SHARED: Same invalidation logic across platforms
 */
export const createCacheHelpers = (queryClient: QueryClient) => ({
  // Product invalidation
  invalidateProducts: () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.all,
    }),

  invalidateProduct: (id: string | number) =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.detail(id),
    }),

  invalidateProductLists: () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.lists(),
    }),

  // Category invalidation
  invalidateCategories: () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.categories.all,
    }),

  // Cart invalidation
  invalidateCart: () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.cart.all,
    }),

  // Content invalidation
  invalidateContent: () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.content.all,
    }),

  // Optimistic updates
  updateCartOptimistically: (cartData: any) => {
    queryClient.setQueryData(queryKeys.cart.current(), cartData);
  },

  clearAllCache: () => queryClient.clear(),
});

/**
 * Prefetch helpers for performance optimization
 * SHARED: Same prefetch patterns across platforms
 */
export const createPrefetchHelpers = (queryClient: QueryClient) => ({
  prefetchNextProductPage: async (
    getProductsFn: (filters: any) => Promise<any>,
    currentFilters: any,
    currentPage: number
  ) => {
    const nextPageFilters = { ...currentFilters, page: currentPage + 1 };

    return queryClient.prefetchQuery({
      queryKey: queryKeys.products.list(nextPageFilters),
      queryFn: () => getProductsFn(nextPageFilters),
      staleTime: 5 * 60 * 1000, // Apps can override this
    });
  },

  prefetchProductDetails: async (
    getProductFn: (id: string | number) => Promise<any>,
    productId: string | number
  ) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(productId),
      queryFn: () => getProductFn(productId),
      staleTime: 10 * 60 * 1000,
    });
  },
});
