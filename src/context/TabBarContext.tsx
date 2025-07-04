import React, { createContext, useContext, useRef, useState } from "react";
import { Animated } from "react-native";

interface TabBarContextType {
  // Animation values
  tabBarTranslateY: Animated.Value;
  tabBarOpacity: Animated.Value;

  // State
  isTabBarVisible: boolean;

  // Methods
  showTabBar: () => void;
  hideTabBar: () => void;
  handleScroll: (event: any, isTabScreen?: boolean) => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

interface TabBarProviderProps {
  children: React.ReactNode;
}

export function TabBarProvider({ children }: TabBarProviderProps) {
  // Animation values
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const tabBarOpacity = useRef(new Animated.Value(1)).current;

  // State
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  // Scroll tracking
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("up");

  const showTabBar = () => {
    if (!isTabBarVisible) {
      setIsTabBarVisible(true);
      Animated.parallel([
        Animated.timing(tabBarTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const hideTabBar = () => {
    if (isTabBarVisible) {
      setIsTabBarVisible(false);
      Animated.parallel([
        Animated.timing(tabBarTranslateY, {
          toValue: 100, // Height of tab bar + some padding
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleScroll = (event: any, isTabScreen: boolean = false) => {
    // If it's a tab screen, always keep the tab bar visible
    if (isTabScreen) {
      showTabBar();
      return;
    }

    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDelta = currentScrollY - lastScrollY.current;

    // Determine scroll direction
    if (scrollDelta > 0) {
      scrollDirection.current = "down";
    } else if (scrollDelta < 0) {
      scrollDirection.current = "up";
    }

    // Show/hide logic for non-tab screens
    if (currentScrollY <= 0) {
      // At the top, always show
      showTabBar();
    } else if (Math.abs(scrollDelta) > 5) {
      // Only react to significant scroll movements
      if (scrollDirection.current === "down" && currentScrollY > 50) {
        hideTabBar();
      } else if (scrollDirection.current === "up") {
        showTabBar();
      }
    }

    lastScrollY.current = currentScrollY;
  };

  const value: TabBarContextType = {
    tabBarTranslateY,
    tabBarOpacity,
    isTabBarVisible,
    showTabBar,
    hideTabBar,
    handleScroll,
  };

  return (
    <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (context === undefined) {
    throw new Error("useTabBar must be used within a TabBarProvider");
  }
  return context;
}
