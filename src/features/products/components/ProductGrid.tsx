/**
 * Non-virtualized product grid for use inside ScrollViews
 * Used for homepage sections with limited products
 */

import * as React from "react";
import { View } from "react-native";
import ProductCard from "~/features/products/components/ProductCard";
import ProductSkeleton from "~/features/products/components/ProductSkeleton";
import { ProductSummary } from "~/features/products/types/product";
import { ProductCardVariants } from "../types/productCard";

interface ProductSectionProps {
  products: ProductSummary[];
  isLoading: boolean;
  maxItems?: number;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading,
  maxItems = 10,
  className = "",
}: ProductSectionProps) {
  const renderProducts = () => {
    const productsToShow = products.slice(0, maxItems);
    const rows = [];

    for (let i = 0; i < productsToShow.length; i += 2) {
      const leftProduct = productsToShow[i];
      const rightProduct = productsToShow[i + 1];

      rows.push(
        <View key={i} className="flex-row justify-between mb-4">
          <View className="flex-1 pr-2">
            <ProductCard
              product={leftProduct}
              variant={ProductCardVariants.grid}
            />
          </View>
          {rightProduct ? (
            <View className="flex-1 pl-2">
              <ProductCard
                product={rightProduct}
                variant={ProductCardVariants.grid}
              />
            </View>
          ) : (
            <View className="flex-1" />
          )}
        </View>
      );
    }

    return rows;
  };

  const renderSkeletons = () => {
    const rows = [];
    for (let i = 0; i < maxItems; i += 2) {
      rows.push(
        <View key={i} className="flex-row justify-between mb-4">
          <View className="flex-1 pr-2">
            <ProductSkeleton />
          </View>
          <View className="flex-1 pl-2">
            <ProductSkeleton />
          </View>
        </View>
      );
    }
    return rows;
  };

  return (
    <View className={className}>
      {isLoading ? renderSkeletons() : renderProducts()}
    </View>
  );
}
