// App.jsx
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import CosmicBackground from "./src/shared/components/layout/CosmicBackground";
import { COLORS } from "./src/shared/constants/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <CosmicBackground />
        <View style={styles.content}>
          <AppNavigator />
        </View>
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.spaceBg,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
