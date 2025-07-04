import React from "react";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  Search,
} from "lucide-react-native";

interface IconProps {
  color: string;
  size: number;
}

// Home Icon - Minimal house outline
export function HomeIcon({ color, size }: IconProps) {
  return <Home color={color} size={size} strokeWidth={2} />;
}

// Shop Icon - Minimal shopping bag outline
export function ShopIcon({ color, size }: IconProps) {
  return <ShoppingBag color={color} size={size} strokeWidth={2} />;
}

// Cart Icon - Minimal shopping cart outline
export function CartIcon({ color, size }: IconProps) {
  return <ShoppingCart color={color} size={size} strokeWidth={2} />;
}

// Heart Icon - Minimal heart outline
export function HeartIcon({ color, size }: IconProps) {
  return <Heart color={color} size={size} strokeWidth={2} />;
}

// User Icon - Minimal user outline
export function UserIcon({ color, size }: IconProps) {
  return <User color={color} size={size} strokeWidth={2} />;
}

// Search Icon - Minimal search outline
export function SearchIcon({ color, size }: IconProps) {
  return <Search color={color} size={size} strokeWidth={2} />;
}
