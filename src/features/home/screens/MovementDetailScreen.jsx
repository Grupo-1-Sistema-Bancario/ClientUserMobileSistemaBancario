import { View, Text, StyleSheet, Share, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../../shared/components/common/Button";
import { Card, formatCurrency, maskAccountNumber } from "../../../shared/components/common/Common";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../shared/constants/theme";

const typeLabel = {
  DEPOSIT: "Depósito",
  TRANSFER: "Transferencia",
  PAYMENT: "Pago",
};

const MovementDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const movement = route.params?.movement;

  if (!movement) {
    return (
      <View style={[styles.flex, styles.center]}>
        <Text style={styles.muted}>Movimiento no encontrado</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const fromNumber =
    movement.accountFrom?.accountNumber ||
    (typeof movement.accountFrom === "string" ? movement.accountFrom : null);
  const toNumber =
    movement.accountTo?.accountNumber ||
    (typeof movement.accountTo === "string" ? movement.accountTo : null);

  const shareReceipt = async () => {
    const lines = [
      "Comprobante Astra Bank",
      "----------------------",
      `Tipo: ${typeLabel[movement.type] || movement.type}`,
      `Monto: ${movement.isIncoming ? "+" : "-"} ${formatCurrency(movement.amount)}`,
      `Descripción: ${movement.description || "—"}`,
      `Estado: ${movement.status || "COMPLETED"}`,
      `Fecha: ${movement.createdAt
        ? new Date(movement.createdAt).toLocaleString("es-GT")
        : "—"
      }`,
      fromNumber ? `Origen: ${maskAccountNumber(fromNumber)}` : null,
      toNumber ? `Destino: ${maskAccountNumber(toNumber)}` : null,
      `ID: ${movement.id}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await Share.share({ message: lines, title: "Comprobante" });
    } catch {
      /* el usuario canceló el compartir */
    }
  };

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del movimiento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: SPACING.md,
          paddingBottom: insets.bottom + SPACING.xl,
        }}
      >
        <Card style={styles.hero}>
          <Text style={styles.kicker}>
            {typeLabel[movement.type] || movement.type}
          </Text>
          <Text
            style={[
              styles.amount,
              {
                color: movement.isIncoming ? COLORS.success : COLORS.error,
              },
            ]}
          >
            {`${movement.isIncoming ? "+" : "-"} ${formatCurrency(movement.amount)}`}
          </Text>
          <Text style={styles.desc}>{movement.description}</Text>
        </Card>

        <Card>
          <Row label="Fecha" value={
            movement.createdAt
              ? new Date(movement.createdAt).toLocaleString("es-GT")
              : "—"
          } />
          <Row label="Tipo" value={typeLabel[movement.type] || movement.type} />
          <Row label="Estado" value={movement.status || "COMPLETED"} />
          {fromNumber ? (
            <Row label="Cuenta origen" value={maskAccountNumber(fromNumber)} />
          ) : null}
          {toNumber ? (
            <Row label="Cuenta destino" value={maskAccountNumber(toNumber)} />
          ) : null}
          <Row label="Referencia" value={String(movement.id)} last />
        </Card>

        <Button
          title="Compartir comprobante"
          onPress={shareReceipt}
          style={{ marginTop: SPACING.lg }}
        />
      </ScrollView>
    </View>
  );
};

const Row = ({ label, value, last }) => (
  <View style={[styles.row, !last && styles.rowBorder]}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  muted: {
    color: COLORS.textSecondary,
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
  hero: {
    alignItems: "center",
    marginBottom: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: LETTER_SPACING.wide,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
  },
  amount: {
    fontSize: FONT_SIZE.huge,
    fontWeight: "900",
  },
  desc: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
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
  },
  rowValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
});

export default MovementDetailScreen;
