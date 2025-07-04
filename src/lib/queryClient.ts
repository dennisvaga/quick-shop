import { QueryClient } from "@tanstack/react-query";
import { AppState, Platform } from "react-native";
import { baseQueryConfig } from "~/query/config";

/**
 * Mobile-optimized QueryClient configuration
 *
 * Architecture:
 * - ~/query/config.ts: Base configuration (reusable)
 * - This file: Mobile-specific optimizations and lifecycle management
 *
 * Assumes: Slower network, limited memory, frequent app backgrounding
 */
export const createMobileQueryClient = () => {
  return new QueryClient({
    ...baseQueryConfig,
    defaultOptions: {
      ...baseQueryConfig.defaultOptions,
      queries: {
        ...baseQueryConfig.defaultOptions.queries,

        // Mobile-specific cache configuration (more conservative)
        staleTime: 2 * 60 * 1000, // 2 minutes (shorter for mobile)
        gcTime: 5 * 60 * 1000, // 5 minutes (less memory available)

        // Mobile-specific refetch behavior
        refetchOnMount: true, // Always fresh on mount
        refetchOnReconnect: true, // Important for mobile networks

        // Mobile-specific network behavior
        networkMode: "online",

        // Conservative background refetching
        refetchInterval: false, // No polling on mobile
        refetchIntervalInBackground: false,

        // Mobile retry configuration (more aggressive due to flaky networks)
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Faster retry
      },

      mutations: {
        ...baseQueryConfig.defaultOptions.mutations,
        networkMode: "online",

        // Mobile mutations should be more patient
        retry: 1, // One retry for mutations on mobile
      },
    },
  });
};

/**
 * React Native specific: Pause queries when app is backgrounded
 */
export const setupMobileQueryBehavior = (queryClient: QueryClient) => {
  // Pause queries when app goes to background
  const handleAppStateChange = (nextAppState: string) => {
    if (Platform.OS !== "web") {
      if (nextAppState === "background") {
        queryClient.cancelQueries();
      } else if (nextAppState === "active") {
        queryClient.invalidateQueries();
      }
    }
  };

  const subscription = AppState.addEventListener(
    "change",
    handleAppStateChange
  );

  return () => {
    subscription?.remove();
  };
};

// Singleton instance for mobile app
export const queryClient = createMobileQueryClient();
