// Error codes for e-commerce application
export type ErrorCode =
  // Network & Infrastructure
  | "NETWORK_ERROR" // Connection issues
  | "TIMEOUT_ERROR" // Request timeout
  | "SERVER_ERROR" // 500 errors
  | "RATE_LIMITED" // Too many requests
  | "UNAUTHORIZED" // Auth issues

  // Business Logic
  | "NO_PRODUCTS" // Empty results
  | "OUT_OF_STOCK" // Inventory issues
  | "INVALID_CART" // Cart validation
  | "PAYMENT_FAILED" // Checkout errors
  | "PRODUCT_NOT_FOUND" // 404 for products
  | "CATEGORY_NOT_FOUND" // 404 for categories
  | "CATEGORIES_NOT_FOUND" // No categories found
  | "PRODUCTS_NOT_FOUND" // No products found in category

  // User Input
  | "VALIDATION_ERROR" // Form validation
  | "INVALID_SEARCH" // Bad search query

  // Fallback
  | "UNKNOWN_ERROR"; // Unexpected errors

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly retryable: boolean;
  public context?: any;

  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    retryable: boolean = false,
    context?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.retryable = retryable;
    this.context = context;
  }
}

// Helper function to get default Hebrew error messages
export const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "בקשה לא תקינה";
    case 401:
      return "נדרשת הזדהות";
    case 403:
      return "אין הרשאה לגשת למידע זה";
    case 404:
      return "המידע המבוקש לא נמצא";
    case 429:
      return "יותר מדי בקשות. אנא נסי שוב בעוד כמה דקות";
    case 500:
      return "שגיאת שרת. אנא נסי שוב";
    default:
      return "שגיאה לא ידועה";
  }
};

// Helper function to parse error response
export const parseErrorResponse = async (
  response: Response
): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData.message || errorData.error || "שגיאה לא ידועה";
  } catch {
    return getDefaultErrorMessage(response.status);
  }
};
