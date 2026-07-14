import { View, Text, StyleSheet } from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  LETTER_SPACING,
} from "../../constants/theme";

/**
 * Encabezado de página al estilo del web:
 * título fucsia, black, mayúsculas e itálica + subtítulo monoespaciado.
 */
const PageHeader = ({ title, subtitle, style, right }) => (
  <View style={[styles.header, style]}>
    <View style={styles.textCol}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right ? <View style={styles.right}>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.huge,
    fontWeight: "900",
    fontStyle: "italic",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    color: COLORS.primary,
  },
  subtitle: {
    marginTop: SPACING.xs,
    fontFamily: "monospace",
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.ultra,
    color: COLORS.textTertiary,
  },
  right: {
    alignItems: "flex-end",
  },
});

export default PageHeader;
