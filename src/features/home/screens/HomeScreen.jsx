import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Card,
  CurrencyText,
  MaskedNumber,
  LoadingSpinner,
  EmptyState,
  SectionTitle,
  formatCurrency,
} from "../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
  SHADOWS,
} from "../../../shared/constants/theme";
import { useAuthStore } from "../../../shared/store/authStore";
import { useAccounts } from "../hooks/useAccounts";

const HIDE_BALANCES_KEY = "hide_balances";

const typeLabel = {
  DEPOSIT: "Depósito",
  TRANSFER: "Transferencia",
  PAYMENT: "Pago",
};

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const {
    account,
    movements,
    loading,
    error,
    totalBalance,
    refresh,
  } = useAccounts();

  const [hideBalances, setHideBalances] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(HIDE_BALANCES_KEY).then((v) => {
      if (v === "1") setHideBalances(true);
    });
  }, []);

  const toggleHide = async () => {
    const next = !hideBalances;
    setHideBalances(next);
    await AsyncStorage.setItem(HIDE_BALANCES_KEY, next ? "1" : "0");
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const displayName =
    user?.name || user?.username || user?.email || "Usuario";

  const recent = movements.slice(0, 5);

  if (loading && !refreshing && !account) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + 80 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    >
      <View style={styles.topRow}>
        <View style={styles.flex1}>
          <Text style={styles.kicker}>Estado de cuenta</Text>
          <Text style={styles.greeting}>
            Hola de nuevo,{" "}
            <Text style={styles.greetingName}>{displayName}</Text>
          </Text>
        </View>
        <TouchableOpacity onPress={toggleHide} style={styles.eyeBtn} hitSlop={10}>
          <MaterialIcons
            name={hideBalances ? "visibility-off" : "visibility"}
            size={26}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <CurrencyText
          amount={totalBalance}
          hidden={hideBalances}
          style={styles.balanceValue}
          positive={totalBalance > 0}
        />
        {account?.accountNumber ? (
          <View style={styles.accountNumberRow}>
            <Text style={styles.accountNumberLabel}>Cuenta</Text>
            <MaskedNumber value={account.accountNumber} />
          </View>
        ) : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Card>

      <SectionTitle style={{ marginTop: SPACING.sm }}>
        Accesos rápidos
      </SectionTitle>
      <View style={styles.shortcuts}>
        <Shortcut
          icon="swap-horiz"
          label="Transferir"
          color={COLORS.primary}
          onPress={() => navigation.getParent()?.navigate("Transferencias")}
        />
        <Shortcut
          icon="receipt-long"
          label="Pagar"
          color={COLORS.purple}
          onPress={() => navigation.getParent()?.navigate("Pagos")}
        />
        <Shortcut
          icon="storefront"
          label="Catálogo"
          color={COLORS.cyan}
          onPress={() => navigation.getParent()?.navigate("Catálogo")}
        />
        <Shortcut
          icon="history"
          label="Historial"
          color={COLORS.fuchsiaGlow}
          onPress={() => navigation.getParent()?.navigate("Historial")}
        />
      </View>

      <SectionTitle style={{ marginTop: SPACING.md }}>
        Movimientos recientes
      </SectionTitle>
      {recent.length === 0 ? (
        <EmptyState message="Sin movimientos recientes" />
      ) : (
        recent.map((m) => (
          <TouchableOpacity
            key={m.id}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("MovementDetail", { movement: m })
            }
          >
            <Card style={styles.movementCard}>
              <View style={styles.accountRow}>
                <View
                  style={[
                    styles.movementIcon,
                    {
                      backgroundColor: m.isIncoming
                        ? COLORS.successSoft
                        : COLORS.errorSoft,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={m.isIncoming ? "arrow-downward" : "arrow-upward"}
                    size={18}
                    color={m.isIncoming ? COLORS.success : COLORS.error}
                  />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.movementTitle} numberOfLines={1}>
                    {m.description}
                  </Text>
                  <Text style={styles.movementMeta}>
                    {typeLabel[m.type] || m.type}
                    {m.createdAt
                      ? ` · ${new Date(m.createdAt).toLocaleDateString("es-GT")}`
                      : ""}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.movementAmount,
                    {
                      color: m.isIncoming ? COLORS.success : COLORS.error,
                    },
                  ]}
                >
                  {hideBalances
                    ? "••••"
                    : `${m.isIncoming ? "+" : "-"} ${formatCurrency(m.amount)}`}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const Shortcut = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.shortcut} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.shortcutIcon, { borderColor: color }]}>
      <MaterialIcons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.shortcutLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  flex1: { flex: 1 },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: LETTER_SPACING.wide,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },
  greeting: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
  },
  greetingName: {
    color: COLORS.text,
    fontWeight: "700",
  },
  eyeBtn: {
    padding: SPACING.sm,
  },
  balanceCard: {
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  balanceLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  balanceValue: {
    fontSize: FONT_SIZE.huge,
    fontWeight: "900",
  },
  accountNumberRow: {
    marginTop: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  accountNumberLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
  },
  errorText: {
    color: COLORS.error,
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.sm,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  shortcuts: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  shortcut: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  shortcutIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.inputBg,
  },
  shortcutLabel: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    textAlign: "center",
  },
  movementCard: {
    marginVertical: SPACING.xs,
    paddingVertical: SPACING.sm + 2,
  },
  movementIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  movementTitle: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },
  movementMeta: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  movementAmount: {
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },
});

export default HomeScreen;
