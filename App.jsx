import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import CosmicBackground from "./src/shared/components/layout/CosmicBackground";
import { toastConfig } from "./src/shared/components/ToastConfig";
import { COLORS } from "./src/shared/constants/theme";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: COLORS.spaceBg }}>
          <CosmicBackground />
          <AppNavigator />
        </View>
        <StatusBar style="light" />
        <Toast position="top" config={toastConfig} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
