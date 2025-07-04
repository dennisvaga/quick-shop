import * as React from "react";
import { ScrollView, View } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import DebugCategoriesScreen from "./debug-categories";
import DebugNetworkComponent from "./debug-network";

export default function DebugScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="space-y-4">
        {/* Header */}
        <Card className="p-4">
          <Text className="text-xl font-bold mb-2 text-center">
            🔍 Debug Tools
          </Text>
          <Text className="text-gray-600 text-center">
            Network connectivity and data debugging for troubleshooting
          </Text>
        </Card>

        {/* Network Debug Component */}
        <DebugNetworkComponent />

        {/* Categories Debug Component */}
        <DebugCategoriesScreen />

        {/* Instructions */}
        <Card className="p-4">
          <Text className="text-lg font-semibold mb-2 text-center">
            How to Use
          </Text>
          <Text className="text-gray-600 text-sm">
            1. Tap "Test Network Connection" to test API connectivity{"\n"}
            2. Tap "Show Categories" to view category structure{"\n"}
            3. Check alerts and console for detailed logs{"\n"}
            4. Report any failures to development team
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}
