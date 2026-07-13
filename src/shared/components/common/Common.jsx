import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  LETTER_SPACING,
} from "../../constants/theme";

export const LoadingSpinner = ({ fullScreen = false }) => (
  <View style={[styles.center, fullScreen && styles.fullScreen]}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

export const EmptyState = ({ message = "No hay datos disponibles" }) => (
  <View style={styles.center}>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const SectionTitle = ({ children, style }) => (
  <Text style={[styles.sectionTitle, style]}>{children}</Text>
);

export const formatCurrency = (value, currency = "GTQ") => {
  const num = Number(value) || 0;
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (currency === "GTQ" || currency === "Q") return `Q ${formatted}`;
  return `${currency} ${formatted}`;
};

export const CurrencyText = ({
  amount,
  currency = "GTQ",
  hidden = false,
  style,
  positive,
  negative,
}) => {
  let colorStyle = styles.currencyDefault;
  if (positive === true) colorStyle = styles.currencyPositive;
  else if (negative === true) colorStyle = styles.currencyNegative;

  return (
    <Text style={[styles.currency, colorStyle, style]}>
      {hidden ? "••••••" : formatCurrency(amount, currency)}
    </Text>
  );
};

export const maskAccountNumber = (value) => {
  if (value == null) return "••••";
  const str = String(value).replace(/\s/g, "");
  if (str.length <= 4) return str;
  return `•••• ${str.slice(-4)}`;
};

export const MaskedNumber = ({ value, style }) => (
  <Text style={[styles.masked, style]}>{maskAccountNumber(value)}</Text>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150,
  },
  fullScreen: {
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: COLORS.surfaceGlass,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.cardDark,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.secondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    marginBottom: SPACING.sm,
  },
  currency: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  currencyDefault: {
    color: COLORS.text,
  },
  currencyPositive: {
    color: COLORS.success,
  },
  currencyNegative: {
    color: COLORS.error,
  },
  masked: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    fontVariant: ["tabular-nums"],
  },
});
