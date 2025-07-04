/**
 * Cart Header Button Component
 * Displays shopping bag icon with item count badge
 */

import { router } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useCart } from "~/features/cart/hooks/useCart";

export const CartButton = () => {
  // Get cart item count from shared hook
  const { itemCount } = useCart();

  const handlePress = () => {
    router.push("/cart");
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{ padding: 8, position: "relative" }}
      className="active:opacity-70"
    >
      <ShoppingBag color="#000" size={24} strokeWidth={2} />
      {itemCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-black rounded-full min-w-5 h-5 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {itemCount > 99 ? "99+" : itemCount.toString()}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
