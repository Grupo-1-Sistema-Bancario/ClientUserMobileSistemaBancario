import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../../../shared/components/layout/ScreenHeader";
import ConfirmModal from "../../../../shared/components/common/ConfirmModal";
import { EmptyState, formatCurrency } from "../../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../../shared/constants/theme";
import { usePayments } from "../hooks/usePayments";

const PaymentsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { myProducts, loyaltyPoints, loading, loadMyProducts, handlePay } =
    usePayments();

  const [payProductId, setPayProductId] = useState(null);
  const [pointsProduct, setPointsProduct] = useState(null);

  useEffect(() => {
    loadMyProducts();
  }, []);

  const confirmPayment = async () => {
    if (!payProductId) return;
    await handlePay(payProductId, false);
    setPayProductId(null);
  };

  const confirmPointsPayment = async () => {
    if (!pointsProduct) return;
    await handlePay(pointsProduct._id, true);
    setPointsProduct(null);
  };

  const pointsMessage = pointsProduct
    ? loyaltyPoints >= pointsProduct.price
      ? `Tienes ${loyaltyPoints} pts. Tus puntos cubren la totalidad del pago. ¿Deseas confirmar?`
      : `Tienes ${loyaltyPoints} pts. Se vaciarán tus puntos y se debitarán Q${(
          pointsProduct.price - loyaltyPoints
        ).toFixed(2)} adicionales de tu cuenta. ¿Deseas continuar?`
    : "";

  return (
    <View style={styles.flex}>
      <ScreenHeader
        navigation={navigation}
        title="Mis Pagos"
        subtitle="Gestión de productos adquiridos"
      />

      <View style={styles.pointsBox}>
        <Text style={styles.pointsLabel}>Puntos disponibles</Text>
        <Text style={styles.pointsValue}>{loyaltyPoints}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING.xl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadMyProducts}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {!loading && myProducts.length === 0 ? (
          <EmptyState message="No tienes productos pendientes por pagar. Ve al catálogo." />
        ) : (
          myProducts.map((product) => {
            const pointsEarned = Math.floor((product.price || 0) / 10);
            return (
              <View key={product._id} style={styles.card}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  Compra realizada · +{pointsEarned} pts
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Cuota a pagar</Text>
                  <Text style={styles.priceValue}>
                    {formatCurrency(product.price)}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => setPayProductId(product._id)}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.payBtnText}>Pagar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pointsBtn,
                      loyaltyPoints === 0 && styles.pointsBtnDisabled,
                    ]}
                    onPress={() => setPointsProduct(product)}
                    disabled={loading || loyaltyPoints === 0}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.pointsBtnText}>Canjear pts</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <ConfirmModal
        visible={!!payProductId}
        title="¿Confirmar el pago?"
        message="Se debitará el monto de tu cuenta y el servicio se dará de baja hasta que lo vuelvas a adquirir. ¿Deseas continuar?"
        confirmText="Pagar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmPayment}
        onCancel={() => !loading && setPayProductId(null)}
      />

      <ConfirmModal
        visible={!!pointsProduct}
        title="Canjear puntos"
        message={pointsMessage}
        confirmText="Confirmar canje"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmPointsPayment}
        onCancel={() => !loading && setPointsProduct(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "transparent" },
  pointsBox: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pointsLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    fontWeight: "700",
  },
  pointsValue: {
    color: COLORS.cyan,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  content: { paddingHorizontal: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  productName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  productMeta: {
    color: COLORS.cyanDeep,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    marginTop: 4,
  },
  priceRow: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
  },
  priceValue: {
    color: COLORS.cyan,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  payBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md - 2,
    alignItems: "center",
  },
  payBtnText: { color: COLORS.text, fontWeight: "800", fontSize: FONT_SIZE.sm },
  pointsBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md - 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.fuchsiaGlow,
    backgroundColor: "transparent",
  },
  pointsBtnDisabled: { opacity: 0.4 },
  pointsBtnText: {
    color: COLORS.fuchsiaGlow,
    fontWeight: "800",
    fontSize: FONT_SIZE.sm,
  },
});

export default PaymentsScreen;
