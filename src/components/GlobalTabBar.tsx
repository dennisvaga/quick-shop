import { router, usePathname } from "expo-router";
import React from "react";
import {
  Animated,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { useTabBar } from "~/context/TabBarContext";
import { useCart } from "~/features/cart/hooks/useCart";
import { useTabBarDimensions } from "~/hooks/useTabBarDimensions";
import {
  CartIcon,
  HeartIcon,
  HomeIcon,
  ShopIcon,
  UserIcon,
} from "~/lib/icons/TabIcons";

interface TabItem {
  name: string;
  title: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  route: string;
}

const tabs: TabItem[] = [
  {
    name: "index",
    title: "הבית",
    icon: HomeIcon,
    route: "/(tabs)/",
  },
  {
    name: "catalog",
    title: "קטלוג",
    icon: ShopIcon,
    route: "/(tabs)/catalog",
  },
  {
    name: "cart",
    title: "עגלה",
    icon: CartIcon,
    route: "/(tabs)/cart",
  },
  {
    name: "wishlist",
    title: "מועדפים",
    icon: HeartIcon,
    route: "/(tabs)/wishlist",
  },
  {
    name: "account",
    title: "חשבון",
    icon: UserIcon,
    route: "/(tabs)/account",
  },
];

export function GlobalTabBar() {
  const { tabBarTranslateY, tabBarOpacity } = useTabBar();
  const { cart } = useCart();
  const pathname = usePathname();
  const { height, paddingBottom, bottomOffset } = useTabBarDimensions();

  const cartItems = cart?.items?.length || 0;

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    // Handle home tab routes
    if (pathname === "/" || pathname === "/index") {
      return "index";
    }

    // Handle other tab routes
    if (pathname === "/catalog") {
      return "catalog";
    }
    if (pathname === "/cart") {
      return "cart";
    }
    if (pathname === "/wishlist") {
      return "wishlist";
    }
    if (pathname === "/account") {
      return "account";
    }

    // For non-tab routes, don't highlight any tab
    return null;
  };

  const activeTab = getActiveTab();

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <>
      {/* Background fill for the space below the floating tab bar */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: bottomOffset,
          backgroundColor: "hsl(0, 0%, 97%)", // Background below the tab bar
          transform: [{ translateY: tabBarTranslateY }],
          opacity: tabBarOpacity,
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          bottom: bottomOffset, // Use calculated offset
          left: 0,
          right: 0,
          height: height,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingBottom: paddingBottom,
          paddingTop: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          transform: [{ translateY: tabBarTranslateY }],
          opacity: tabBarOpacity,
          elevation: 0, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          ...(Platform.OS === "android" && {
            shadowOpacity: 0,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 0,
          }),
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const IconComponent = tab.icon;

          return (
            <TouchableWithoutFeedback
              key={tab.name}
              onPress={() => handleTabPress(tab.route)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <IconComponent
                  color={isActive ? "#000000" : "#9ca3af"}
                  size={24}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "System",
                    fontWeight: "500",
                    color: isActive ? "#000000" : "#9ca3af",
                    marginTop: 2,
                  }}
                >
                  {tab.title}
                </Text>
                {tab.name === "cart" && cartItems > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: "30%",
                      backgroundColor: "#ef4444",
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {cartItems}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </Animated.View>
    </>
  );
}
