/**
 * Product Detail Route
 * Dynamic route for individual product display
 * Handles routing, data fetching, and delegates UI to ProductDetailPage component
 */

import { Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { ErrorDisplay } from "~/components/ErrorDisplay";
import { FloatingActionButtons } from "~/components/FloatingActionButtons";
import { CartButton } from "~/components/header/CartButton";
import { HeaderActions } from "~/components/header/HeaderActions";
import { Text } from "~/components/ui/text";
import ProductDetail from "~/features/products/components/ProductDetail";
import ProductSkeleton from "~/features/products/components/ProductSkeleton";
import { useProduct } from "~/features/products/hooks/useProducts";
import { ProductCardVariants } from "~/features/products/types/productCard";
import { PageContainer } from "~/layout/PageContainer";

export default function ProductDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null;

  const { data: product, isLoading, error, refetch } = useProduct(productId);

  // Track selection state from ProductDetail component
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);

  // Handle selection changes from ProductDetail component
  const handleSelectionChange = (size: string | null, qty: number) => {
    setSelectedSize(size);
    setQuantity(qty);
  };

  // Handle add to cart action
  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Add to cart:", {
      productId: product?.id,
      size: selectedSize,
      quantity,
    });
  };

  // Handle add to wishlist action
  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log("Add to wishlist:", product?.id);
  };

  // Wrapper for refetch to match expected signature
  const handleRefresh = () => {
    refetch();
  };

  // Smart loading state - only show loading if we don't have cached data
  if (isLoading && !product) {
    return (
      <PageContainer showRefreshControl={false}>
        <ProductSkeleton variant={ProductCardVariants.detail} />
      </PageContainer>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "",
            headerBackTitle: "",
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
        <PageContainer onRefresh={handleRefresh}>
          <View className="flex-1 justify-center items-center p-4">
            {error ? (
              <ErrorDisplay error={error} onRetry={refetch} />
            ) : (
              <View className="items-center">
                <Text className="text-lg font-semibold mb-2">
                  המוצר לא נמצא
                </Text>
                <Text className="text-gray-600 text-center mb-4">
                  המוצר שחיפשת לא נמצא או לא זמין יותר
                </Text>
              </View>
            )}
          </View>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "",
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
      <View className="flex-1 relative">
        <PageContainer onRefresh={handleRefresh}>
          <ProductDetail
            product={product}
            onAddToCart={(productId, size, quantity) => handleAddToCart()}
            onAddToWishlist={(productId) => handleAddToWishlist()}
            onSelectionChange={handleSelectionChange}
          />
        </PageContainer>

        {/* Floating Action Buttons Component */}
        <FloatingActionButtons
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      </View>
    </>
  );
}
