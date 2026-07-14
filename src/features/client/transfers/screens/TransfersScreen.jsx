import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../../../shared/components/layout/ScreenHeader";
import { Card } from "../../../../shared/components/common/Common";
import Input from "../../../../shared/components/common/Input";
import Button from "../../../../shared/components/common/Button";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from "../../../../shared/constants/theme";
import { useTransfers } from "../hooks/useTransfers";

const TransfersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { handleTransfer, loading } = useTransfers();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { accountNumberTo: "", amount: "", description: "" },
  });

  const onSubmit = (data) => {
    handleTransfer(data, () =>
      reset({ accountNumberTo: "", amount: "", description: "" }),
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
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Nueva transferencia</Text>

          <Controller
            control={control}
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
                error={errors.accountNumberTo?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            rules={{
              required: "El monto es obligatorio",
              validate: (v) => {
                const n = Number(v);
                if (Number.isNaN(n) || n <= 0)
                  return "El monto debe ser mayor a 0";
                if (n > 2000) return "El monto no puede exceder de Q2000";
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
                error={errors.amount?.message}
              />
            )}
          />

          <Controller
            control={control}
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

          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Antes de enviar</Text>
            <Text style={styles.noticeText}>
              Verifica el número de cuenta, el monto y la descripción. La
              transferencia se procesa de inmediato y no se puede revertir.
            </Text>
          </View>

          <Button
            title={loading ? "Procesando..." : "Transferir fondos"}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />
        </Card>
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
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.fuchsiaSoft,
  },
  noticeTitle: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  noticeText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
});

export default TransfersScreen;
