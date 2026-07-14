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

const FavoriteFormModal = ({
  visible,
  mode,
  loading,
  initialAlias,
  initialAccountNumber,
  onClose,
  onSubmit,
}) => {
  const isEdit = mode === "edit";

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      favoriteAccountNumber: initialAccountNumber || "",
      alias: initialAlias || "",
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        favoriteAccountNumber: initialAccountNumber || "",
        alias: initialAlias || "",
      });
    }
  }, [visible, initialAccountNumber, initialAlias, reset]);

  const onFormSubmit = (data) => {
    onSubmit({
      favoriteAccountNumber: data.favoriteAccountNumber.trim(),
      alias: data.alias.trim(),
    });
  };

  if (!visible) return null;

  return (
    <ModalWrapper visible={visible}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEdit ? "Modificar favorito" : "Agregar favorito"}
        </Text>
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
          <Controller
            control={control}
            name="favoriteAccountNumber"
            rules={{
              required: "El número de cuenta es obligatorio",
              minLength: { value: 3, message: "Número de cuenta inválido" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Número de cuenta"
                placeholder="Ej. 100200300"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!isEdit}
                error={errors.favoriteAccountNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="alias"
            rules={{
              required: "El alias es obligatorio",
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Alias"
                placeholder="Nombre para identificar esta cuenta"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={50}
                error={errors.alias?.message}
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
              title={loading ? "Guardando..." : isEdit ? "Actualizar" : "Guardar"}
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
    maxHeight: 400,
  },
  formContent: {
    padding: SPACING.md,
    gap: SPACING.md,
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

export default FavoriteFormModal;