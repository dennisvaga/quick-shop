import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";

interface CategoryItemProps {
  id: string;
  name: string;
  style?: "normal" | "new" | "sale";
  onPress: () => void;
}

export default function CategoryItem({
  id,
  name,
  style = "normal",
  onPress,
}: CategoryItemProps) {
  const textStyles = {
    normal: "text-gray-900",
    new: "text-blue-600",
    sale: "text-red-600",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="py-4 px-4 border-b border-gray-100 bg-white"
    >
      <View className="flex-row items-center justify-start">
        <Text className={`text-base font-medium ${textStyles[style]}`}>
          {name}
        </Text>
        <Text className="text-gray-400 text-lg ml-2">‹</Text>
      </View>
    </TouchableOpacity>
  );
}
