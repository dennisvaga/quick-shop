import * as React from "react";
import { ScrollView, SafeAreaView, RefreshControl, View } from "react-native";
import { useTabBar } from "~/context/TabBarContext";
import { useTabBarDimensions } from "~/hooks/useTabBarDimensions";

interface PageContainerProps {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
  className?: string;
  scrollViewClassName?: string;
  showRefreshControl?: boolean;
  isTabScreen?: boolean;
  paddingTop?: boolean;
}

export function PageContainer({
  children,
  refreshing = false,
  onRefresh,
  className = "flex-1 bg-gray-50",
  scrollViewClassName = "flex-1",
  showRefreshControl = true,
  isTabScreen = false,
  paddingTop,
}: PageContainerProps) {
  const { handleScroll } = useTabBar();
  const { totalSpace } = useTabBarDimensions();

  const onScroll = (event: any) => {
    handleScroll(event, isTabScreen);
  };

  const shouldAddPaddingTop = paddingTop ?? isTabScreen;
  const paddingClass = shouldAddPaddingTop ? "pt-20 pb-6" : "pb-6";

  return (
    <SafeAreaView className={className}>
      <ScrollView
        className={scrollViewClassName}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: totalSpace,
        }}
        refreshControl={
          showRefreshControl && onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#000000"]} // Android
              tintColor="#000000" // iOS
            />
          ) : undefined
        }
      >
        <View className={paddingClass}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
