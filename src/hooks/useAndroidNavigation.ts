/**
 * Android Navigation Detection Hook
 * Detects Android navigation type (3-button vs gesture navigation)
 * Provides reusable navigation information across components
 *
 * Usage:
 * const { hasTraditionalNavigation, isGestureNavigation, androidNavHeight } = useAndroidNavigation();
 */
import { Platform, Dimensions, StatusBar } from "react-native";
import { useState, useEffect } from "react";

interface AndroidNavigationInfo {
  androidNavHeight: number;
  hasTraditionalNavigation: boolean;
  isGestureNavigation: boolean;
  isAndroid: boolean;
}

export function useAndroidNavigation(): AndroidNavigationInfo {
  const [androidNavHeight, setAndroidNavHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === "android") {
      // Calculate Android navigation bar height
      const screenHeight = Dimensions.get("screen").height;
      const windowHeight = Dimensions.get("window").height;
      const statusBarHeight = StatusBar.currentHeight || 0;
      const navHeight = Math.max(
        screenHeight - windowHeight - statusBarHeight,
        0
      );

      setAndroidNavHeight(navHeight);
    }
  }, []);

  // Traditional navigation: usually 30-48px height
  // Gesture navigation: usually 0-10px height
  const hasTraditionalNavigation =
    Platform.OS === "android" && androidNavHeight >= 30;
  const isGestureNavigation =
    Platform.OS === "android" && !hasTraditionalNavigation;
  const isAndroid = Platform.OS === "android";

  return {
    androidNavHeight,
    hasTraditionalNavigation,
    isGestureNavigation,
    isAndroid,
  };
}
