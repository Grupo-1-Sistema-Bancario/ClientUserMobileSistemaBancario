import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../../../shared/components/layout/ScreenHeader";
import { EmptyState, formatCurrency } from "../../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../../shared/constants/theme";
import { useHistoryStore } from "../store/useHistoryStore";

const typeLabel = {
  DEPOSIT: "Depósito",
  TRANSFER: "Transferencia",
  PAYMENT: "Pago",
};

const HistoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { transactions, loading, fetchMyTransactions } = useHistoryStore();

  useEffect(() => {
    fetchMyTransactions();
  }, []);

  const renderItem = ({ item }) => {
    const reversed = item.status === "REVERSED";
    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.type}>
            {typeLabel[item.type] || item.type}
          </Text>
          <View
            style={[styles.badge, reversed ? styles.badgeBad : styles.badgeOk]}
          >
            <Text
              style={[
                styles.badgeText,
                reversed ? styles.badgeTextBad : styles.badgeTextOk,
              ]}
            >
              {item.status || "COMPLETED"}
            </Text>
          </View>
        </View>

        <Text style={styles.date}>
          {new Date(item.date || item.createdAt).toLocaleString("es-GT")}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description || "Transacción procesada correctamente"}
        </Text>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.refLabel}>Ref ID</Text>
            <Text style={styles.refValue}>
              {item._id ? String(item._id).substring(0, 8) : "—"}
            </Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.refLabel}>Monto</Text>
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader
        navigation={navigation}
        title="Historial"
        subtitle="Registro de transacciones"
      />
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING.xl },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <EmptyState message="Aún no tienes transacciones registradas." />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMyTransactions}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
  },
  badgeOk: {
    backgroundColor: COLORS.successSoft,
    borderColor: COLORS.success,
  },
  badgeBad: { backgroundColor: COLORS.errorSoft, borderColor: COLORS.error },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  badgeTextOk: { color: COLORS.success },
  badgeTextBad: { color: COLORS.error },
  date: {
    color: COLORS.cyanDeep,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    marginTop: SPACING.sm,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  amountCol: { alignItems: "flex-end" },
  refLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    marginBottom: 2,
  },
  refValue: {
    color: COLORS.textSecondary,
    fontFamily: "monospace",
    fontSize: FONT_SIZE.xs,
  },
  amount: {
    color: COLORS.fuchsiaGlow,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
  },
});

export default HistoryScreen;
