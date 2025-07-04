/**
 * Network Diagnostics for Android Network Issue
 *
 * This file contains isolated network tests to diagnose the Android-specific
 * network failure where axios requests fail before being sent.
 */

// Platform detection
const getPlatform = () => {
  const isReactNative =
    typeof navigator !== "undefined" && navigator.product === "ReactNative";
  return {
    platform: isReactNative ? "mobile" : "web",
    isReactNative,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
  };
};

// Test results interface
export interface NetworkTestResult {
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  errorCode?: string;
  errorType?: string;
  response?: {
    status?: number;
    statusText?: string;
    headers?: any;
    data?: any;
  };
  platform: string;
  timestamp: string;
}

// Test 1: Basic connectivity with jsonplaceholder (simple endpoint)
export const testBasicConnectivity = async (): Promise<NetworkTestResult> => {
  const startTime = Date.now();
  const platform = getPlatform();

  try {
    console.log("🧪 Testing basic connectivity with jsonplaceholder...");

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Note: AbortSignal.timeout not available in React Native
        // Using fetch without timeout for React Native compatibility
      }
    );

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log("✅ Basic connectivity test passed", {
      duration,
      status: response.status,
    });

    return {
      testName: "Basic Connectivity (jsonplaceholder)",
      success: true,
      duration,
      response: {
        status: response.status,
        statusText: response.statusText,
        data: data,
      },
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;

    console.error("❌ Basic connectivity test failed", {
      error: error.message,
      code: error.code,
      name: error.name,
      duration,
    });

    return {
      testName: "Basic Connectivity (jsonplaceholder)",
      success: false,
      duration,
      error: error.message,
      errorCode: error.code,
      errorType: error.name,
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  }
};

// Test 2: Fetch to quick-shop.co.il domain
export const testGatoDomainFetch = async (): Promise<NetworkTestResult> => {
  const startTime = Date.now();
  const platform = getPlatform();

  try {
    console.log("🧪 Testing fetch to quick-shop.co.il domain...");

    const response = await fetch(
      "https://quick-shop.co.il/wp-json/wc/v3/products?per_page=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Note: AbortSignal.timeout not available in React Native
      }
    );

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log("✅ quick-shop domain fetch test passed", {
      duration,
      status: response.status,
    });

    return {
      testName: "quick-shop Domain Fetch",
      success: true,
      duration,
      response: {
        status: response.status,
        statusText: response.statusText,
        data: Array.isArray(data) ? `Array(${data.length})` : "Object",
      },
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;

    console.error("❌ quick-shop domain fetch test failed", {
      error: error.message,
      code: error.code,
      name: error.name,
      duration,
    });

    return {
      testName: "quick-shop Domain Fetch",
      success: false,
      duration,
      error: error.message,
      errorCode: error.code,
      errorType: error.name,
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  }
};

// Test 3: Axios to jsonplaceholder (test axios itself)
export const testAxiosBasic = async (): Promise<NetworkTestResult> => {
  const startTime = Date.now();
  const platform = getPlatform();

  try {
    console.log("🧪 Testing axios with jsonplaceholder...");

    // Dynamic import to handle environments where axios might not be available
    const axios = await import("axios");

    const response = await axios.default.get(
      "https://jsonplaceholder.typicode.com/posts/1",
      {
        timeout: 10000, // React Native compatible timeout
      }
    );

    const duration = Date.now() - startTime;

    console.log("✅ Axios basic test passed", {
      duration,
      status: response.status,
    });

    return {
      testName: "Axios Basic (jsonplaceholder)",
      success: true,
      duration,
      response: {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      },
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;

    console.error("❌ Axios basic test failed", {
      error: error.message,
      code: error.code,
      name: error.name,
      duration,
    });

    return {
      testName: "Axios Basic (jsonplaceholder)",
      success: false,
      duration,
      error: error.message,
      errorCode: error.code,
      errorType: error.name,
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  }
};

// Test 4: Axios to quick-shop.co.il (the actual failing scenario)
export const testAxiosGato = async (): Promise<NetworkTestResult> => {
  const startTime = Date.now();
  const platform = getPlatform();

  try {
    console.log(
      "🧪 Testing axios with quick-shop.co.il (the failing scenario)..."
    );

    // Dynamic import to handle environments where axios might not be available
    const axios = await import("axios");

    const response = await axios.default.get(
      "https://quick-shop.co.il/wp-json/wc/v3/products",
      {
        params: {
          per_page: 1,
          consumer_key:
            process.env.EXPO_PUBLIC_WP_CONSUMER_KEY ||
            process.env.NEXT_PUBLIC_WP_CONSUMER_KEY,
          consumer_secret:
            process.env.EXPO_PUBLIC_WP_CONSUMER_SECRET ||
            process.env.NEXT_PUBLIC_WP_CONSUMER_SECRET,
        },
        timeout: 10000, // React Native compatible timeout
      }
    );

    const duration = Date.now() - startTime;

    console.log("✅ Axios quick-shop test passed", {
      duration,
      status: response.status,
    });

    return {
      testName: "Axios quick-shop (actual scenario)",
      success: true,
      duration,
      response: {
        status: response.status,
        statusText: response.statusText,
        data: Array.isArray(response.data)
          ? `Array(${response.data.length})`
          : "Object",
      },
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;

    console.error("❌ Axios quick-shop test failed", {
      error: error.message,
      code: error.code,
      name: error.name,
      duration,
      fullError: error,
    });

    return {
      testName: "Axios quick-shop (actual scenario)",
      success: false,
      duration,
      error: error.message,
      errorCode: error.code,
      errorType: error.name,
      platform: platform.platform,
      timestamp: new Date().toISOString(),
    };
  }
};

// Test 5: XMLHttpRequest (React Native's underlying implementation)
export const testXMLHttpRequest = async (): Promise<NetworkTestResult> => {
  const startTime = Date.now();
  const platform = getPlatform();

  return new Promise((resolve) => {
    try {
      console.log("🧪 Testing XMLHttpRequest directly...");

      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        const duration = Date.now() - startTime;

        console.log("✅ XMLHttpRequest test passed", {
          duration,
          status: xhr.status,
          readyState: xhr.readyState,
        });

        resolve({
          testName: "XMLHttpRequest Direct",
          success: true,
          duration,
          response: {
            status: xhr.status,
            statusText: xhr.statusText,
            data: "Response received",
          },
          platform: platform.platform,
          timestamp: new Date().toISOString(),
        });
      };

      xhr.onerror = () => {
        const duration = Date.now() - startTime;

        console.error("❌ XMLHttpRequest test failed", {
          status: xhr.status,
          readyState: xhr.readyState,
          duration,
        });

        resolve({
          testName: "XMLHttpRequest Direct",
          success: false,
          duration,
          error: "XMLHttpRequest failed",
          errorCode: "XHR_ERROR",
          errorType: "NetworkError",
          platform: platform.platform,
          timestamp: new Date().toISOString(),
        });
      };

      xhr.ontimeout = () => {
        const duration = Date.now() - startTime;

        console.error("❌ XMLHttpRequest test timed out", { duration });

        resolve({
          testName: "XMLHttpRequest Direct",
          success: false,
          duration,
          error: "XMLHttpRequest timeout",
          errorCode: "XHR_TIMEOUT",
          errorType: "TimeoutError",
          platform: platform.platform,
          timestamp: new Date().toISOString(),
        });
      };

      xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
      xhr.timeout = 10000;
      xhr.send();
    } catch (error: any) {
      const duration = Date.now() - startTime;

      console.error("❌ XMLHttpRequest test threw exception", {
        error: error.message,
        duration,
      });

      resolve({
        testName: "XMLHttpRequest Direct",
        success: false,
        duration,
        error: error.message,
        errorCode: error.code,
        errorType: error.name,
        platform: platform.platform,
        timestamp: new Date().toISOString(),
      });
    }
  });
};

// Comprehensive network test suite
export const runNetworkDiagnostics = async (): Promise<NetworkTestResult[]> => {
  console.log("🚀 Starting comprehensive network diagnostics...");
  console.log("📱 Platform:", getPlatform());

  const results: NetworkTestResult[] = [];

  // Run tests sequentially to avoid overwhelming the network
  console.log("\n--- Test 1: Basic Connectivity ---");
  results.push(await testBasicConnectivity());

  console.log("\n--- Test 2: quick-shop Domain Fetch ---");
  results.push(await testGatoDomainFetch());

  console.log("\n--- Test 3: Axios Basic ---");
  results.push(await testAxiosBasic());

  console.log("\n--- Test 4: Axios quick-shop (Failing Scenario) ---");
  results.push(await testAxiosGato());

  console.log("\n--- Test 5: XMLHttpRequest Direct ---");
  results.push(await testXMLHttpRequest());

  // Summary
  console.log("\n🏁 Network Diagnostics Complete");
  console.log("📊 Results Summary:");
  results.forEach((result, index) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(
      `${index + 1}. ${result.testName}: ${status} (${result.duration}ms)`
    );
    if (!result.success) {
      console.log(`   Error: ${result.error} (${result.errorType})`);
    }
  });

  return results;
};

// Quick test function for easy debugging
export const quickNetworkTest = async () => {
  console.log("⚡ Quick Network Test");

  try {
    const result = await testAxiosGato();
    if (result.success) {
      console.log("✅ Network is working! The issue might be elsewhere.");
    } else {
      console.log("❌ Network issue confirmed:", result.error);
      console.log("🔍 Running full diagnostics...");
      await runNetworkDiagnostics();
    }
  } catch (error) {
    console.error("💥 Quick test failed:", error);
  }
};
