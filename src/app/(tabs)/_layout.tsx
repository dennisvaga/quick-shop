import { Tabs } from "expo-router";
import { useCart } from "~/features/cart/hooks/useCart";
import {
  CartIcon,
  HeartIcon,
  HomeIcon,
  ShopIcon,
  UserIcon,
} from "~/lib/icons/TabIcons";

export default function TabLayout() {
  const { cart } = useCart();
  const cartItems = cart?.items?.length || 0;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: "none", // Hide the original tab bar since we're using GlobalTabBar
        },
        headerShown: false,
      }}
    >
      {/* Hebrew RTL tab order - home to account (right to left) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "הבית",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "קטלוג",
          tabBarIcon: ({ color, size }) => (
            <ShopIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "עגלה",
          tabBarIcon: ({ color, size }) => (
            <CartIcon color={color} size={size} />
          ),
          tabBarBadge: cartItems > 0 ? cartItems : undefined,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "מועדפים",
          tabBarIcon: ({ color, size }) => (
            <HeartIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "חשבון",
          tabBarIcon: ({ color, size }) => (
            <UserIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
