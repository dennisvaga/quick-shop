/**
 * Dynamic skeleton loader for product components.
 * Shows placeholders while data is loading, with support for multiple display variants.
 */

import * as React from "react";
import { View, Dimensions } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { ProductCardVariants } from "../types/productCard";

const { width: screenWidth } = Dimensions.get("window");

interface ProductSkeletonProps {
  variant?: ProductCardVariants;
  count?: number;
  withBrighterBg?: boolean; // Prevent skeleton from blending with bg
}

/**
 * Dynamic ProductSkeleton that supports multiple layout variants
 * Shows a placeholder while data is loading.
 */
const ProductSkeleton = ({
  variant = ProductCardVariants.grid,
  count = 4,
  withBrighterBg = true,
}: ProductSkeletonProps) => {
  const bgClass = withBrighterBg ? "bg-gray-200" : "";

  // Skeleton variants specific to each variant
  // This object structure is more efficient than switch, because we can pull only the specific record that we need.
  const skeletonVariants: Record<string, (key: number) => React.JSX.Element> = {
    // Grid product card (2-column mobile grid)
    grid: (key) => (
      <View key={key} className="w-full">
        {/* Image skeleton with 3:4 aspect ratio */}
        <Skeleton className={`w-full rounded-none aspect-[3/4] ${bgClass}`} />
        {/* Content skeleton */}
        <View className="flex flex-col gap-1 p-2 items-center">
          <Skeleton className={`h-4 w-24 rounded ${bgClass}`} />
          <Skeleton className={`h-5 w-16 rounded ${bgClass}`} />
        </View>
      </View>
    ),

    // List product card (single column list view)
    list: (key) => (
      <View key={key} className="flex-row p-4 gap-3">
        <Skeleton className={`w-20 h-20 rounded ${bgClass}`} />
        <View className="flex-1 gap-2">
          <Skeleton className={`h-4 w-3/4 rounded ${bgClass}`} />
          <Skeleton className={`h-5 w-1/2 rounded ${bgClass}`} />
          <Skeleton className={`h-4 w-1/3 rounded ${bgClass}`} />
        </View>
      </View>
    ),

    // Product detail page skeleton
    detail: (key) => (
      <View key={key} className="flex-1">
        {/* Image Gallery Skeleton */}
        <View style={{ height: screenWidth * 1.2 }}>
          <Skeleton className={`w-full h-full rounded-none ${bgClass}`} />
        </View>

        {/* Product Info Skeleton */}
        <View className="p-4 gap-4">
          {/* Product Name */}
          <Skeleton className={`h-8 w-3/4 rounded ${bgClass}`} />

          {/* Rating */}
          <View className="flex-row items-center gap-2">
            <Skeleton className={`h-5 w-20 rounded ${bgClass}`} />
            <Skeleton className={`h-4 w-8 rounded ${bgClass}`} />
          </View>

          {/* Price */}
          <View className="flex-row items-center gap-3">
            <Skeleton className={`h-8 w-20 rounded ${bgClass}`} />
            <Skeleton className={`h-6 w-16 rounded ${bgClass}`} />
          </View>

          {/* Size Selection */}
          <View className="gap-3">
            <Skeleton className={`h-5 w-12 rounded ${bgClass}`} />
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton
                  key={i}
                  className={`w-12 h-12 rounded-lg ${bgClass}`}
                />
              ))}
            </View>
          </View>

          {/* Quantity */}
          <View className="gap-3">
            <Skeleton className={`h-5 w-10 rounded ${bgClass}`} />
            <View className="flex-row items-center gap-4">
              <Skeleton className={`w-10 h-10 rounded-lg ${bgClass}`} />
              <Skeleton className={`h-6 w-8 rounded ${bgClass}`} />
              <Skeleton className={`w-10 h-10 rounded-lg ${bgClass}`} />
            </View>
          </View>

          {/* Description */}
          <View className="gap-2">
            <Skeleton className={`h-5 w-24 rounded ${bgClass}`} />
            <Skeleton className={`h-4 w-full rounded ${bgClass}`} />
            <Skeleton className={`h-4 w-5/6 rounded ${bgClass}`} />
            <Skeleton className={`h-4 w-4/5 rounded ${bgClass}`} />
          </View>
        </View>
      </View>
    ),
  };

  // Fallback to grid if invalid variant
  const renderSkeleton = skeletonVariants[variant] || skeletonVariants.grid;

  // For detail variant, only render one skeleton (it's a full page)
  if (variant === ProductCardVariants.detail) {
    return renderSkeleton(0);
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};

export default ProductSkeleton;
