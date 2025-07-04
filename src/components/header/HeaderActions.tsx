/**
 * Header Actions Container Component
 * Provides consistent spacing and layout for header action buttons
 */

import * as React from "react";
import { View } from "react-native";

interface HeaderActionsProps {
  children: React.ReactNode;
  spacing?: number;
}

export const HeaderActions = ({
  children,
  spacing = 12,
}: HeaderActionsProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing,
      }}
    >
      {children}
    </View>
  );
};
