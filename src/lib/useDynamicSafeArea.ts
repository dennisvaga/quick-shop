import { Platform, Dimensions } from "react-native";
import { useState, useEffect } from "react";

/**
 * Simplified hook for Android navigation bar detection only
 * Header safe areas are now handled by OS-native useSafeAreaInsets
 */
export function useDynamicSafeArea() {
  const [navigationHeight, setNavigationHeight] = useState(0);

  useEffect(() => {
    // Only needed for Android tab bar adjustment
    if (Platform.OS !== "android") return;

    const updateNavigation = () => {
      const screen = Dimensions.get("screen");
      const window = Dimensions.get("window");
      const navHeight = screen.height - window.height;
      setNavigationHeight(navHeight);
    };

    updateNavigation();
    const subscription = Dimensions.addEventListener(
      "change",
      updateNavigation
    );
    return () => subscription?.remove();
  }, []);

  return {
    navigationHeight,
    debug: {
      navigationHeight,
      platform: Platform.OS,
    },
  };
}
