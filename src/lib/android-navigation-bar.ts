import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  // Early return for non-Android platforms
  if (Platform.OS !== "android") return;

  try {
    // Only call Android-specific APIs on Android platform
    // Wrapped in try-catch to handle any potential issues gracefully
    await NavigationBar.setButtonStyleAsync(
      theme === "dark" ? "light" : "dark"
    );
    await NavigationBar.setBackgroundColorAsync(
      theme === "dark" ? NAV_THEME.dark.background : NAV_THEME.light.background
    );
  } catch (error) {
    // Silently handle errors - these APIs might not be available in all Android versions
    // or development environments. The app should continue to work without navigation bar styling.
    if (__DEV__) {
      console.log("Android navigation bar styling not available:", error);
    }
  }
}
