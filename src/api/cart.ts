import { Cart } from "../features/cart/types/cart";
import { ApiError } from "../types/errors";
import { apiClient } from "./client";

// Use the pre-configured API client from client.ts
// No need to duplicate environment configuration here

// Helper function to transform WooCommerce cart data
const transformCart = (rawCart: any): Cart => {
  return {
    items:
      rawCart.items?.map((item: any) => ({
        key: item.key || item.id?.toString() || "",
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totals: {
          subtotal: item.totals?.subtotal || "0",
          subtotal_tax: item.totals?.subtotal_tax || "0",
          total: item.totals?.total || "0",
          tax: item.totals?.tax || "0",
        },
        variation: item.variation || undefined,
        image: item.image
          ? {
              id: item.image.id,
              src: item.image.src,
              alt: item.image.alt || "",
            }
          : undefined,
      })) || [],
    item_count: rawCart.items_count || rawCart.item_count || 0,
    items_weight: rawCart.items_weight,
    needs_shipping: rawCart.needs_shipping || false,
    totals: {
      subtotal: rawCart.totals?.subtotal || "0",
      subtotal_tax: rawCart.totals?.subtotal_tax || "0",
      total: rawCart.totals?.total || "0",
      tax: rawCart.totals?.tax || "0",
    },
  };
};

// Add item to cart
export const addToCart = async (
  productId: string,
  quantity: number,
  variationId?: string
): Promise<Cart> => {
  try {
    // Input validation
    if (quantity <= 0) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "כמות המוצר חייבת להיות גדולה מאפס",
        400,
        false,
        { productId, quantity }
      );
    }

    if (!productId || productId.trim() === "") {
      throw new ApiError("VALIDATION_ERROR", "מזהה המוצר חסר", 400, false, {
        productId,
        quantity,
      });
    }

    const client = apiClient;
    const response = await client.post(
      "/wp-json/wc/v3/cart/add-item",
      {
        id: productId,
        quantity,
        ...(variationId && { variation_id: variationId }),
      },
      {
        signal: AbortSignal.timeout(10000),
      }
    );

    return transformCart(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, productId, quantity, variationId };
      throw error;
    }

    // Handle Axios errors with response data
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as any;
      const errorData = axiosError.response?.data;

      // Convert WooCommerce errors to user-friendly messages
      if (axiosError.response?.status === 400) {
        if (errorData?.message?.includes("stock")) {
          throw new ApiError(
            "OUT_OF_STOCK",
            "המוצר לא זמין במלאי בכמות המבוקשת",
            400,
            false,
            { productId, requestedQuantity: quantity }
          );
        }

        if (errorData?.message?.includes("not found")) {
          throw new ApiError(
            "PRODUCT_NOT_FOUND",
            "המוצר לא נמצא או לא זמין יותר",
            404,
            false,
            { productId }
          );
        }
      }
    }

    throw new ApiError(
      "UNKNOWN_ERROR",
      "שגיאה בהוספת המוצר לעגלה",
      500,
      false,
      { productId, quantity, originalError: error }
    );
  }
};

// Update cart item quantity
export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<Cart> => {
  try {
    // Input validation
    if (quantity < 0) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "כמות המוצר לא יכולה להיות שלילית",
        400,
        false,
        { itemId, quantity }
      );
    }

    if (!itemId || itemId.trim() === "") {
      throw new ApiError("VALIDATION_ERROR", "מזהה הפריט חסר", 400, false, {
        itemId,
        quantity,
      });
    }

    const client = apiClient;

    // If quantity is 0, remove the item
    if (quantity === 0) {
      return await removeFromCart(itemId);
    }

    const response = await client.put(
      `/wp-json/wc/v3/cart/items/${itemId}`,
      { quantity },
      {
        signal: AbortSignal.timeout(10000),
      }
    );

    return transformCart(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, itemId, quantity };
      throw error;
    }

    // Handle specific cart errors
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as any;

      if (axiosError.response?.status === 404) {
        throw new ApiError("INVALID_CART", "הפריט לא נמצא בעגלה", 404, false, {
          itemId,
        });
      }

      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response?.data;
        if (errorData?.message?.includes("stock")) {
          throw new ApiError(
            "OUT_OF_STOCK",
            "הכמות המבוקשת לא זמינה במלאי",
            400,
            false,
            { itemId, requestedQuantity: quantity }
          );
        }
      }
    }

    throw new ApiError("UNKNOWN_ERROR", "שגיאה בעדכון העגלה", 500, false, {
      itemId,
      quantity,
      originalError: error,
    });
  }
};

// Remove item from cart
export const removeFromCart = async (itemId: string): Promise<Cart> => {
  try {
    if (!itemId || itemId.trim() === "") {
      throw new ApiError("VALIDATION_ERROR", "מזהה הפריט חסר", 400, false, {
        itemId,
      });
    }

    const client = apiClient;
    const response = await client.delete(
      `/wp-json/wc/v3/cart/items/${itemId}`,
      {
        signal: AbortSignal.timeout(10000),
      }
    );

    return transformCart(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, itemId };
      throw error;
    }

    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as any;

      if (axiosError.response?.status === 404) {
        throw new ApiError("INVALID_CART", "הפריט לא נמצא בעגלה", 404, false, {
          itemId,
        });
      }
    }

    throw new ApiError(
      "UNKNOWN_ERROR",
      "שגיאה בהסרת המוצר מהעגלה",
      500,
      false,
      { itemId, originalError: error }
    );
  }
};

// Get current cart
export const getCart = async (): Promise<Cart> => {
  try {
    const client = apiClient;
    const response = await client.get("/wp-json/wc/v3/cart", {
      signal: AbortSignal.timeout(10000),
    });

    return transformCart(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, endpoint: "/cart" };
      throw error;
    }

    throw new ApiError(
      "UNKNOWN_ERROR",
      "שגיאה בטעינת העגלה",
      500,
      true, // Cart loading is retryable
      { endpoint: "/cart", originalError: error }
    );
  }
};

// Clear entire cart
export const clearCart = async (): Promise<Cart> => {
  try {
    const client = apiClient;
    const response = await client.delete("/wp-json/wc/v3/cart/items", {
      signal: AbortSignal.timeout(10000),
    });

    return transformCart(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, endpoint: "/cart/clear" };
      throw error;
    }

    throw new ApiError("UNKNOWN_ERROR", "שגיאה בניקוי העגלה", 500, false, {
      endpoint: "/cart/clear",
      originalError: error,
    });
  }
};

// Apply coupon to cart
export const applyCoupon = async (couponCode: string): Promise<Cart> => {
  try {
    if (!couponCode || couponCode.trim() === "") {
      throw new ApiError("VALIDATION_ERROR", "קוד הקופון חסר", 400, false, {
        couponCode,
      });
    }

    const client = apiClient;
    const response = await client.post(
      "/wp-json/wc/v3/cart/coupons",
      { code: couponCode.trim() },
      {
        signal: AbortSignal.timeout(10000),
      }
    );

    return transformCart(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, couponCode };
      throw error;
    }

    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as any;

      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response?.data;
        if (
          errorData?.message?.includes("not found") ||
          errorData?.message?.includes("invalid")
        ) {
          throw new ApiError(
            "VALIDATION_ERROR",
            "קוד הקופון לא תקין או לא קיים",
            400,
            false,
            { couponCode }
          );
        }

        if (errorData?.message?.includes("expired")) {
          throw new ApiError(
            "VALIDATION_ERROR",
            "קוד הקופון פג תוקף",
            400,
            false,
            { couponCode }
          );
        }
      }
    }

    throw new ApiError("UNKNOWN_ERROR", "שגיאה בהחלת הקופון", 500, false, {
      couponCode,
      originalError: error,
    });
  }
};
