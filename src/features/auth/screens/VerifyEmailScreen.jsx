import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../../shared/components/common/Button";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from "../../../shared/constants/theme";
import { useAuth } from "../hooks/useAuth";

const VerifyEmailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { handleResendVerification, loading, error } = useAuth();

  const onResend = async () => {
    const result = await handleResendVerification();
    if (result.success) {
      Alert.alert(
        "Correo reenviado",
        "Revisa tu bandeja de entrada (y spam) para el enlace de verificación.",
      );
    } else if (error || result.error) {
      Alert.alert("No se pudo reenviar", result.error || error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + SPACING.xl,
          paddingBottom: insets.bottom + SPACING.xl,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialIcons name="mark-email-unread" size={64} color={COLORS.cyan} />
      </View>

      <Text style={styles.title}>Verifica tu correo</Text>
      <Text style={styles.body}>
        Te enviamos un enlace de verificación a tu correo electrónico. Debes
        confirmarlo antes de poder usar todas las funciones del banco.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title="Reenviar verificación"
        onPress={onResend}
        loading={loading}
      />

      <Button
        title="Volver al login"
        variant="secondary"
        onPress={() => navigation.navigate("Login")}
        style={styles.secondaryBtn}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿Correo incorrecto? Regístrate de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
  },
  iconWrap: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  body: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.sm,
  },
  secondaryBtn: {
    marginTop: SPACING.md,
  },
  link: {
    marginTop: SPACING.lg,
    textAlign: "center",
    color: COLORS.cyan,
    fontSize: FONT_SIZE.sm,
  },
});

export default VerifyEmailScreen;
