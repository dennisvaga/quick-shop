import {
  Category,
  CategorySchema,
} from "../features/categories/types/category";
import { ProductSummary } from "../features/products/types/product";
import { BaseFilters, PaginatedResponse } from "../types/common";
import { ApiError } from "../types/errors";
import { apiClient } from "./client";

// Category-specific filters extending base filters
export interface CategoryFilters extends BaseFilters {
  parent?: number;
  orderBy?: "name" | "count" | "id";
}

// Category-specific response
export interface CategoriesResponse extends PaginatedResponse<Category> {
  categories: Category[]; // For backward compatibility
}

// Helper function to transform raw WooCommerce category data
const transformCategory = (rawCategory: any): Category => {
  return CategorySchema.parse(rawCategory);
};

// Raw API function: Get categories with filtering and pagination
export const getCategories = async (
  filters?: CategoryFilters
): Promise<CategoriesResponse> => {
  const startTime = Date.now();

  try {
    const client = apiClient;

    const params = {
      page: filters?.page || 1,
      per_page: filters?.perPage || 50,
      order: filters?.order || "asc",
      orderby: filters?.orderBy || "name",
      ...(filters?.parent !== undefined && { parent: filters.parent }),
      ...(filters?.search && { search: filters.search }),
    };

    const response = await client.get("/wp-json/wc/v3/products/categories", {
      params,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // Extract pagination info from headers
    const totalItems = parseInt(response.headers["x-wp-total"] || "0", 10);
    const totalPages = parseInt(response.headers["x-wp-totalpages"] || "1", 10);
    const currentPage = params.page;
    const itemsPerPage = params.per_page;

    const categories = response.data.map(transformCategory);
    const processingTime = Date.now() - startTime;

    // Business Logic Validation
    if (categories.length === 0 && !filters) {
      throw new ApiError(
        "CATEGORIES_NOT_FOUND",
        "לא נמצאו קטגוריות באתר כרגע",
        404,
        false,
        { totalCategories: 0 }
      );
    }

    if (categories.length === 0 && filters) {
      throw new ApiError(
        "CATEGORIES_NOT_FOUND",
        "לא נמצאו קטגוריות התואמות לחיפוש שלך",
        404,
        false,
        { filters, searchTerm: filters.search }
      );
    }

    return {
      data: categories, // Generic data property
      categories, // Backward compatibility
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
        "הרשת לא זמינה כרגע. אנא בדקו את החיבור לאינטרנט",
        0,
        true,
        { endpoint: "/categories" }
      );
    }

    // Timeout Errors
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError(
        "TIMEOUT_ERROR",
        "הבקשה נכשלה בגלל זמן המתנה ארוך מדי",
        0,
        true,
        { endpoint: "/categories" }
      );
    }

    // Already classified errors
    if (error instanceof ApiError) {
      error.context = { ...error.context, filters, endpoint: "/categories" };
      throw error;
    }

    // Unknown errors
    throw new ApiError(
      "UNKNOWN_ERROR",
      "שגיאה לא צפויה. אנא נסו שוב",
      500,
      false,
      { endpoint: "/categories", originalError: error }
    );
  }
};

// Raw API function: Get a single category by ID
export const getCategory = async (id: number): Promise<Category> => {
  try {
    const client = apiClient;
    const response = await client.get(
      `/wp-json/wc/v3/products/categories/${id}`,
      {
        signal: AbortSignal.timeout(10000),
      }
    );
    return transformCategory(response.data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, categoryId: id };
      throw error;
    }

    throw new ApiError("CATEGORY_NOT_FOUND", "הקטגוריה לא נמצאה", 404, false, {
      categoryId: id,
      originalError: error,
    });
  }
};

// Raw API function: Get products in a category
export const getCategoryProducts = async (
  categoryId: number,
  filters?: {
    page?: number;
    perPage?: number;
    order?: "asc" | "desc";
    orderBy?: "date" | "title" | "price" | "popularity";
  }
): Promise<ProductSummary[]> => {
  try {
    const client = apiClient;

    const params = {
      page: filters?.page || 1,
      per_page: filters?.perPage || 24,
      order: filters?.order || "desc",
      orderby: filters?.orderBy || "date",
      category: categoryId,
    };

    const response = await client.get("/wp-json/wc/v3/products", {
      params,
      signal: AbortSignal.timeout(10000),
    });

    // Transform products to ProductSummary format
    const products = response.data.map(
      (rawProduct: any): ProductSummary => ({
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
      })
    );

    // Business Logic Validation
    if (products.length === 0) {
      throw new ApiError(
        "PRODUCTS_NOT_FOUND",
        "לא נמצאו מוצרים בקטגוריה זו",
        404,
        false,
        { categoryId, filters }
      );
    }

    return products;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      error.context = { ...error.context, categoryId, filters };
      throw error;
    }

    throw new ApiError(
      "UNKNOWN_ERROR",
      "שגיאה בטעינת מוצרי הקטגוריה",
      500,
      false,
      { categoryId, originalError: error }
    );
  }
};

// Temporary function to see all categories
export const getAllCategories = async () => {
  const response = await apiClient.get("/wp-json/wc/v3/products/categories", {
    params: { per_page: 100 },
  });
  console.log("All categories:", response.data);
  return response.data;
};

// Legacy method for backward compatibility
export const getCategoriesSimple = async (params?: {
  parent?: number;
  page?: number;
  per_page?: number;
  order?: "asc" | "desc";
  orderby?: string;
}): Promise<Category[]> => {
  const response = await getCategories({
    parent: params?.parent,
    page: params?.page,
    perPage: params?.per_page,
    order: params?.order,
    orderBy: params?.orderby as any,
  });
  return response.categories;
};
