import { Modal, View, Text, StyleSheet, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatCurrency } from "../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
  SHADOWS,
} from "../../../shared/constants/theme";
import { calculateDiscount, calculatePointsEarned } from "../../../shared/constants/loyalty";

const PaymentConfirmModal = ({
  visible,
  product,
  usePoints,
  loyaltyPoints,
  balance,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!product) return null;

  const discount = usePoints ? calculateDiscount(product.price, loyaltyPoints) : 0;
  const amountToPay = product.price - discount;
  const pointsEarned = calculatePointsEarned(amountToPay);
  const insufficientFunds = balance < amountToPay;

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
          <Text style={styles.title}>Confirmar pago</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.breakdown}>
            <Row label="Precio" value={formatCurrency(product.price)} />
            {usePoints ? (
              <Row
                label={`Descuento (${discount} pts)`}
                value={`- ${formatCurrency(discount)}`}
                highlight
              />
            ) : null}
            <Row label="Total a pagar" value={formatCurrency(amountToPay)} bold />
            <Row label="Puntos que ganarás" value={`+${pointsEarned} pts`} highlight />
          </View>

          {insufficientFunds ? (
            <View style={styles.warningBox}>
              <MaterialIcons name="error-outline" size={18} color={COLORS.error} />
              <Text style={styles.warningText}>
                Fondos insuficientes. Tu saldo es {formatCurrency(balance)}.
              </Text>
            </View>
          ) : (
            <Text style={styles.note}>
              Al confirmar, el servicio se dará de baja hasta que lo adquieras de nuevo.
            </Text>
          )}

          <View style={styles.divider} />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnConfirm,
                (loading || insufficientFunds) && styles.btnDisabled,
              ]}
              onPress={onConfirm}
              disabled={loading || insufficientFunds}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.text} size="small" />
              ) : (
                <Text style={styles.btnConfirmText}>Confirmar pago</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const Row = ({ label, value, bold, highlight }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text
      style={[
        styles.rowValue,
        bold && styles.rowValueBold,
        highlight && styles.rowValueHighlight,
      ]}
    >
      {value}
    </Text>
  </View>
);

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
    maxWidth: 380,
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
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    marginBottom: SPACING.xs,
  },
  productName: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  breakdown: {
    backgroundColor: COLORS.inputBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  rowLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  rowValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  rowValueBold: {
    fontWeight: "900",
    fontSize: FONT_SIZE.md,
  },
  rowValueHighlight: {
    color: COLORS.success,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.errorSoft,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  warningText: {
    flex: 1,
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
  },
  note: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    textAlign: "center",
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
  btnConfirmText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  btnDisabled: {
    opacity: 0.6,
  },
});

export default PaymentConfirmModal;
