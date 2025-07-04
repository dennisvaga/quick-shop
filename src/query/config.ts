import { createRetryFunction, retryDelay } from "./retry";

/**
 * Base configuration that apps can extend
 * NOT a QueryClient instance, just configuration
 */
export const baseQueryConfig = {
  defaultOptions: {
    queries: {
      retry: createRetryFunction(3),
      retryDelay,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
};
