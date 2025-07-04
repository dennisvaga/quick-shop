import { ApiError } from "../types/errors";

/**
 * Smart retry logic based on our error handling strategy
 * SHARED: Same retry logic across platforms
 */
export const createRetryFunction = (maxRetries: number = 3) => {
  return (failureCount: number, error: unknown) => {
    if (failureCount >= maxRetries) return false;

    if (error instanceof ApiError) {
      // Don't retry client errors or non-retryable errors
      if (error.status >= 400 && error.status < 500) return false;
      if (!error.retryable) return false;
      return true;
    }

    // Network errors are retryable
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return true;
    }

    return failureCount < 2;
  };
};

/**
 * Exponential backoff delay
 * SHARED: Same backoff strategy across platforms
 */
export const retryDelay = (attemptIndex: number) =>
  Math.min(1000 * 2 ** attemptIndex, 30000);

/**
 * Error handler for global error boundary integration
 * SHARED: Same error reporting across platforms
 */
export const queryErrorHandler = (error: Error) => {
  if (process.env.NODE_ENV === "production") {
    // Send to monitoring service
    console.error("Query Error:", {
      message: error.message,
      name: error.name,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error("Query Error Details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
};
