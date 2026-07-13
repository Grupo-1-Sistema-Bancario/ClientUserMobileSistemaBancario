import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
} from "../../../shared/constants/theme";
import { useAuth } from "../hooks/useAuth";

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { handleLogin, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await handleLogin(data);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + SPACING.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require("../../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brand}>ASTRA BANK</Text>
          <Text style={styles.tagline}>
            Accede a tu <Text style={styles.taglineAccent}>universo</Text>{" "}
            financiero
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="emailOrUsername"
          rules={{ required: "El correo o usuario es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Correo o usuario"
              placeholder="explorador@gmail.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.emailOrUsername?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: "La contraseña es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={12}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={22}
                  color={COLORS.textTertiary}
                />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.forgotLink}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button
          title="INGRESAR"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Regístrate</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.verifyLink}
          onPress={() => navigation.navigate("VerifyEmail")}
        >
          <Text style={styles.verifyText}>Verificar / reenviar correo</Text>
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
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: SPACING.md,
  },
  brand: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: LETTER_SPACING.ultra,
  },
  tagline: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  taglineAccent: {
    color: COLORS.cyan,
    fontWeight: "700",
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
  eyeBtn: {
    position: "absolute",
    right: SPACING.md,
    top: 36,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: SPACING.lg,
    marginTop: -SPACING.sm,
  },
  forgotText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },
  verifyLink: {
    marginTop: SPACING.md,
    alignItems: "center",
  },
  verifyText: {
    color: COLORS.cyan,
    fontSize: FONT_SIZE.xs,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
