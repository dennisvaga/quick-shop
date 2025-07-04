import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

interface SectionContainerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionContainer({
  title,
  children,
  className = "",
}: SectionContainerProps) {
  return (
    <View className={`px-4 mb-6 ${className}`}>
      {title && (
        <Text className="text-xl font-semibold text-gray-900 mb-4 text-right">
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}
