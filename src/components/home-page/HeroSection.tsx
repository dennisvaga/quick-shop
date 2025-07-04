/**
 * Hero Banner Component for Home Page
 * Static hero image with full width and 80vh height
 */

import * as React from "react";
import { Dimensions, Image, View } from "react-native";
import { cn } from "~/utils/utils";

const { height: screenHeight } = Dimensions.get("window");

interface HeroCarouselProps {
  className?: string;
}

export function HeroSection({ className }: HeroCarouselProps) {
  const heroHeight = screenHeight * 0.3;

  return (
    <View className={cn("w-full", className)} style={{ height: heroHeight }}>
      <Image
        source={require("~/assets/hero-banners/hero-banner.jpg")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}
