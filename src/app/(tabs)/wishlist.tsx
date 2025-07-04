/**
 * Wishlist Tab - Saved favorite products
 */

import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { PageContainer } from "~/layout/PageContainer";

export default function WishlistTab() {
  const navigateToCatalog = () => {
    router.push("/catalog" as any);
  };

  return (
    <PageContainer isTabScreen={true} className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 bg-white border-b border-gray-100">
        <Text className="text-3xl font-light text-center text-gray-900">
          המועדפים שלי
        </Text>
        <Text className="text-base text-center text-gray-600 mt-2 leading-relaxed">
          הפריטים שאהבת ושמרת
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        {/* Empty State - TODO: Replace with actual wishlist functionality */}
        <View className="flex-1 justify-center items-center py-16">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                רשימת המועדפים ריקה
              </CardTitle>
            </CardHeader>
            <CardContent className="items-center">
              <Text className="text-center text-gray-600 mb-6 leading-relaxed">
                עדיין לא שמרת פריטים למועדפים. גלי את הקולקציה שלנו ושמרי את
                הפריטים שאת הכי אוהבת!
              </Text>
              <Button onPress={navigateToCatalog} className="w-full">
                <Text className="text-white font-medium">עברי לקטלוג</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>
    </PageContainer>
  );
}
