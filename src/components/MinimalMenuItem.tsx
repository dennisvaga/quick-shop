import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";

interface MinimalMenuItemProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  style?: "normal" | "primary";
}

export function MinimalMenuItem({
  title,
  subtitle,
  onPress,
  style = "normal",
}: MinimalMenuItemProps) {
  const textStyles = {
    normal: "text-gray-900",
    primary: "text-blue-600",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="py-4 px-4 border-b border-gray-100 bg-white"
    >
      <View className="flex-row items-center justify-start">
        <View>
          {/* Title*/}
          <View className="flex flex-row mt-1">
            <Text className={`text-base font-medium ${textStyles[style]}`}>
              {title}
            </Text>
            <Text className="text-gray-400 text-lg ml-2">‹</Text>
          </View>

          {/* Subtitle */}
          {subtitle && (
            <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
