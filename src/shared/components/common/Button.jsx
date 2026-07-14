import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
} from "../../constants/theme";

const Button = ({
  title,
  onPress,
  loading,
  variant = "primary",
  gradient = GRADIENTS.primary,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isPrimary = !isSecondary && !isGhost;

  const content = loading ? (
    <ActivityIndicator color={isPrimary ? COLORS.text : COLORS.primary} />
  ) : (
    <Text
      style={[
        styles.text,
        isPrimary ? styles.textPrimary : styles.textSecondary,
        textStyle,
      ]}
    >
      {title}
    </Text>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity
        style={[
          styles.shadowPrimary,
          (loading || disabled) && styles.buttonDisabled,
          style,
        ]}
        onPress={onPress}
        disabled={loading || disabled}
        activeOpacity={0.85}
        {...props}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary ? styles.buttonSecondary : styles.buttonGhost,
        (loading || disabled) && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadowPrimary: {
    borderRadius: BORDER_RADIUS.md,
    width: "100%",
    ...SHADOWS.glowPrimary,
  },
  gradient: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    fontWeight: "800",
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
