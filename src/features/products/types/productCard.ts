/**
 * Mobile-specific product card variants and types
 * Optimized for mobile touch interactions and screen sizes
 */

export enum ProductCardVariants {
  grid = "grid", // 2-column mobile grid
  list = "list", // Single column list view
  detail = "detail", // Product detail page skeleton
}

export interface MobileProductCardProps {
  variant?: ProductCardVariants;
  onPress?: () => void;
  onLongPress?: () => void;
  showAddToCart?: boolean;
}
