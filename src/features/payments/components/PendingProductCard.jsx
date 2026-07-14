import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, formatCurrency } from "../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../shared/constants/theme";
import { isPayable } from "../../../shared/constants/loyalty";

const TYPE_LABEL = {
  PRODUCT: "Producto",
  SERVICE: "Servicio",
};

const PendingProductCard = ({ product, hasPoints, paying, onPay, onRedeem }) => {
  const payable = isPayable(product.price);

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {TYPE_LABEL[product.type] || product.type}
          </Text>
        </View>
        <Text style={styles.pointsText}>+{product.pointsToEarn} pts</Text>
      </View>

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{formatCurrency(product.price)}</Text>

      {payable ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.payBtn}
            onPress={onPay}
            disabled={paying}
            activeOpacity={0.85}
          >
            <Text style={styles.payBtnText}>Pagar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.redeemBtn, !hasPoints && styles.redeemBtnDisabled]}
            onPress={onRedeem}
            disabled={paying || !hasPoints}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name="stars"
              size={16}
              color={hasPoints ? COLORS.warning : COLORS.textTertiary}
            />
            <Text
              style={[
                styles.redeemBtnText,
                !hasPoints && styles.redeemBtnTextDisabled,
              ]}
            >
              Canjear pts
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.unavailable}>
          No se puede pagar desde la app: el monto supera el límite permitido.
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeBadgeText: {
    color: COLORS.cyan,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
  },
  pointsText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  price: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  payBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  payBtnText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  redeemBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.warning,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
  },
  redeemBtnDisabled: {
    borderColor: COLORS.border,
  },
  redeemBtnText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  redeemBtnTextDisabled: {
    color: COLORS.textTertiary,
  },
  unavailable: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
  },
});

export default PendingProductCard;
