/**
 * Mobile Product Card component
 * Optimized for touch interactions and mobile layouts
 */

import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as React from "react";
import { Pressable } from "react-native";
import { getProduct } from "~/api/products";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ProductSummary } from "~/features/products/types/product";
import {
  MobileProductCardProps,
  ProductCardVariants,
} from "../types/productCard";
import {
  ProductAddToCartButton,
  ProductImage,
  ProductName,
  ProductPrice,
} from "./Product";

interface ProductCardProps extends MobileProductCardProps {
  product: ProductSummary;
}

const ProductCard = ({
  product,
  variant = ProductCardVariants.grid,
  onPress,
  onLongPress,
  showAddToCart = false,
}: ProductCardProps) => {
  const queryClient = useQueryClient();

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Add to cart:", product.name);
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      // Prefetch product details before navigation for instant loading
      queryClient.prefetchQuery({
        queryKey: ["product", product.id],
        queryFn: () => getProduct(product.id),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });

      // Navigate to product detail page
      router.push(`/products/${product.id}` as any);
    }
  };

  // Get primary image
  const primaryImage = product.images?.[0]?.src || "";

  const isListView = variant === ProductCardVariants.list;

  return (
    <Pressable
      onPress={handleCardPress}
      onLongPress={onLongPress}
      className="active:opacity-70"
    >
      <Card className="border-0 shadow-none bg-transparent overflow-hidden">
        <CardHeader className="p-0">
          <ProductImage
            src={primaryImage}
            onPress={handleCardPress}
            className="w-full"
          />
        </CardHeader>
        <CardContent className="flex flex-col p-2 gap-4">
          <ProductName
            name={product.name ?? ""}
            onPress={handleCardPress}
            className="text-gray-900"
          />
          <ProductPrice
            price={parseFloat(product.price) || 0}
            className="text-gray-900"
          />
          {showAddToCart && (
            <ProductAddToCartButton
              onPress={handleAddToCart}
              variant="default"
              className="mt-1"
            />
          )}
        </CardContent>
      </Card>
    </Pressable>
  );
};

export default ProductCard;
