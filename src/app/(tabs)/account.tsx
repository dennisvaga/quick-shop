/**
 * Account Tab - Customer Service Integration
 * Features profile, orders, and customer service sections with minimal style
 */

import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { MinimalMenuItem } from "~/components/MinimalMenuItem";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { PageContainer } from "~/layout/PageContainer";

export default function AccountTab() {
  // Navigation handlers
  const handleMyOrders = () => {
    // TODO: Navigate to orders screen
    console.log("Navigate to My Orders");
  };

  const handleShippingAddresses = () => {
    // TODO: Navigate to shipping addresses
    console.log("Navigate to Shipping Addresses");
  };

  const handleSizeChart = () => {
    // TODO: Navigate to size chart
    console.log("Navigate to Size Chart");
  };

  const handleReturnsExchanges = () => {
    // TODO: Navigate to returns and exchanges info
    console.log("Navigate to Returns & Exchanges");
  };

  const handleContact = () => {
    // TODO: Navigate to contact form or info
    console.log("Navigate to Contact");
  };

  const handleAccountSettings = () => {
    // TODO: Navigate to account settings
    console.log("Navigate to Account Settings");
  };

  const handleNotifications = () => {
    // TODO: Navigate to notification settings
    console.log("Navigate to Notifications");
  };

  const handleLogin = () => {
    // TODO: Navigate to login screen
    console.log("Navigate to Login");
  };

  return (
    <PageContainer isTabScreen={true} className="flex-1 bg-gray-50">
      {/* Login Section - Show when not logged in */}
      <View className="px-4">
        <Card>
          <CardContent className="p-6 items-center">
            <Text className="text-center text-gray-600 mb-4 leading-relaxed">
              התחברי כדי לגשת להזמנות שלך ולקבל חוויית קנייה מותאמת אישית
            </Text>
            <Button onPress={handleLogin} className="w-full mb-3">
              <Text className="text-white font-medium">התחברי</Text>
            </Button>
            <Button variant="outline" className="w-full">
              <Text className="font-medium">הרשמי</Text>
            </Button>
          </CardContent>
        </Card>
      </View>

      {/* All Menu Items - Minimal List */}
      <View className="bg-white">
        {/* My Orders Section */}
        <MinimalMenuItem
          title="ההזמנות שלי"
          subtitle="צפי בהזמנות ובמעקב משלוחים"
          onPress={handleMyOrders}
        />
        <MinimalMenuItem
          title="כתובות משלוח"
          subtitle="נהלי את כתובות המשלוח שלך"
          onPress={handleShippingAddresses}
        />

        {/* Customer Service Section */}
        <MinimalMenuItem
          title="טבלת מידות"
          subtitle="מדריך מידות מפורט לכל הפריטים"
          onPress={handleSizeChart}
        />
        <MinimalMenuItem
          title="החלפות והחזרות"
          subtitle="מדיניות החזרות ותהליך החלפה"
          onPress={handleReturnsExchanges}
        />
        <MinimalMenuItem
          title="צרי קשר"
          subtitle="יצירת קשר עם צוות השירות"
          onPress={handleContact}
        />

        {/* Settings Section */}
        <MinimalMenuItem
          title="הגדרות חשבון"
          subtitle="פרטים אישיים והעדפות"
          onPress={handleAccountSettings}
        />
        <MinimalMenuItem
          title="התראות"
          subtitle="הגדרות התראות ועדכונים"
          onPress={handleNotifications}
        />
      </View>

      {/* App Info Section */}
      <View className="px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <Text className="text-center text-gray-600 text-sm leading-relaxed">
              Quick Shop App{"\n"}
              גרסה 1.0.0{"\n"}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Debug Section - Development Only */}
      {__DEV__ && (
        <View className="px-4 pb-6">
          <Card>
            <CardContent className="p-6 items-center">
              <Text className="text-center text-gray-600 mb-4 text-sm">
                🔧 כלי פיתוח - כלים לבדיקת בעיות רשת ב-Android
              </Text>
              <Button
                onPress={() => router.push("/debug/debug" as any)}
                variant="outline"
                className="w-full border-orange-200 bg-orange-50"
              >
                <Text className="font-medium text-orange-700">
                  🔍 Debugging
                </Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      )}
    </PageContainer>
  );
}
