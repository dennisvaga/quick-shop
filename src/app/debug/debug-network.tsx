import * as React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { testAxiosGato } from "~/api/diagnostics/networkDiagnostics";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function DebugNetworkComponent() {
  const [isRunning, setIsRunning] = useState(false);

  const runNetworkTest = async () => {
    setIsRunning(true);
    try {
      console.log("🔍 Running network connectivity test...");

      const result = await testAxiosGato();

      if (result.success) {
        Alert.alert(
          "✅ Network Test Passed",
          `Connection successful!\nDuration: ${result.duration}ms\nStatus: ${result.response?.status}`
        );
        console.log("✅ Network test passed:", result);
      } else {
        Alert.alert(
          "❌ Network Test Failed",
          `Error: ${result.error}\nType: ${result.errorType}\nDuration: ${result.duration}ms`
        );
        console.error("❌ Network test failed:", result);
      }
    } catch (error) {
      console.error("💥 Network test exception:", error);
      Alert.alert("💥 Test Error", String(error));
    } finally {
      setIsRunning(false);
    }
  };

  const getPlatformInfo = () => {
    const isReactNative =
      typeof navigator !== "undefined" && navigator.product === "ReactNative";
    return {
      platform: isReactNative ? "React Native" : "Web",
      environment: process.env.NODE_ENV,
      apiUrl: process.env.EXPO_PUBLIC_WP_API_URL,
    };
  };

  const platformInfo = getPlatformInfo();

  return (
    <>
      {/* Network Test */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-center text-lg">Network Test</CardTitle>
        </CardHeader>
        <CardContent className="items-center">
          <Text className="text-center text-gray-600 mb-4 text-sm">
            Test connection to the API server
          </Text>
          <Button
            onPress={runNetworkTest}
            disabled={isRunning}
            className="w-full"
          >
            <Text className="text-white font-medium">
              {isRunning ? "Testing..." : "🚀 Test Network Connection"}
            </Text>
          </Button>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-center text-lg">Platform Info</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-gray-600 text-sm">
            Platform: {platformInfo.platform}
            {"\n"}
            Environment: {platformInfo.environment}
            {"\n"}
            API URL: {platformInfo.apiUrl}
          </Text>
        </CardContent>
      </Card>
    </>
  );
}
