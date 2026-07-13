import { View, Text, StyleSheet } from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  LETTER_SPACING,
} from "../../constants/theme";

const PlaceholderScreen = ({ title = "Próximamente" }) => (
  <View style={styles.container}>
    <Text style={styles.kicker}>ASTRA BANK</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>Esta sección estará disponible pronto</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: SPACING.lg,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: LETTER_SPACING.ultra,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default PlaceholderScreen;
