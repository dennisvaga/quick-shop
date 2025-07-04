import {
  Product,
  ProductSchema,
  ProductSummary,
} from "../features/products/types/product";
import { BaseFilters, PaginatedResponse, SortOrder } from "../types/common";
import { ApiError } from "../types/errors";
import { apiClient } from "./client";

// Product-specific filters extending base filters
export interface ProductFilters extends BaseFilters {
  category?: number;
  orderBy?: "date" | "title" | "price" | "popularity";
  minPrice?: number;
  maxPrice?: number;
}

// Product-specific response with backward compatibility
export interface ProductsResponse extends PaginatedResponse<ProductSummary> {
  products: ProductSummary[]; // For backward compatibility
}

// Use the pre-configured API client from client.ts
// No need to duplicate environment configuration here

// Helper function to transform raw WooCommerce product data
const transformProduct = (rawProduct: any): ProductSummary => {
  return {
    id: rawProduct.id,
    name: rawProduct.name,
    slug: rawProduct.slug,
    price: rawProduct.price,
    images: rawProduct.images.map((img: any) => ({
      id: img.id,
      src: img.src,
      alt: img.alt || "",
    })),
    categories: rawProduct.categories,
  };
};

// Helper function to transform full product data
const transformFullProduct = (rawProduct: any): Product => {
  return ProductSchema.parse(rawProduct);
};

// Raw API function: Get products with filtering and pagination
export const getProducts = async (
  filters?: ProductFilters
): Promise<ProductsResponse> => {
  const startTime = Date.now();

  try {
    const client = apiClient;

    const params = {
      page: filters?.page || 1,
      per_page: filters?.perPage || 12,
      order: filters?.order || "desc",
      orderby: filters?.orderBy || "date",
      ...(filters?.category && { category: filters.category }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.minPrice && { min_price: filters.minPrice }),
      ...(filters?.maxPrice && { max_price: filters.maxPrice }),
    };

    const response = await client.get("/wp-json/wc/v3/products", {
      params,
      timeout: 10000, // 10 second timeout (React Native compatible)
    });

    // Extract pagination info from headers
    const totalItems = parseInt(response.headers["x-wp-total"] || "0", 10);
    const totalPages = parseInt(response.headers["x-wp-totalpages"] || "1", 10);
    const currentPage = params.page;
    const itemsPerPage = params.per_page;

    // Filter out products without imagesAdd commentMore actions
    const productsWithImages = response.data.filter(
      (product: any) =>
        product.images &&
        product.images.length > 0 &&
        product.images.some((img: any) => img.src && img.src.trim() !== "")
    );
    const products = productsWithImages.map(transformProduct);

    const processingTime = Date.now() - startTime;

    // Business Logic Validation
    if (products.length === 0 && !filters) {
      throw new ApiError(
        "NO_PRODUCTS",
        "לא נמצאו מוצרים באתר כרגע",
        404,
        false,
        { totalProducts: 0 }
      );
    }

    if (products.length === 0 && filters) {
      throw new ApiError(
        "NO_PRODUCTS",
        "לא נמצאו מוצרים התואמים לחיפוש שלך",
        404,
        false,
        { filters, searchTerm: filters.search }
      );
    }

    return {
      data: products, // Generic data property
      products, // Backward compatibility
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
      meta: {
        processingTime,
        cacheStatus: "miss", // TODO: Implement caching
      },
    };
  } catch (error: unknown) {
    // Network/Connection Errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        "NETWORK_ERROR",
        "הרשת לא זמינה כרגע. אנא בדקי את החיבור לאינטרנט",
        0,
        true,
        { endpoint: "/products" }
      );
    }

    // Timeout Errors
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError(
        "TIMEOUT_ERROR",
        "הבקשה נכשלה בגלל זמן המתנה ארוך מדי",
        0,
        true,
        { endpoint: "/products" }
      );
    }

    // Already classified errors
    if (error instanceof ApiError) {
      error.context = { ...error.context, filters, endpoint: "/products" };
      throw error;
    }

    // Unknown errors
    throw new ApiError(
      "UNKNOWN_ERROR",
      "שגיאה לא צפויה. אנא נסי שוב",
      500,
      false,
      { endpoint: "/products", originalError: error }
    );
  }
};

// Raw API function: Get a single product by ID
export const getProduct = async (id: number): Promise<Product> => {
  try {
    const client = apiClient;
    const response = await client.get(`/wp-json/wc/v3/products/${id}`, {
      timeout: 10000,
    });
    return transformFullProduct(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, productId: id };
      throw error;
    }

    throw new ApiError("UNKNOWN_ERROR", "שגיאה בטעינת המוצר", 500, false, {
      productId: id,
      originalError: error,
    });
  }
};

// Raw API function: Get product variations
export const getProductVariations = async (
  productId: number
): Promise<any[]> => {
  try {
    const client = apiClient;
    const response = await client.get(
      `/wp-json/wc/v3/products/${productId}/variations`,
      {
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, productId };
      throw error;
    }

    throw new ApiError(
      "UNKNOWN_ERROR",
      "שגיאה בטעינת וריאציות המוצר",
      500,
      false,
      { productId, originalError: error }
    );
  }
};

// Raw API function: Search products with filters
export const searchProducts = async (
  query: string,
  page: number = 1
): Promise<ProductsResponse> => {
  try {
    // Validate search query
    if (!query || query.trim().length < 2) {
      throw new ApiError(
        "INVALID_SEARCH",
        "חיפוש חייב להכיל לפחות 2 תווים",
        400,
        false,
        { query, minLength: 2 }
      );
    }

    const trimmedQuery = query.trim();
    return await getProducts({
      search: trimmedQuery,
      page,
      perPage: 24,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, searchQuery: query, page };
    }
    throw error;
  }
};

// Raw API function: Get products by category
export const getProductsByCategory = async (
  categoryId: number,
  page: number = 1
): Promise<ProductsResponse> => {
  try {
    return await getProducts({
      category: categoryId,
      page,
      perPage: 24,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, categoryId, page };
    }
    throw error;
  }
};

// Legacy method for backward compatibility
export const getProductsSimple = async (params?: {
  category?: number;
  search?: string;
  page?: number;
  per_page?: number;
  order?: SortOrder;
  orderby?: string;
}): Promise<ProductSummary[]> => {
  const response = await getProducts({
    category: params?.category,
    search: params?.search,
    page: params?.page,
    perPage: params?.per_page,
    order: params?.order,
    orderBy: params?.orderby as any,
  });
  return response.products;
};
