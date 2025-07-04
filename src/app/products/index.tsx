/**
 * Mobile Products Page with Infinite Scroll
 * Displays products using InfiniteProductGrid with automatic loading
 */

import { Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { CartButton } from "~/components/header/CartButton";
import { HeaderActions } from "~/components/header/HeaderActions";
import { getCategoryByWooId } from "~/features/categories/constants/categories";
import InfiniteProductGrid from "~/features/products/components/InfiniteProductGrid";
import {
  ProductSummary,
  useInfiniteProducts,
} from "~/features/products/hooks/useProducts";

export default function ProductsScreen() {
  // Get category from URL parameters
  const { category } = useLocalSearchParams<{ category?: string }>();

  // Parse category ID and get category info
  const categoryId = category ? parseInt(category, 10) : undefined;
  const categoryInfo = categoryId ? getCategoryByWooId(categoryId) : null;

  // Use infinite products hook for automatic pagination
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
    isRefetching,
  } = useInfiniteProducts({
    category: categoryId,
    perPage: 20, // Load 20 products per page for better infinite scroll experience
  });

  // Flatten all pages into a single array
  const products = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.products) as ProductSummary[];
  }, [data?.pages]);

  // Handle loading more products
  const handleLoadMore = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle refresh
  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  // Custom empty message based on category
  const emptyMessage = React.useMemo(() => {
    if (categoryInfo) {
      return `לא נמצאו מוצרים בקטגוריה "${categoryInfo.name}"`;
    }
    return "לא נמצאו מוצרים";
  }, [categoryInfo]);

  return (
    <>
      <Stack.Screen
        options={{
          title: categoryInfo ? categoryInfo.name : "כל המוצרים",
          headerStyle: {
            backgroundColor: "white",
          },
          headerShadowVisible: false,
          headerRight: () => (
            <HeaderActions>
              <CartButton />
            </HeaderActions>
          ),
        }}
      />

      {/* Infinite Scroll Product Grid */}
      <InfiniteProductGrid
        products={products}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage || false}
        hasNextPage={hasNextPage || false}
        error={error as any} // TanStack Query returns Error, but our component expects ApiError
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
        emptyMessage={emptyMessage}
      />
    </>
  );
}
