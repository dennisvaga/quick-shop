import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { I18nManager } from 'react-native';

// Configure RTL support 
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./src/app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
