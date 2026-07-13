import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Card,
  CurrencyText,
  MaskedNumber,
  LoadingSpinner,
  EmptyState,
  formatCurrency,
} from "../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../shared/constants/theme";
import { useAccounts } from "../hooks/useAccounts";

const FILTERS = [
  { key: null, label: "Todos" },
  { key: "DEPOSIT", label: "Depósito" },
  { key: "TRANSFER", label: "Transfer." },
  { key: "PAYMENT", label: "Pago" },
];

const typeLabel = {
  DEPOSIT: "Depósito",
  TRANSFER: "Transferencia",
  PAYMENT: "Pago",
};

const AccountDetailScreen = ({ navigation, route }) => {
  const { accountId } = route.params || {};
  const insets = useSafeAreaInsets();
  const {
    account,
    movements,
    loading,
    error,
    fetchAccount,
    fetchMovements,
  } = useAccounts();

  const [typeFilter, setTypeFilter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await fetchAccount(accountId);
    await fetchMovements({ type: typeFilter || undefined, page: 1, pageSize: 50 });
  }, [accountId, fetchAccount, fetchMovements, typeFilter]);

  useEffect(() => {
    load();
  }, [typeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading && !account && !refreshing) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de cuenta</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={movements}
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
            <Card style={styles.infoCard}>
              <Text style={styles.kicker}>{account?.type || "Cuenta"}</Text>
              <Text style={styles.alias}>{account?.alias || "Cuenta"}</Text>
              <MaskedNumber
                value={account?.accountNumber}
                style={styles.number}
              />
              <Text style={styles.balanceLabel}>Saldo disponible</Text>
              <CurrencyText
                amount={account?.balance || 0}
                style={styles.balance}
                positive={(account?.balance || 0) > 0}
              />
            </Card>

            <Text style={styles.section}>Historial</Text>
            <View style={styles.filters}>
              {FILTERS.map((f) => {
                const active = typeFilter === f.key;
                return (
                  <TouchableOpacity
                    key={String(f.key)}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setTypeFilter(f.key)}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </>
        }
        ListEmptyComponent={
          <EmptyState message="No hay movimientos con estos filtros" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("MovementDetail", { movement: item })
            }
          >
            <Card style={styles.row}>
              <View style={styles.rowInner}>
                <View style={styles.flex1}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {typeLabel[item.type] || item.type}
                    {item.createdAt
                      ? ` · ${new Date(item.createdAt).toLocaleString("es-GT")}`
                      : ""}
                  </Text>
                </View>
                <Text
                  style={{
                    color: item.isIncoming ? COLORS.success : COLORS.error,
                    fontWeight: "700",
                  }}
                >
                  {`${item.isIncoming ? "+" : "-"} ${formatCurrency(item.amount)}`}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
  },
  infoCard: {
    marginBottom: SPACING.md,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: LETTER_SPACING.wide,
    textTransform: "uppercase",
  },
  alias: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    marginTop: SPACING.xs,
  },
  number: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  balanceLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  balance: {
    fontSize: FONT_SIZE.xxl,
    marginTop: SPACING.xs,
  },
  section: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  chipTextActive: {
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  row: {
    marginVertical: 4,
    paddingVertical: SPACING.sm,
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  flex1: { flex: 1 },
  rowTitle: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },
  rowMeta: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
});

export default AccountDetailScreen;
