import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
  SHADOWS,
} from "../../constants/theme";

const ConfirmModal = ({
  visible,
  title = "Confirmar",
  message = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  destructive = false,
  loading = false,
  icon = "help-outline",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={loading ? undefined : onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.accentBar} />

          <View style={styles.iconWrap}>
            <View
              style={[
                styles.iconCircle,
                destructive && styles.iconCircleDestructive,
              ]}
            >
              <MaterialIcons
                name={destructive ? "logout" : icon}
                size={32}
                color={destructive ? COLORS.error : COLORS.primary}
              />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.divider} />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnConfirm,
                destructive && styles.btnConfirmDestructive,
                loading && styles.btnDisabled,
              ]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.text} size="small" />
              ) : (
                <Text style={styles.btnConfirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: "rgba(216, 27, 96, 0.35)",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    overflow: "hidden",
    ...SHADOWS.cardDark,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: "20%",
    right: "20%",
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  iconWrap: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: "rgba(216, 27, 96, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(216, 27, 96, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleDestructive: {
    backgroundColor: COLORS.errorSoft,
    borderColor: "rgba(193, 41, 46, 0.4)",
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    marginBottom: SPACING.sm,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: SPACING.md - 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancelText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  btnConfirm: {
    flex: 1,
    paddingVertical: SPACING.md - 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.glowPrimary,
  },
  btnConfirmDestructive: {
    backgroundColor: COLORS.error,
    shadowColor: COLORS.error,
  },
  btnConfirmText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  btnDisabled: {
    opacity: 0.6,
  },
});

export default ConfirmModal;
