import React from "react";
import { View, TextInput } from "react-native";
import { SearchIcon } from "~/lib/icons/TabIcons";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "חפשי מוצרים...",
  value,
  onChangeText,
  className = "",
}: SearchBarProps) {
  return (
    <View className={`px-4 py-3 bg-white ${className}`}>
      <View className="bg-gray-100 rounded-full px-5 py-3 flex-row items-center">
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-base text-right"
          textAlign="right"
        />
        <View className="ml-2">
          <SearchIcon color="#9ca3af" size={20} />
        </View>
      </View>
    </View>
  );
}
