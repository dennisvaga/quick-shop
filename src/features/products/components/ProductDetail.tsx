/**
 * Mobile Product Detail Page Component
 * Extracted from route file for better organization and reusability
 */

import * as React from "react";
import { Dimensions, Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Product } from "~/features/products/types/product";
const { width: screenWidth } = Dimensions.get("window");

interface ProductDetailPageProps {
  product: Product;
  onAddToCart?: (
    productId: number,
    size: string | null,
    quantity: number
  ) => void;
  onAddToWishlist?: (productId: number) => void;
  onSelectionChange?: (size: string | null, quantity: number) => void;
}

export default function ProductDetail({
  product,
  onAddToCart,
  onAddToWishlist,
  onSelectionChange,
}: ProductDetailPageProps) {
  const insets = useSafeAreaInsets();

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Notify parent when selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedSize, quantity);
    }
  }, [selectedSize, quantity, onSelectionChange]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, selectedSize, quantity);
    } else {
      // Default implementation
      console.log("Add to cart:", {
        product: product.name,
        size: selectedSize,
        quantity,
      });
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    } else {
      // Default implementation
      console.log("Add to wishlist:", product.name);
    }
  };

  // Handle image scroll
  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / screenWidth);
    setSelectedImageIndex(imageIndex);
  };

  const images = product.images || [];

  // Mock size options (in real app, this would come from product variations)
  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  return (
    <View className="flex-1 bg-gray-50 relative">
      {/* Product Images - Swipeable Gallery */}
      <View className="bg-gray-50 relative">
        {/* Swipeable Image Gallery */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleImageScroll}
          style={{ height: screenWidth * 1.3 }}
        >
          {images.map((image: { id: number; src: string }, index: number) => (
            <View key={image.id} style={{ width: screenWidth }}>
              <Image
                source={{ uri: image.src }}
                style={{
                  width: screenWidth,
                  height: screenWidth * 1.3,
                  resizeMode: "contain",
                }}
              />
            </View>
          ))}
        </ScrollView>

        {/* NEW Badge */}
        {product.date_created &&
          new Date(product.date_created) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <View className="absolute top-4 right-12 bg-black px-3 py-1 rounded-full z-10">
              <Text className="text-white text-xs font-bold">חדש!</Text>
            </View>
          )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {images.map((_: any, index: number) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === selectedImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-4">
        {/* Product Name */}
        <Text className="text-2xl font-bold text-gray-900 mb-2 ">
          {product.name}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center mb-3">
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} className="text-yellow-400 text-lg">
                ★
              </Text>
            ))}
          </View>
          <Text className="text-gray-600 mr-2">(9)</Text>
        </View>

        {/* Price */}
        <View className="flex-row items-center mb-4">
          <Text className="text-3xl font-bold text-gray-900">
            ₪{product.price}
          </Text>
          {product.regular_price && product.regular_price !== product.price && (
            <Text className="text-lg text-gray-500 line-through mr-3">
              ₪{product.regular_price}
            </Text>
          )}
        </View>

        {/* Sale Banner */}
        {product.sale_price && product.sale_price !== product.price && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700 font-semibold text-center">
              מבצע מיוחד! חסכי עד 80%
            </Text>
          </View>
        )}

        {/* Size Selection */}
        <View className="mb-6">
          <View className="flex-row items-center justify-right gap-8 mb-3">
            <Text className="text-lg font-semibold">מידה</Text>
            <Pressable>
              <Text className="text-blue-600 underline">מדריך מידות</Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <Pressable
                key={size}
                onPress={() => setSelectedSize(size)}
                className={`px-4 py-3 border rounded-lg min-w-[50px] items-center ${
                  selectedSize === size
                    ? "border-black bg-black"
                    : "border-gray-300 bg-white"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedSize === size ? "text-white" : "text-gray-900"
                  }`}
                >
                  {size}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quantity Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 ">כמות</Text>
          <View className="flex-row items-center">
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center"
            >
              <Text className="text-xl font-bold">-</Text>
            </Pressable>
            <Text className="mx-4 text-lg font-semibold min-w-[30px] text-center">
              {quantity}
            </Text>
            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-gray-300 rounded-lg items-center justify-center"
            >
              <Text className="text-xl font-bold">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Spacer for floating buttons */}
        <View className="h-20" />

        {/* Product Description */}
        {product.description && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Text className="text-lg font-semibold mb-2 ">תיאור המוצר</Text>
              <Text className="text-gray-700 leading-6">
                {product.description.replace(/<[^>]*>/g, "")}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Text className="text-lg font-semibold mb-3 ">מידע נוסף</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">קוד מוצר:</Text>
                <Text className="font-medium">{product.id}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">זמינות:</Text>
                <Text className="font-medium text-green-600">במלאי</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">משלוח:</Text>
                <Text className="font-medium">משלוח חינם מעל ₪200</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
