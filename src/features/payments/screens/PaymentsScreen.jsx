import { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Card,
  CurrencyText,
  LoadingSpinner,
  EmptyState,
} from "../../../shared/components/common/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { useAccountStore, selectBalance } from "../../../shared/store/accountStore";
import { usePayments } from "../hooks/usePayments";
import PendingProductCard from "../components/PendingProductCard";
import LoyaltyCard from "../components/LoyaltyCard";
import PaymentConfirmModal from "../components/PaymentConfirmModal";

const PaymentsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const balance = useAccountStore(selectBalance);
  const {
    pendingProducts,
    loyaltyPoints,
    loading,
    payingId,
    error,
    refresh,
    handlePay,
  } = usePayments();

  const [refreshing, setRefreshing] = useState(false);
  const [selection, setSelection] = useState(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const confirmPayment = async () => {
    const { product, usePoints } = selection || {};
    setSelection(null);
    if (product) await handlePay(product.id, usePoints);
  };

  if (loading && !refreshing && pendingProducts.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <FlatList
        data={pendingProducts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: SPACING.md,
          paddingBottom: insets.bottom + SPACING.xl,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Pagos pendientes</Text>
            <Card style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Saldo disponible</Text>
              <CurrencyText
                amount={balance}
                style={styles.balanceValue}
                positive={balance > 0}
              />
            </Card>
            <LoyaltyCard points={loyaltyPoints} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyState message="No tienes productos o servicios pendientes de pago" />
            <TouchableOpacity
              style={styles.catalogLink}
              onPress={() => navigation.getParent()?.navigate("Catálogo")}
              activeOpacity={0.85}
            >
              <Text style={styles.catalogLinkText}>Ir al catálogo</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <PendingProductCard
            product={item}
            hasPoints={loyaltyPoints > 0}
            paying={payingId === item.id}
            onPay={() => setSelection({ product: item, usePoints: false })}
            onRedeem={() => setSelection({ product: item, usePoints: true })}
          />
        )}
      />

      <PaymentConfirmModal
        visible={!!selection}
        product={selection?.product}
        usePoints={!!selection?.usePoints}
        loyaltyPoints={loyaltyPoints}
        balance={balance}
        loading={payingId === selection?.product?.id}
        onConfirm={confirmPayment}
        onCancel={() => setSelection(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },
  balanceCard: {
    marginBottom: SPACING.md,
  },
  balanceLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  balanceValue: {
    fontSize: FONT_SIZE.xxl,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  emptyWrap: {
    alignItems: "center",
  },
  catalogLink: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 999,
  },
  catalogLinkText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },
});

export default PaymentsScreen;
