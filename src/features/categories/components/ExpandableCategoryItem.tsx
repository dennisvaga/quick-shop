import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { getCategoryById } from "~/features/categories/constants/categories";

interface ExpandableCategoryItemProps {
  id: string;
  name: string;
  subcategories?: Array<{ id: string; name: string }>;
  onPress: () => void;
}

export default function ExpandableCategoryItem({
  id,
  name,
  subcategories = [],
  onPress,
}: ExpandableCategoryItemProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handlePress = () => {
    if (subcategories.length > 0) {
      setExpanded(!expanded);
    } else {
      // Navigate to category products using wooId
      const category = getCategoryById(id);
      if (category) {
        router.push(`/products?category=${category.wooId}`);
      } else {
        onPress();
      }
    }
  };

  const navigateToSubcategory = (subcategoryId: string) => {
    // Get the category object to access its wooId
    const category = getCategoryById(subcategoryId);
    if (category) {
      // Navigate to products page with numeric WooCommerce category ID
      router.push(`/products?category=${category.wooId}`);
    } else {
      console.warn(`Subcategory not found: ${subcategoryId}`);
      // Fallback to products page without category filter
      router.push("/products");
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="py-4 px-4 border-b border-gray-100 bg-white"
      >
        <View className="flex-row items-center justify-start">
          <Text className="text-base font-medium text-gray-900">{name}</Text>
          <Text className="text-gray-400 text-lg ml-2">
            {subcategories.length > 0 ? (expanded ? "⌄" : "‹") : "›"}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && subcategories.length > 0 && (
        <View className="bg-gray-50">
          {subcategories.map((subcat, index) => (
            <TouchableOpacity
              key={subcat.id}
              onPress={() => navigateToSubcategory(subcat.id)}
              className="py-3 px-8 border-b border-gray-100 bg-gray-50"
            >
              <Text className="text-sm text-gray-700">{subcat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
