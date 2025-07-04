import React, { useState } from "react";
import { View } from "react-native";
import { getAllCategories } from "~/api/categories";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function DebugCategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();

      // Clean the data - only keep essential fields
      const cleanData = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
        parent: cat.parent || 0,
      }));

      setCategories(cleanData);
      setShowCategories(true);
      console.log(`✅ Categories loaded: ${cleanData.length} total`);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Group categories by parent for better organization
  const parentCategories = categories.filter((cat) => cat.parent === 0);
  const childCategories = categories.filter((cat) => cat.parent !== 0);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-center text-lg">Categories Debug</CardTitle>
      </CardHeader>
      <CardContent className="items-center">
        <Text className="text-center text-gray-600 mb-4 text-sm">
          Load and view WooCommerce categories structure
        </Text>

        <Button
          onPress={fetchCategories}
          disabled={loading}
          className="w-full mb-4"
        >
          <Text className="text-white font-medium">
            {loading ? "Loading..." : "📋 Load Categories"}
          </Text>
        </Button>

        {error && (
          <Text className="text-center text-red-500 text-sm mb-4">
            Error: {error}
          </Text>
        )}

        {showCategories && categories.length > 0 && (
          <View className="w-full">
            <Text className="font-semibold text-center mb-4">
              Found {categories.length} categories
            </Text>

            {/* Parent Categories */}
            <Text className="font-medium text-blue-600 mb-2">
              Parent Categories ({parentCategories.length}):
            </Text>
            {parentCategories.map((cat) => {
              const children = childCategories.filter(
                (child) => child.parent === cat.id
              );
              return (
                <View key={cat.id} className="bg-gray-50 p-3 rounded mb-2">
                  <Text className="text-sm font-medium">
                    {cat.name} (ID: {cat.id})
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Slug: {cat.slug} | Products: {cat.count}
                  </Text>
                  {children.length > 0 && (
                    <View className="ml-3 mt-2">
                      <Text className="text-xs text-green-600 font-medium">
                        Children ({children.length}):
                      </Text>
                      {children.map((child) => (
                        <Text key={child.id} className="text-xs text-gray-600">
                          • {child.name} (ID: {child.id})
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {/* Orphaned Categories */}
            {childCategories.filter(
              (cat) => !parentCategories.find((p) => p.id === cat.parent)
            ).length > 0 && (
              <View className="mt-4">
                <Text className="font-medium text-orange-600 mb-2">
                  Orphaned Categories:
                </Text>
                {childCategories
                  .filter(
                    (cat) => !parentCategories.find((p) => p.id === cat.parent)
                  )
                  .map((cat) => (
                    <View
                      key={cat.id}
                      className="bg-orange-50 p-2 rounded mb-1"
                    >
                      <Text className="text-sm">
                        {cat.name} (ID: {cat.id}, Parent: {cat.parent})
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
