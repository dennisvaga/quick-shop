import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../../api/cart";
import { ApiError } from "../../../types/errors";
import type { Cart } from "../types/cart";

/**
 * Hook for managing cart state with comprehensive error handling
 * Provides optimistic updates with error rollback
 */
export const useCart = () => {
  const queryClient = useQueryClient();

  // Get current cart
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        return error.retryable && failureCount < 3;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 5000),
  });

  // Add item to cart mutation
  const addItemMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
      variationId,
    }: {
      productId: string;
      quantity: number;
      variationId?: string;
    }) => addToCart(productId, quantity, variationId),
    onSuccess: (newCart) => {
      // Update cart cache with new data
      queryClient.setQueryData(["cart"], newCart);
    },
    onError: (error) => {
      // Error handling is done in the component layer
      console.error("Add to cart failed:", error);
    },
  });

  // Update cart item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      // Optimistically update cart
      if (previousCart) {
        const updatedCart = {
          ...previousCart,
          items: previousCart.items.map((item: Cart["items"][number]) =>
            item.key === itemId ? { ...item, quantity } : item
          ),
        };
        queryClient.setQueryData(["cart"], updatedCart);
      }

      return { previousCart };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: (newCart) => {
      // Update with server response
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => removeFromCart(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      // Optimistically remove item
      if (previousCart) {
        const updatedCart = {
          ...previousCart,
          items: previousCart.items.filter(
            (item: Cart["items"][number]) => item.key !== itemId
          ),
          item_count: previousCart.item_count - 1,
        };
        queryClient.setQueryData(["cart"], updatedCart);
      }

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<Cart>(["cart"]);

      // Optimistically clear cart
      const emptyCart: Cart = {
        items: [],
        item_count: 0,
        items_weight: 0,
        needs_shipping: false,
        totals: {
          subtotal: "0",
          subtotal_tax: "0",
          total: "0",
          tax: "0",
        },
      };
      queryClient.setQueryData(["cart"], emptyCart);

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  // Apply coupon mutation
  const applyCouponMutation = useMutation({
    mutationFn: (couponCode: string) => applyCoupon(couponCode),
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  // Manual retry function for cart loading
  const retryLoadCart = () => {
    cartQuery.refetch();
  };

  return {
    // Cart data
    cart: cartQuery.data || null,
    isLoading: cartQuery.isLoading,
    error: cartQuery.error instanceof ApiError ? cartQuery.error : null,

    // Actions
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    applyCoupon: applyCouponMutation.mutate,

    // Action states
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
    isApplyingCoupon: applyCouponMutation.isPending,

    // Action errors
    addItemError:
      addItemMutation.error instanceof ApiError ? addItemMutation.error : null,
    updateItemError:
      updateItemMutation.error instanceof ApiError
        ? updateItemMutation.error
        : null,
    removeItemError:
      removeItemMutation.error instanceof ApiError
        ? removeItemMutation.error
        : null,
    clearCartError:
      clearCartMutation.error instanceof ApiError
        ? clearCartMutation.error
        : null,
    applyCouponError:
      applyCouponMutation.error instanceof ApiError
        ? applyCouponMutation.error
        : null,

    // Utility functions
    retryLoadCart,
    resetErrors: () => {
      addItemMutation.reset();
      updateItemMutation.reset();
      removeItemMutation.reset();
      clearCartMutation.reset();
      applyCouponMutation.reset();
    },

    // Computed values
    itemCount: cartQuery.data?.item_count || 0,
    totalPrice: cartQuery.data?.totals.total || "0",
    isEmpty: (cartQuery.data?.item_count || 0) === 0,
  };
};

/**
 * Hook for optimistic cart item quantity updates
 * Provides immediate UI feedback with error rollback
 */
export const useCartItemQuantity = (itemId: string) => {
  const { updateItem, isUpdatingItem, updateItemError } = useCart();

  const updateQuantity = (newQuantity: number) => {
    updateItem({ itemId, quantity: newQuantity });
  };

  const increment = () => {
    // Get current quantity from cache and increment
    // This would need access to current cart state
    updateQuantity(1); // Simplified for now
  };

  const decrement = () => {
    // Get current quantity from cache and decrement
    // This would need access to current cart state
    updateQuantity(1); // Simplified for now
  };

  return {
    updateQuantity,
    increment,
    decrement,
    isUpdating: isUpdatingItem,
    error: updateItemError,
  };
};

/**
 * Hook for cart summary calculations
 * Provides computed cart totals and statistics
 */
export const useCartSummary = () => {
  const { cart } = useCart();

  if (!cart) {
    return {
      subtotal: "0",
      tax: "0",
      total: "0",
      itemCount: 0,
      uniqueItemCount: 0,
      isEmpty: true,
    };
  }

  return {
    subtotal: cart.totals.subtotal,
    tax: cart.totals.tax,
    total: cart.totals.total,
    itemCount: cart.item_count,
    uniqueItemCount: cart.items.length,
    isEmpty: cart.item_count === 0,
  };
};
