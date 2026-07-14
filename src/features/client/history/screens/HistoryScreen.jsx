import { useEffect, useState } from "react";
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
import ScreenHeader from "../../../../shared/components/layout/ScreenHeader";
import {
  Card,
  EmptyState,
  LoadingSpinner,
  formatCurrency,
  maskAccountNumber,
} from "../../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../../shared/constants/theme";
import { useAccounts } from "../../../home/hooks/useAccounts";

const typeLabel = {
  DEPOSIT: "Depósito",
  TRANSFER: "Transferencia",
  PAYMENT: "Pago",
};

const FILTERS = [
  { key: null, label: "Todos" },
  { key: "DEPOSIT", label: "Depósito" },
  { key: "TRANSFER", label: "Transfer." },
  { key: "PAYMENT", label: "Pago" },
];

const HistoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { movements, loading, error, fetchMovements } = useAccounts();
  const [typeFilter, setTypeFilter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (filter) => {
    await fetchMovements({ type: filter || undefined, page: 1, pageSize: 50 });
  };

  useEffect(() => {
    load(typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(typeFilter);
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const reversed = item.status === "REVERSED";
    const counterpartyNumber = item.isIncoming
      ? item.accountFrom?.accountNumber
      : item.accountTo?.accountNumber;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("MovementDetail", { movement: item })}
      >
        <Card style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.typeRow}>
              <View
                style={[
                  styles.dirIcon,
                  {
                    backgroundColor: item.isIncoming
                      ? COLORS.successSoft
                      : COLORS.errorSoft,
                  },
                ]}
              >
                <MaterialIcons
                  name={item.isIncoming ? "arrow-downward" : "arrow-upward"}
                  size={16}
                  color={item.isIncoming ? COLORS.success : COLORS.error}
                />
              </View>
              <Text style={styles.type}>
                {typeLabel[item.type] || item.type}
              </Text>
            </View>
            {reversed ? (
              <View style={styles.badgeBad}>
                <Text style={styles.badgeTextBad}>REVERTIDO</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.date}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleString("es-GT")
              : "—"}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.description || "Transacción procesada correctamente"}
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.flex1}>
              <Text style={styles.refLabel}>
                {item.isIncoming ? "De la cuenta" : "A la cuenta"}
              </Text>
              <Text style={styles.refValue}>
                {counterpartyNumber
                  ? maskAccountNumber(counterpartyNumber)
                  : "—"}
              </Text>
            </View>
            <View style={styles.amountCol}>
              <Text style={styles.refLabel}>Monto</Text>
              <Text
                style={[
                  styles.amount,
                  { color: item.isIncoming ? COLORS.success : COLORS.error },
                ]}
              >
                {`${item.isIncoming ? "+" : "-"} ${formatCurrency(item.amount)}`}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader
        navigation={navigation}
        title="Historial"
        subtitle="Registro de transacciones"
      />

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = typeFilter === f.key;
          return (
            <TouchableOpacity
              key={String(f.key)}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setTypeFilter(f.key)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && movements.length === 0 && !refreshing ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + SPACING.xl },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <EmptyState message="No hay movimientos con estos filtros." />
            ) : null
          }
          ListHeaderComponent={
            error ? <Text style={styles.errorText}>{error}</Text> : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "transparent" },
  content: { paddingHorizontal: SPACING.md },
  flex1: { flex: 1 },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
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
  card: {
    marginBottom: SPACING.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  dirIcon: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  type: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  badgeBad: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    backgroundColor: COLORS.errorSoft,
    borderColor: COLORS.error,
  },
  badgeTextBad: {
    color: COLORS.error,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
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
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
  },
});

export default HistoryScreen;
