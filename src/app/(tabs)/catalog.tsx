/**
 * Catalog Tab - Pure Shopping Focus
 * Features prominent search and complete category navigation
 */

import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { SearchBar } from "~/components/SearchBar";
import CategoryItem from "~/features/categories/components/CategoryItem";
import ExpandableCategoryItem from "~/features/categories/components/ExpandableCategoryItem";
import {
  APP_CATEGORIES,
  getCategoryById,
} from "~/features/categories/constants/categories";
import { PageContainer } from "~/layout/PageContainer";

export default function CatalogTab() {
  const [searchText, setSearchText] = React.useState("");

  const navigateToProducts = (categoryId: string) => {
    // Get the category object to access its wooId
    const category = getCategoryById(categoryId);
    if (category) {
      // Navigate to products page with numeric WooCommerce category ID
      router.push(`/products?category=${category.wooId}`);
    } else {
      console.warn(`Category not found: ${categoryId}`);
      // Fallback to products page without category filter
      router.push("/products");
    }
  };

  const specialCategories = APP_CATEGORIES.special;
  const mainCategories = APP_CATEGORIES.main;

  return (
    <PageContainer isTabScreen={true}>
      {/* Header with brand name only */}
      {/* <AppHeader /> */}

      {/* BIG SEARCH BAR */}
      <SearchBar value={searchText} onChangeText={setSearchText} />

      {/* All Categories - Minimal List */}
      <View className="bg-white">
        {/* Special Categories */}
        {specialCategories.map(
          (category: (typeof APP_CATEGORIES.special)[0]) => (
            <CategoryItem
              key={category.id}
              id={category.id}
              name={category.name}
              style={category.id === "new-collection" ? "new" : "sale"}
              onPress={() => navigateToProducts(category.id)}
            />
          )
        )}

        {/* Main Categories */}
        {mainCategories.map((category: (typeof APP_CATEGORIES.main)[0]) => {
          // Only מכנסיים has subcategories
          if (category.id === "pants" && category.subcategories) {
            return (
              <ExpandableCategoryItem
                key={category.id}
                id={category.id}
                name={category.name}
                subcategories={category.subcategories}
                onPress={() => navigateToProducts(category.id)}
              />
            );
          }

          // Regular category items
          return (
            <CategoryItem
              key={category.id}
              id={category.id}
              name={category.name}
              onPress={() => navigateToProducts(category.id)}
            />
          );
        })}
      </View>
    </PageContainer>
  );
}
