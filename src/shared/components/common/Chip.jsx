import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from "../../constants/theme";

const Chip = ({ label, active, onPress, style }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive, style]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
  },
  labelActive: {
    color: COLORS.text,
  },
});

export default Chip;
