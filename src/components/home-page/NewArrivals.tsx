import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { ErrorDisplay } from "~/components/ErrorDisplay";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ProductGrid } from "~/features/products/components/ProductGrid";
import { useProducts } from "~/features/products/hooks/useProducts";

export function NewArrivals() {
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useProducts({
    perPage: 10,
    orderBy: "date",
    order: "desc",
  });

  const navigateToProducts = () => {
    router.push("/products");
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <View className="pt-6">
      {/* Custom header with "View All" button */}
      <View className="flex-row justify-between items-center mb-4 px-4">
        {/* Title for the section */}
        <Text className="text-xl font-semibold text-gray-900 text-right">
          NEW ARRIVALS
        </Text>
        {/* View All button */}
        <Button variant="ghost" onPress={navigateToProducts} className="!px-0">
          <Text className="text-gray-900 font-medium">צפי בהכל</Text>
        </Button>
      </View>

      {/* Display products in a section with a title */}
      <ProductGrid
        products={products?.data || []}
        isLoading={isLoading}
        maxItems={10}
      />
    </View>
  );
}
