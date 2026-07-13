import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from "../../../shared/constants/theme";
import { useAuth } from "../hooks/useAuth";

const ForgotPasswordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { handleForgotPassword, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    const result = await handleForgotPassword(email);
    if (result.success) {
      Alert.alert(
        "Correo enviado",
        "Si el correo existe en el sistema, recibirás instrucciones para restablecer tu contraseña.",
        [{ text: "Volver al login", onPress: () => navigation.navigate("Login") }],
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + SPACING.xl,
            paddingBottom: insets.bottom + SPACING.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa el correo asociado a tu cuenta y te enviaremos un enlace de
          restablecimiento.
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="email"
          rules={{
            required: "El correo es obligatorio",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Correo inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Button
          title="ENVIAR ENLACE"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />

        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.backText}>Volver al login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: COLORS.errorSoft,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorBoxText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
  back: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  backText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },
});

export default ForgotPasswordScreen;
