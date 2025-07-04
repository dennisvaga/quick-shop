import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  ApiError,
  getDefaultErrorMessage,
  parseErrorResponse,
} from "../types/errors";

// Platform detection and network diagnostics
const getPlatformInfo = () => {
  const isReactNative =
    typeof navigator !== "undefined" && navigator.product === "ReactNative";
  const platform = isReactNative ? "mobile" : "web";

  return {
    platform,
    isReactNative,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
  };
};

// Configuration interface
export interface WordPressApiConfig {
  baseUrl: string;
  consumerKey?: string;
  consumerSecret?: string;
}

// Create and export the API client factory
export function createWpApiClient(config: WordPressApiConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: 10000,
  });

  // Add authentication if credentials are provided
  if (config.consumerKey && config.consumerSecret) {
    client.interceptors.request.use((request: InternalAxiosRequestConfig) => {
      // OAuth for WooCommerce REST API
      // For simplicity in MVP, we can use basic auth or URL params
      if (!request.params) request.params = {};
      request.params.consumer_key = config.consumerKey;
      request.params.consumer_secret = config.consumerSecret;
      return request;
    });
  }

  // Add response interceptor for comprehensive error handling
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Network/Connection Errors
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new ApiError(
          "TIMEOUT_ERROR",
          "הבקשה נכשלה בגלל זמן המתנה ארוך מדי",
          0,
          true,
          { originalError: error }
        );
      }

      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new ApiError(
          "NETWORK_ERROR",
          "הרשת לא זמינה כרגע. אנא בדקי את החיבור לאינטרנט",
          0,
          true,
          { originalError: error }
        );
      }

      // HTTP Error Classification
      const response = error.response;
      if (response) {
        const errorMessage = await parseErrorResponse(response).catch(() =>
          getDefaultErrorMessage(response.status)
        );

        switch (response.status) {
          case 401:
          case 403:
            throw new ApiError(
              "UNAUTHORIZED",
              "נדרשת הזדהות",
              response.status,
              false,
              { originalError: error }
            );
          case 404:
            throw new ApiError(
              "PRODUCT_NOT_FOUND",
              "המידע המבוקש לא נמצא",
              response.status,
              false,
              { originalError: error }
            );
          case 429:
            throw new ApiError(
              "RATE_LIMITED",
              "יותר מדי בקשות",
              response.status,
              true,
              { originalError: error }
            );
          case 500:
          case 502:
          case 503:
            throw new ApiError(
              "SERVER_ERROR",
              "שגיאת שרת זמנית",
              response.status,
              true,
              { originalError: error }
            );
          default:
            throw new ApiError(
              "UNKNOWN_ERROR",
              errorMessage,
              response.status,
              false,
              { originalError: error }
            );
        }
      }

      // Fallback for unexpected errors
      throw new ApiError(
        "UNKNOWN_ERROR",
        "שגיאה לא צפויה. אנא נסי שוב",
        500,
        false,
        { originalError: error }
      );
    }
  );

  return client;
}

// Environment configuration helper with validation
const getConfig = (): WordPressApiConfig => {
  // Try mobile env vars first, then web env vars
  const baseUrl =
    process.env.EXPO_PUBLIC_WP_API_URL ||
    process.env.NEXT_PUBLIC_WP_API_URL ||
    "https://quick-shop.co.il";

  const consumerKey =
    process.env.EXPO_PUBLIC_WP_CONSUMER_KEY ||
    process.env.NEXT_PUBLIC_WP_CONSUMER_KEY;

  const consumerSecret =
    process.env.EXPO_PUBLIC_WP_CONSUMER_SECRET ||
    process.env.NEXT_PUBLIC_WP_CONSUMER_SECRET;

  const config = { baseUrl, consumerKey, consumerSecret };

  // Validate required configuration
  if (!config.baseUrl) {
    throw new Error(
      "API base URL is required. Please set EXPO_PUBLIC_WP_API_URL or NEXT_PUBLIC_WP_API_URL"
    );
  }

  // Warn about missing authentication (non-fatal)
  if (!config.consumerKey || !config.consumerSecret) {
    console.warn(
      "⚠️ WooCommerce API credentials not found. Some features may not work properly."
    );
  }

  return config;
};

// Export a pre-configured API client using environment variables
export const apiClient = createWpApiClient(getConfig());
