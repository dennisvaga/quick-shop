import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { ApiError } from "~/types/errors";

interface ErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

interface ErrorUIConfig {
  title: string;
  message: string;
  action?: string;
  showRetry: boolean;
  icon: string;
  severity: "error" | "warning" | "info";
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
}: ErrorDisplayProps): React.JSX.Element {
  const getErrorUI = (error: ApiError): ErrorUIConfig => {
    switch (error.code) {
      case "NETWORK_ERROR":
        return {
          title: "בעיית חיבור",
          message: "אנא בדקי את החיבור לאינטרנט ונסי שוב",
          action: "נסי שוב",
          showRetry: true,
          icon: "🌐",
          severity: "warning",
        };

      case "TIMEOUT_ERROR":
        return {
          title: "הבקשה נכשלה",
          message: "הבקשה לוקחת יותר זמן מהצפוי. נסי שוב",
          action: "נסי שוב",
          showRetry: true,
          icon: "⏱️",
          severity: "warning",
        };

      case "NO_PRODUCTS":
        return {
          title: "לא נמצאו מוצרים",
          message: error.context?.filters
            ? "נסי לשנות את הפילטרים או לחפש משהו אחר"
            : "אין מוצרים זמינים כרגע",
          action: error.context?.filters ? "נקי פילטרים" : "רענני דף",
          showRetry: false,
          icon: "🔍",
          severity: "info",
        };

      case "OUT_OF_STOCK":
        return {
          title: "המוצר לא זמין",
          message: "המוצר שביקשת לא זמין כרגע במלאי",
          action: "הצגת מוצרים דומים",
          showRetry: false,
          icon: "📦",
          severity: "warning",
        };

      case "PRODUCT_NOT_FOUND":
        return {
          title: "המוצר לא נמצא",
          message: "המוצר שחיפשת לא נמצא או לא זמין יותר",
          action: "חזרה לקטלוג",
          showRetry: false,
          icon: "❓",
          severity: "error",
        };

      case "INVALID_CART":
        return {
          title: "בעיה בעגלת הקניות",
          message: "חלק מהמוצרים בעגלה לא זמינים יותר",
          action: "עדכני עגלה",
          showRetry: true,
          icon: "🛒",
          severity: "warning",
        };

      case "PAYMENT_FAILED":
        return {
          title: "התשלום נכשל",
          message: "אנא בדקי את פרטי התשלום ונסי שוב",
          action: "נסי שוב",
          showRetry: true,
          icon: "💳",
          severity: "error",
        };

      case "VALIDATION_ERROR":
        return {
          title: "בעיה בנתונים",
          message: error.message,
          action: "תקני ונסי שוב",
          showRetry: false,
          icon: "⚠️",
          severity: "warning",
        };

      case "INVALID_SEARCH":
        return {
          title: "חיפוש לא תקין",
          message: error.message,
          action: "נסי חיפוש אחר",
          showRetry: false,
          icon: "🔍",
          severity: "warning",
        };

      case "RATE_LIMITED":
        return {
          title: "יותר מדי בקשות",
          message: "אנא המתיני כמה דקות ונסי שוב",
          action: "נסי שוב בעוד דקה",
          showRetry: true,
          icon: "⏳",
          severity: "warning",
        };

      case "UNAUTHORIZED":
        return {
          title: "נדרשת הזדהות",
          message: "אנא התחברי כדי להמשיך",
          action: "התחברי",
          showRetry: false,
          icon: "🔒",
          severity: "warning",
        };

      case "SERVER_ERROR":
        return {
          title: "שגיאת שרת",
          message: "יש בעיה זמנית בשרת. אנא נסי שוב בעוד כמה דקות",
          action: "נסי שוב",
          showRetry: true,
          icon: "🔧",
          severity: "error",
        };

      default:
        return {
          title: "שגיאה",
          message: error.message || "שגיאה לא צפויה. אנא נסי שוב",
          action: "נסי שוב",
          showRetry: true,
          icon: "❌",
          severity: "error",
        };
    }
  };

  const errorUI = getErrorUI(error);

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "error":
        return {
          container: "bg-red-50 border-red-200",
          text: "text-red-800",
          button: "bg-red-100 border-red-300",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-800",
          button: "bg-yellow-100 border-yellow-300",
        };
      case "info":
        return {
          container: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          button: "bg-blue-100 border-blue-300",
        };
      default:
        return {
          container: "bg-gray-50 border-gray-200",
          text: "text-gray-800",
          button: "bg-gray-100 border-gray-300",
        };
    }
  };

  const colors = getSeverityColors(errorUI.severity);

  return (
    <View
      className={`rounded-lg border p-6 items-center mx-4 ${colors.container}`}
    >
      <Text className="text-3xl mb-3">{errorUI.icon}</Text>
      <Text className={`text-lg font-semibold mb-2 text-center ${colors.text}`}>
        {errorUI.title}
      </Text>
      <Text
        className={`text-sm mb-4 text-center leading-relaxed ${colors.text}`}
      >
        {errorUI.message}
      </Text>

      <View className="flex-row gap-2">
        {errorUI.showRetry && onRetry && (
          <Pressable
            onPress={onRetry}
            className={`px-4 py-2 rounded-md border ${colors.button}`}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className={`text-sm font-medium ${colors.text}`}>
              {errorUI.action}
            </Text>
          </Pressable>
        )}

        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            className="px-4 py-2"
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text className="text-sm text-gray-600">סגור</Text>
          </Pressable>
        )}
      </View>

      {/* Debug info in development */}
      {__DEV__ && (
        <View className="mt-4 p-2 bg-gray-100 rounded w-full">
          <Text className="text-xs text-gray-700 text-left">
            Debug: {error.code} (Status: {error.status})
          </Text>
        </View>
      )}
    </View>
  );
}
