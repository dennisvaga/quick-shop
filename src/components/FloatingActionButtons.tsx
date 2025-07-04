/**
 * Floating Action Buttons Component
 * Reusable component for product action buttons that animate with the GlobalTabBar
 * Stacks above tab bar when visible, moves to bottom when tab bar disappears
 */

import * as React from "react";
import { Pressable, Animated, View, Platform } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useTabBar } from "~/context/TabBarContext";
import { useTabBarDimensions } from "~/hooks/useTabBarDimensions";
import { useAndroidNavigation } from "~/hooks/useAndroidNavigation";
import { HeartIcon } from "lucide-react-native";

interface FloatingActionButtonsProps {
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  addToCartText?: string;
}

export function FloatingActionButtons({
  onAddToCart,
  onAddToWishlist,
  addToCartText = "הוסף לעגלה",
}: FloatingActionButtonsProps) {
  const { tabBarTranslateY } = useTabBar();
  const { height, paddingBottom } = useTabBarDimensions();
  const { hasTraditionalNavigation, isAndroid } = useAndroidNavigation();

  // Create animation for floating buttons
  // When tabBar is visible (translateY: 0) → buttons above tab bar (translateY: -80)
  // When tabBar is hidden (translateY: 100) → buttons at bottom (translateY: 0)
  const floatingButtonTranslateY = tabBarTranslateY.interpolate({
    inputRange: [0, 140], // Buttons offset
    outputRange: [-100, 0], // Start above tab bar, end at bottom
    extrapolate: "clamp",
  });

  // Extra space needed below buttons for Android 3-button navigation
  const androidNavBuffer = isAndroid && hasTraditionalNavigation ? 0 : -15;

  return (
    <Animated.View
      className="absolute left-0 right-0"
      style={{
        bottom: Platform.OS === "android" ? androidNavBuffer : 5,
        paddingTop: 12,
        paddingBottom: paddingBottom,
        paddingHorizontal: 16,
        zIndex: 11, // Higher than tab bar
        transform: [{ translateY: floatingButtonTranslateY }],
      }}
    >
      {/* Button Container */}
      <View className="flex-row gap-3 items-center">
        {/* Primary Action Button */}
        <Button
          onPress={onAddToCart}
          className="flex-1 bg-black py-4 rounded-full"
        >
          <Text className="text-white font-bold text-lg">{addToCartText}</Text>
        </Button>

        {/* Secondary Action Button */}
        <Pressable
          onPress={onAddToWishlist}
          className="w-[3.2rem] h-[3.2rem] border border-gray-300 rounded-full items-center justify-center bg-white"
        >
          <HeartIcon size={20} color="#666" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
