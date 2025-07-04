/**
 * Mobile Product components for React Native
 * Optimized for touch interactions and mobile performance
 */

import * as React from "react";
import { Image, Pressable } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { cn } from "~/utils/utils";

// Product Image Component for React Native
export function ProductImage({
  src,
  hoverSrc,
  onPress,
  className,
  style,
}: {
  src: string;
  hoverSrc?: string;
  onPress?: () => void;
  className?: string;
  style?: any;
}) {
  // Use blank image fallback for empty/invalid URIs
  const imageSource =
    src && src.trim() !== ""
      ? { uri: src }
      : require("~/assets/images/blankImage.jpg");

  return (
    <Pressable
      onPress={onPress}
      className={cn("relative overflow-hidden", className)}
      style={[{ aspectRatio: 3 / 5 }, style]}
    >
      <Image
        source={imageSource}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
        }}
        className="rounded-none"
      />
    </Pressable>
  );
}

// Product Name Component
export function ProductName({
  name,
  onPress,
  className,
}: {
  name: string;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <Pressable onPress={onPress}>
      <Text className={cn("text-sm font-medium text-center", className)}>
        {name}
      </Text>
    </Pressable>
  );
}

// Product Price Component
export function ProductPrice({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  return (
    <Text className={cn("text-lg font-semibold text-center", className)}>
      ₪{price}
    </Text>
  );
}

// Add to Cart Button Component
export function ProductAddToCartButton({
  onPress,
  className,
  variant = "default",
}: {
  onPress: () => void;
  className?: string;
  variant?: "default" | "icon";
}) {
  return (
    <Button
      onPress={onPress}
      className={cn("mt-2", className)}
      variant={variant === "icon" ? "outline" : "default"}
    >
      <Text>{variant === "icon" ? "🛒" : "הוסף לעגלה"}</Text>
    </Button>
  );
}

// Product Description Component
export function ProductDescription({
  description,
  className,
}: {
  description: string;
  className?: string;
}) {
  return (
    <Text className={cn("text-sm text-muted-foreground", className)}>
      {description}
    </Text>
  );
}
