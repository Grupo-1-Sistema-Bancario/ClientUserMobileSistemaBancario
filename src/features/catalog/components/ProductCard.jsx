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

const ProductCard = ({ product, isAcquired, acquiring, onAcquire, onGoToPayments }) => {
  const payable = isPayable(product.price);

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {TYPE_LABEL[product.type] || product.type}
          </Text>
        </View>
        <View style={styles.pointsChip}>
          <MaterialIcons name="stars" size={14} color={COLORS.warning} />
          <Text style={styles.pointsText}>+{product.pointsToEarn} pts</Text>
        </View>
      </View>

      <Text style={styles.name}>{product.name}</Text>
      {product.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
      ) : null}

      <View style={styles.footerRow}>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>

        {isAcquired ? (
          <TouchableOpacity
            style={styles.acquiredBtn}
            onPress={onGoToPayments}
            activeOpacity={0.85}
          >
            <MaterialIcons name="check-circle" size={16} color={COLORS.success} />
            <Text style={styles.acquiredBtnText}>Ir a pagos</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.buyBtn, !payable && styles.buyBtnDisabled]}
            onPress={onAcquire}
            disabled={acquiring || !payable}
            activeOpacity={0.85}
          >
            <Text style={styles.buyBtnText}>
              {payable ? (acquiring ? "Adquiriendo..." : "Adquirir") : "No disponible"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  pointsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  description: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  buyBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  buyBtnDisabled: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buyBtnText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  acquiredBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.successSoft,
  },
  acquiredBtnText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
});

export default ProductCard;
