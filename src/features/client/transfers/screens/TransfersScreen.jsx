import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ScreenHeader from "../../../../shared/components/layout/ScreenHeader";
import { Card, CurrencyText } from "../../../../shared/components/common/Common";
import Input from "../../../../shared/components/common/Input";
import Button from "../../../../shared/components/common/Button";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  GRADIENTS,
} from "../../../../shared/constants/theme";
import { useTransfers } from "../hooks/useTransfers";
import { useAccounts } from "../../../home/hooks/useAccounts";

const Notice = ({ icon = "info-outline", title, text }) => (
  <LinearGradient
    colors={["rgba(216,27,96,0.16)", "rgba(123,47,190,0.16)"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.notice}
  >
    <View style={styles.noticeIcon}>
      <MaterialIcons name={icon} size={18} color={COLORS.text} />
    </View>
    <View style={styles.noticeBody}>
      <Text style={styles.noticeTitle}>{title}</Text>
      <Text style={styles.noticeText}>{text}</Text>
    </View>
  </LinearGradient>
);

const TransfersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { loading, lookupLoading, handleTransfer, handleCheckAccountNumber } =
    useTransfers();
  const { account, refresh: refreshAccount } = useAccounts();

  const [step, setStep] = useState("number"); // "number" | "confirm" | "amount"
  const [verifiedAccount, setVerifiedAccount] = useState(null);

  const numberForm = useForm({ defaultValues: { accountNumberTo: "" } });
  const amountForm = useForm({
    defaultValues: { amount: "", description: "" },
  });

  const onSubmitNumber = async (data) => {
    await handleCheckAccountNumber(data.accountNumberTo, (acc) => {
      setVerifiedAccount(acc);
      setStep("confirm");
    });
  };

  const goBackToNumber = () => {
    setStep("number");
    setVerifiedAccount(null);
    amountForm.reset({ amount: "", description: "" });
  };

  const confirmAccount = () => {
    setStep("amount");
  };

  const onSubmitAmount = (data) => {
    handleTransfer(
      { accountNumberTo: verifiedAccount.accountNumber, ...data },
      () => {
        amountForm.reset({ amount: "", description: "" });
        numberForm.reset({ accountNumberTo: "" });
        setVerifiedAccount(null);
        setStep("number");
        refreshAccount();
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader
        navigation={navigation}
        title="Transferencias"
        subtitle="Movimiento seguro entre cuentas"
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === "number" && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Nueva transferencia</Text>

            <Controller
              control={numberForm.control}
              name="accountNumberTo"
              rules={{
                required: "El número de cuenta es obligatorio",
                pattern: {
                  value: /^\d{10}$/,
                  message: "El número de cuenta debe tener 10 dígitos",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Número de cuenta destino"
                  placeholder="Ej. 0000000000"
                  keyboardType="number-pad"
                  maxLength={10}
                  onBlur={onBlur}
                  onChangeText={(t) => onChange(t.replace(/\D/g, ""))}
                  value={value}
                  error={numberForm.formState.errors.accountNumberTo?.message}
                />
              )}
            />

            <Notice
              icon="info-outline"
              title="Antes de continuar"
              text="Te pediremos que confirmes el número de cuenta antes de indicar el monto a transferir."
            />

            <Button
              title={lookupLoading ? "Verificando..." : "Verificar cuenta"}
              onPress={numberForm.handleSubmit(onSubmitNumber)}
              loading={lookupLoading}
            />
          </Card>
        )}

        {step === "confirm" && verifiedAccount && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Confirmar cuenta</Text>

            <View style={styles.destinationCard}>
              <View style={styles.destinationBadge}>
                <MaterialIcons
                  name="account-balance"
                  size={24}
                  color={COLORS.text}
                />
              </View>
              <View style={styles.destinationInfo}>
                <Text style={styles.destLabel}>
                  {verifiedAccount.isFavorite
                    ? "Cuenta guardada en favoritos"
                    : "Número de cuenta destino"}
                </Text>
                {verifiedAccount.isFavorite && (
                  <Text style={styles.destName}>
                    {verifiedAccount.alias || "Sin alias"}
                  </Text>
                )}
                <Text style={styles.destNumber}>
                  {verifiedAccount.accountNumber}
                </Text>
              </View>
            </View>

            <Notice
              icon="verified-user"
              title="¿Es esta la cuenta?"
              text="Verifica que el número de cuenta corresponda al destinatario antes de continuar. La transferencia se procesa de inmediato."
            />

            <View style={styles.buttonRow}>
              <View style={styles.buttonHalf}>
                <Button
                  title="Cambiar número"
                  variant="secondary"
                  onPress={goBackToNumber}
                />
              </View>
              <View style={styles.buttonHalf}>
                <Button title="Sí, continuar" onPress={confirmAccount} />
              </View>
            </View>
          </Card>
        )}

        {step === "amount" && verifiedAccount && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Monto a transferir</Text>

            <View style={styles.destinationCardSmall}>
              <Text style={styles.destLabel}>Destino</Text>
              {verifiedAccount.isFavorite && (
                <Text style={styles.destName}>
                  {verifiedAccount.alias || "Sin alias"}
                </Text>
              )}
              <Text style={styles.destNumber}>
                {verifiedAccount.accountNumber}
              </Text>
              <TouchableOpacity onPress={goBackToNumber} hitSlop={8}>
                <Text style={styles.changeLink}>Cambiar destino</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.balanceCard}>
              <Text style={styles.destLabel}>Saldo disponible</Text>
              <CurrencyText
                amount={account?.balance}
                currency={account?.currency}
                style={styles.balanceAmount}
              />
            </View>

            <Controller
              control={amountForm.control}
              name="amount"
              rules={{
                required: "El monto es obligatorio",
                validate: (v) => {
                  const n = Number(v);
                  if (Number.isNaN(n) || n <= 0)
                    return "El monto debe ser mayor a 0";
                  if (n > 2000) return "El monto no puede exceder de Q2000";
                  if (account && n > account.balance)
                    return "No tienes saldo suficiente para este monto";
                  return true;
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Monto (Q)"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={amountForm.formState.errors.amount?.message}
                />
              )}
            />

            <Controller
              control={amountForm.control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Descripción (opcional)"
                  placeholder="Motivo de la transferencia"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Notice
              icon="bolt"
              title="Antes de enviar"
              text="La transferencia se procesa de inmediato y no se puede revertir."
            />

            <Button
              title={loading ? "Procesando..." : "Transferir fondos"}
              onPress={amountForm.handleSubmit(onSubmitAmount)}
              loading={loading}
            />
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "transparent" },
  content: { paddingHorizontal: SPACING.md },
  card: { padding: SPACING.lg },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: "rgba(244,114,182,0.35)",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  noticeIcon: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(244,114,182,0.25)",
  },
  noticeBody: { flex: 1 },
  noticeTitle: {
    color: COLORS.fuchsiaGlow,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  noticeText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  destinationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  destinationCardSmall: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  destinationBadge: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GRADIENTS.button[0],
  },
  destinationInfo: { flex: 1 },
  destLabel: {
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  destName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  destNumber: {
    fontFamily: "monospace",
    fontSize: FONT_SIZE.sm,
    color: GRADIENTS.button[0],
    fontWeight: "600",
  },
  changeLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    marginTop: SPACING.sm,
    textTransform: "uppercase",
  },
  balanceCard: {
    backgroundColor: COLORS.surfaceGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  balanceAmount: {
    fontSize: FONT_SIZE.xxl,
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  buttonHalf: {
    flex: 1,
  },
});

export default TransfersScreen;
