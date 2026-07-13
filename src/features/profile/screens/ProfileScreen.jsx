import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../../shared/components/common/Button";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import {
  Card,
  SectionTitle,
  formatCurrency,
  LoadingSpinner,
} from "../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../shared/constants/theme";
import { useAuthStore } from "../../../shared/store/authStore";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAccounts } from "../../home/hooks/useAccounts";

const displayOrDash = (value) => {
  if (value == null || value === "") return "—";
  return String(value);
};

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { logout, loading: logoutLoading } = useAuth();
  const { account, loading, refresh } = useAccounts();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const name =
    [user?.name, user?.surname].filter(Boolean).join(" ") ||
    user?.username ||
    "Cliente";

  const phone = account?.phone || user?.phone;
  const address = account?.address || user?.address;
  const accountNumber = account?.accountNumber;
  const jobName = account?.jobName;
  const monthlyIncome = account?.monthlyIncome;

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const onConfirmLogout = async () => {
    await logout();
    setLogoutVisible(false);
  };

  if (loading && !account && !refreshing) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + SPACING.xl },
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
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.kicker}>Perfil</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{displayOrDash(user?.email)}</Text>
        </View>

        <SectionTitle>Datos personales</SectionTitle>
        <Card style={styles.card}>
          <InfoRow label="Usuario" value={displayOrDash(user?.username)} />
          <InfoRow label="Correo" value={displayOrDash(user?.email)} />
          <InfoRow label="Teléfono" value={displayOrDash(phone)} last />
        </Card>

        <SectionTitle style={{ marginTop: SPACING.sm }}>
          Cuenta bancaria
        </SectionTitle>
        <Card style={styles.card}>
          <InfoRow
            label="Número de cuenta"
            value={displayOrDash(accountNumber)}
          />
          <InfoRow label="Dirección" value={displayOrDash(address)} />
          <InfoRow label="Trabajo" value={displayOrDash(jobName)} />
          <InfoRow
            label="Ingreso mensual"
            value={
              monthlyIncome != null && !Number.isNaN(monthlyIncome)
                ? formatCurrency(monthlyIncome)
                : "—"
            }
            last
          />
        </Card>

        <Button
          title="Cerrar sesión"
          variant="secondary"
          onPress={() => setLogoutVisible(true)}
          loading={logoutLoading}
          style={styles.logout}
        />
      </ScrollView>

      <ConfirmModal
        visible={logoutVisible}
        title="Cerrar sesión"
        message="¿Deseas salir de Astra Bank?"
        confirmText="Salir"
        cancelText="Cancelar"
        destructive
        loading={logoutLoading}
        onCancel={() => !logoutLoading && setLogoutVisible(false)}
        onConfirm={onConfirmLogout}
      />
    </View>
  );
};

const InfoRow = ({ label, value, last }) => (
  <View style={[styles.row, !last && styles.rowBorder]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "transparent",
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerCard: {
    alignItems: "center",
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  kicker: {
    color: COLORS.cyan,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: LETTER_SPACING.ultra,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },
  name: {
    textAlign: "center",
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
  },
  email: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
  },
  card: {
    marginBottom: SPACING.md,
  },
  row: {
    paddingVertical: SPACING.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    fontWeight: "600",
  },
  rowValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  logout: {
    marginTop: SPACING.md,
  },
});

export default ProfileScreen;
