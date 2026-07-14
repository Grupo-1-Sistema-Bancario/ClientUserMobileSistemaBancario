import React, { useEffect } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
  GRADIENTS,
} from "../../../../shared/constants/theme";
import Input from "../../../../shared/components/common/Input";
import Button from "../../../../shared/components/common/Button";
import ModalWrapper from "./ModalWrapper";

const TransferModal = ({ visible, loading, favorite, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!visible) return;
    reset({
      amount: "",
      description: `Transferencia a ${favorite?.alias || favorite?.favoriteAccountNumber || "favorito"}`,
    });
  }, [visible, favorite, reset]);

  const onFormSubmit = (data) => {
    onSubmit({ amount: data.amount, description: data.description });
  };

  if (!visible || !favorite) return null;

  return (
    <ModalWrapper visible={visible}>
      <View style={styles.header}>
        <Text style={styles.title}>Transferir a favorito</Text>
        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeButton}>
          <MaterialIcons name="close" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <View style={styles.destinationCard}>
            <Text style={styles.destLabel}>Destino</Text>
            <Text style={styles.destAlias}>
              {favorite.alias || "Sin alias"}
            </Text>
            <Text style={styles.destNumber}>
              {favorite.favoriteAccountNumber}
            </Text>
          </View>

          <Controller
            control={control}
            name="amount"
            rules={{
              required: "La cantidad es obligatoria",
              validate: (value) => {
                const num = Number(value);
                return num > 0 || "La cantidad debe ser mayor a 0";
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Cantidad (Q)"
                placeholder="Ej. 150"
                keyboardType="decimal-pad"
                maxLength={12}
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
                label="Descripción"
                placeholder="Motivo de la transferencia"
                multiline
                numberOfLines={3}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </KeyboardAvoidingView>

        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <Button title="Cancelar" variant="secondary" onPress={onClose} />
          </View>
          <View style={styles.buttonHalf}>
            <Button
              title={loading ? "Procesando..." : "Transferir"}
              onPress={handleSubmit(onFormSubmit)}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  form: {
    maxHeight: 500,
  },
  formContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  destinationCard: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  destLabel: {
    fontSize: FONT_SIZE.xs,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  destAlias: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  destNumber: {
    fontFamily: "monospace",
    fontSize: FONT_SIZE.xs,
    color: GRADIENTS.button[0],
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  buttonHalf: {
    flex: 1,
  },
});

export default TransferModal;