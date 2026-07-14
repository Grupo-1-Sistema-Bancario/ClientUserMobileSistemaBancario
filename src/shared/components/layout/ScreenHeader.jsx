import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  LETTER_SPACING,
} from "../../constants/theme";

const ScreenHeader = ({ navigation, title, subtitle }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={styles.back}
      >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <View style={styles.titles}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    fontStyle: "italic",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    color: COLORS.primary,
  },
  subtitle: {
    fontFamily: "monospace",
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.ultra,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});

export default ScreenHeader;
