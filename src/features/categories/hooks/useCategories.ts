import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  CategoriesResponse,
  CategoryFilters,
  getCategories,
  getCategory,
  getCategoryProducts,
} from "~/api/categories";
import { ProductSummary } from "~/features/products/types/product";
import { ApiError } from "~/types/errors";
import { Category } from "../types/category";

// Hook to get all categories
export function useCategories(
  filters?: CategoryFilters
): UseQueryResult<CategoriesResponse, ApiError> & { retry: () => void } {
  const queryResult = useQuery<CategoriesResponse, ApiError>({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
    retry: (failureCount, error) => {
      // Auto-retry for network errors only
      if (error instanceof ApiError && error.retryable) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...queryResult,
    retry: () => queryResult.refetch(),
  };
}

// Hook to get a single category
export function useCategory(
  id: number
): UseQueryResult<Category, ApiError> & { retry: () => void } {
  const queryResult = useQuery<Category, ApiError>({
    queryKey: ["category", id],
    queryFn: () => getCategory(id),
    retry: (failureCount, error) => {
      // Auto-retry for network errors only
      if (error instanceof ApiError && error.retryable) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!id,
  });

  return {
    ...queryResult,
    retry: () => queryResult.refetch(),
  };
}

// Hook to get products in a category
export function useCategoryProducts(
  categoryId: number,
  filters?: {
    page?: number;
    perPage?: number;
    order?: "asc" | "desc";
    orderBy?: "date" | "title" | "price" | "popularity";
  }
): UseQueryResult<ProductSummary[], ApiError> & { retry: () => void } {
  const queryResult = useQuery<ProductSummary[], ApiError>({
    queryKey: ["categoryProducts", categoryId, filters],
    queryFn: () => getCategoryProducts(categoryId, filters),
    retry: (failureCount, error) => {
      // Auto-retry for network errors only
      if (error instanceof ApiError && error.retryable) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!categoryId,
  });

  return {
    ...queryResult,
    retry: () => queryResult.refetch(),
  };
}
