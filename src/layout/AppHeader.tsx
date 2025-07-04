import { router } from "expo-router";
import React from "react";
import { Image, Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showCart?: boolean;
  onCartPress?: () => void;
}

export default function AppHeader({
  title,
  showBack = false,
  onBackPress,
  showCart = false,
  onCartPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      router.push("/cart");
    }
  };

  return (
    <View
      className="flex-row justify-between items-center bg-white border-b border-gray-100"
      style={{
        paddingTop: Platform.OS === "android" ? insets.top : 0, // Only Android needs manual padding
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        minHeight: 44,
      }}
    >
      {/* Left side - Back button or spacer */}
      <View className="w-10">
        {showBack && (
          <Pressable onPress={handleBackPress} className="p-2">
            <Text className="text-2xl">←</Text>
          </Pressable>
        )}
      </View>

      {/* Center - Title or Logo */}
      <View className="flex-1 items-center">
        {title ? (
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <Image
            source={require("~/assets/logo.png")}
            style={{ width: 160, height: 50 }}
            resizeMode="contain"
          />
        )}
      </View>

      {/* Right side - Cart button or spacer */}
      <View className="w-10">
        {showCart && (
          <Pressable onPress={handleCartPress} className="p-2">
            <Text className="text-2xl">🛒</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
