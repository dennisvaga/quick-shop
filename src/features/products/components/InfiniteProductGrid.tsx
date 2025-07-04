/**
 * Infinite Scroll Product Grid for Mobile
 * Uses FlatList for performance and infinite loading
 * Supports RTL, error handling, and smooth scrolling
 */

import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { ErrorDisplay } from "~/components/ErrorDisplay";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import ProductCard from "~/features/products/components/ProductCard";
import ProductSkeleton from "~/features/products/components/ProductSkeleton";
import { ProductSummary } from "~/features/products/types/product";
import { ApiError } from "~/types/errors";
import { ProductCardVariants } from "../types/productCard";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = (screenWidth - 48) / 2; // Account for padding and gap
const ITEM_HEIGHT = ITEM_WIDTH * 1.6; // Aspect ratio for product cards

interface InfiniteProductGridProps {
  products: ProductSummary[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  error: ApiError | null;
  onLoadMore: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  className?: string;
}

export function InfiniteProductGrid({
  products,
  isLoading,
  isLoadingMore,
  hasNextPage,
  error,
  onLoadMore,
  onRefresh,
  isRefreshing,
  onRetry,
  emptyMessage = "לא נמצאו מוצרים",
  className = "",
}: InfiniteProductGridProps) {
  const flatListRef = React.useRef<FlatList>(null);

  // Render individual product item
  const renderProduct = ({
    item,
    index,
  }: {
    item: ProductSummary;
    index: number;
  }) => {
    const isLeft = index % 2 === 0;
    return (
      <View
        style={{
          width: ITEM_WIDTH,
          marginLeft: isLeft ? 16 : 8,
          marginRight: isLeft ? 8 : 16,
          marginBottom: 16,
        }}
      >
        <ProductCard product={item} variant={ProductCardVariants.grid} />
      </View>
    );
  };

  // Render loading footer
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View className="py-4 items-center -mt-r">
        <ActivityIndicator size="small" color="#000" />
        {/* <Text className="text-gray-600 mt-2 text-sm">
          טוען מוצרים נוספים...
        </Text> */}
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <View className="p-4">
          <ErrorDisplay error={error} onRetry={onRetry || onRefresh} />
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center p-8">
        <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
          {emptyMessage}
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          נסי לחפש משהו אחר או לבדוק קטגוריה אחרת
        </Text>
        <Button onPress={onRefresh} variant="outline" className="mt-2">
          <Text>רענן</Text>
        </Button>
      </View>
    );
  };

  // Render skeleton loading grid
  const renderSkeletonGrid = () => {
    const skeletonItems = Array.from({ length: 6 }, (_, index) => ({
      id: `skeleton-${index}`,
      isLoading: true,
    }));

    return (
      <FlatList
        data={skeletonItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ index }) => {
          const isLeft = index % 2 === 0;
          return (
            <View
              style={{
                width: ITEM_WIDTH,
                marginLeft: isLeft ? 16 : 8,
                marginRight: isLeft ? 8 : 16,
                marginBottom: 16,
              }}
            >
              <ProductSkeleton />
            </View>
          );
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // Handle end reached with throttling
  const handleEndReached = React.useCallback(() => {
    if (hasNextPage && !isLoadingMore && !isLoading) {
      onLoadMore();
    }
  }, [hasNextPage, isLoadingMore, isLoading, onLoadMore]);

  // Key extractor for better performance
  const keyExtractor = React.useCallback(
    (item: ProductSummary) => `product-${item.id}`,
    []
  );

  if (products.length === 0) {
    return <View className={`flex-1 ${className}`}>{renderEmpty()}</View>;
  }

  return (
    <View className={`flex-1 ${className}`}>
      <FlatList
        ref={flatListRef}
        data={products}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderProduct}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2} // Load more when 80% scrolled
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#000"]} // Android
            tintColor="#000" // iOS
            title="מרענן..." // iOS
            titleColor="#666"
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true} // Performance optimization
        maxToRenderPerBatch={10} // Render 10 items per batch
        updateCellsBatchingPeriod={50} // Update every 50ms
        windowSize={10} // Keep 10 screens worth of items in memory
        initialNumToRender={6} // Render 6 items initially (3 rows)
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        // RTL support
        inverted={false} // Keep normal scroll direction
      />
    </View>
  );
}

export default InfiniteProductGrid;
