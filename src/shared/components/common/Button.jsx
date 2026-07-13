import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "../../constants/theme";

const Button = ({
  title,
  onPress,
  loading,
  variant = "primary",
  style,
  disabled,
  ...props
}) => {
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary
          ? styles.buttonSecondary
          : isGhost
            ? styles.buttonGhost
            : styles.buttonPrimary,
        (loading || disabled) && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={isSecondary || isGhost ? COLORS.primary : COLORS.text}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isSecondary || isGhost ? styles.textSecondary : styles.textPrimary,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glowPrimary,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: "transparent",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    letterSpacing: 1,
  },
  textPrimary: {
    color: COLORS.text,
  },
  textSecondary: {
    color: COLORS.primary,
  },
});

export default Button;
