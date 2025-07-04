/**
 * Cart Tab - Shopping cart functionality
 */

import * as React from "react";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { PageContainer } from "~/layout/PageContainer";

export default function CartTab() {
  return (
    <PageContainer isTabScreen={true} className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 bg-white border-b border-gray-100">
        <Text className="text-3xl font-light text-center text-gray-900">
          עגלת הקניות
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-6">
        {/* Empty Cart State */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-xl">העגלה ריקה</CardTitle>
          </CardHeader>
          <CardContent className="items-center">
            <Text className="text-center text-gray-600 mb-6 leading-relaxed">
              עדיין לא הוספת מוצרים לעגלה
            </Text>
          </CardContent>
        </Card>

        {/* TODO: Cart Items */}
        {/* <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              פונקציונליות עתידית
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-gray-500 text-sm leading-relaxed">
              • הצגת מוצרים בעגלה{"\n"}• עדכון כמויות{"\n"}• הסרת מוצרים{"\n"}•
              חישוב סכום כולל{"\n"}• מעבר לתשלום{"\n"}• שמירת עגלה מקומית
            </Text>
          </CardContent>
        </Card> */}

        {/* TODO: Checkout Button */}
        {/* <Button disabled className="w-full opacity-50">
          <Text className="text-white font-medium">מעבר לתשלום (TODO)</Text>
        </Button> */}
      </View>
    </PageContainer>
  );
}
