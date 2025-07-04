/**
 * Custom hook for tab bar dimension calculations
 * Centralizes the platform-specific height and padding logic
 * Used by both GlobalTabBar and FloatingActionButtons for consistency
 *
 * Copy-paste ready - no external dependencies needed beyond react-native-safe-area-context
 */
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAndroidNavigation } from "./useAndroidNavigation";

interface TabBarDimensions {
  height: number;
  paddingBottom: number;
  totalSpace: number; // height + paddingBottom for PageContainer calculations
  bottomOffset: number; // Space from bottom of screen
}

export function useTabBarDimensions(): TabBarDimensions {
  const insets = useSafeAreaInsets();
  const { hasTraditionalNavigation } = useAndroidNavigation();

  if (Platform.OS === "ios") {
    return {
      height: 70,
      paddingBottom: 2,
      totalSpace: 72,
      bottomOffset: 28,
    };
  }

  // Android logic - use navigation detection from useAndroidNavigation
  if (hasTraditionalNavigation) {
    // Traditional navigation - need manual spacing above nav buttons
    return {
      height: 60,
      paddingBottom: 5,
      totalSpace: 72,
      bottomOffset: 40,
    };
  } else {
    // Gesture navigation - use safe area insets
    const calculatedPadding = Math.max(insets.bottom - 20, 8);
    return {
      height: 65,
      paddingBottom: calculatedPadding,
      totalSpace: 60 + calculatedPadding,
      bottomOffset: 25,
    };
  }
}
