import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Appearance, Platform } from "react-native";
import { GlobalTabBar } from "~/components/GlobalTabBar";
import { TabBarProvider } from "~/context/TabBarContext";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import AppProviders from "./AppProviders";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <AppProviders>
      <TabBarProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                title: "חזור",
              }}
            />
            <Stack.Screen
              name="products/[id]"
              options={({ navigation }) => {
                // Get the previous route to determine appropriate back button text
                const routes = navigation.getState()?.routes;
                const previousRoute = routes?.[routes.length - 2];

                let headerBackTitle = "חזור"; // Default fallback

                if (previousRoute) {
                  switch (previousRoute.name) {
                    case "(tabs)":
                      // Check which tab was active
                      const tabState = previousRoute.state;
                      if (tabState) {
                        const activeTab = tabState.routes[tabState.index];
                        switch (activeTab.name) {
                          case "catalog":
                            headerBackTitle = "קטלוג";
                            break;
                          case "index":
                            headerBackTitle = "בית";
                            break;
                          default:
                            headerBackTitle = "חזור";
                        }
                      }
                      break;
                    default:
                      headerBackTitle = "חזור";
                  }
                }

                return {
                  title: "",
                  headerBackTitle,
                };
              }}
            />
          </Stack>
          <GlobalTabBar />
          <PortalHost />
        </ThemeProvider>
      </TabBarProvider>
    </AppProviders>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add("bg-background");
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() {}
