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
import { useCatalog } from "../hooks/useCatalog";
import { usePaymentStore } from "../../payments/store/usePaymentStore";

const CatalogScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { products, loading, loadCatalog, handleBuy } = useCatalog();
  const { myProducts, fetchMyProducts } = usePaymentStore();
  const [buyProductId, setBuyProductId] = useState(null);

  const refresh = async () => {
    await Promise.all([loadCatalog(), fetchMyProducts()]);
  };

  useEffect(() => {
    refresh();
  }, []);

  const confirmBuy = async () => {
    if (!buyProductId) return;
    const result = await handleBuy(buyProductId);
    setBuyProductId(null);
    if (result.success) await fetchMyProducts();
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader
        navigation={navigation}
        title="Catálogo"
        subtitle="Productos y servicios"
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING.xl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {!loading && products.length === 0 ? (
          <EmptyState message="No hay productos disponibles por ahora." />
        ) : (
          products.map((product) => {
            const isAcquired = myProducts.some(
              (mp) => mp._id === product._id,
            );
            const points = Math.floor((product.price || 0) / 10);
            return (
              <View key={product._id} style={styles.card}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  Astra Bank · +{points} pts
                </Text>

                {product.description ? (
                  <Text style={styles.description} numberOfLines={3}>
                    {product.description}
                  </Text>
                ) : null}

                <View style={styles.infoRow}>
                  <View>
                    <Text style={styles.infoLabel}>Tipo</Text>
                    <Text style={styles.infoValue}>{product.type || "—"}</Text>
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={styles.infoLabel}>Precio</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(product.price)}
                    </Text>
                  </View>
                </View>

                {isAcquired ? (
                  <Text style={styles.acquiredNote}>
                    * Debes pagar este producto en "Mis Pagos" para adquirirlo
                    de nuevo.
                  </Text>
                ) : null}

                <TouchableOpacity
                  style={[styles.buyBtn, isAcquired && styles.buyBtnDisabled]}
                  onPress={() => setBuyProductId(product._id)}
                  disabled={loading || isAcquired}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.buyBtnText,
                      isAcquired && styles.buyBtnTextDisabled,
                    ]}
                  >
                    {isAcquired ? "Comprado" : "Comprar"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <ConfirmModal
        visible={!!buyProductId}
        title="¿Confirmar adquisición?"
        message="Estás a punto de agregar este producto/servicio a tu cuenta. ¿Deseas continuar?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmBuy}
        onCancel={() => !loading && setBuyProductId(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "transparent" },
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
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: SPACING.md,
  },
  priceCol: { alignItems: "flex-end" },
  infoLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    marginBottom: 2,
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  priceValue: {
    color: COLORS.cyan,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  acquiredNote: {
    color: COLORS.fuchsiaGlow,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    marginTop: SPACING.sm,
  },
  buyBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md - 2,
    alignItems: "center",
  },
  buyBtnDisabled: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buyBtnText: { color: COLORS.text, fontWeight: "800", fontSize: FONT_SIZE.sm },
  buyBtnTextDisabled: { color: COLORS.textSecondary },
});

export default CatalogScreen;
