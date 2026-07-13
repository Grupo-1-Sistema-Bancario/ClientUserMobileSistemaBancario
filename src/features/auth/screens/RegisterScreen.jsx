import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  LETTER_SPACING,
  SHADOWS,
} from "../../../shared/constants/theme";
import { useAuth } from "../hooks/useAuth";

const JOB_OPTIONS = [
  { value: "independiente", label: "Explorador Independiente" },
  { value: "asalariado", label: "Tripulante Asalariado" },
  { value: "empresario", label: "Comandante (Empresario)" },
];

const STEP1_FIELDS = [
  "name",
  "surname",
  "username",
  "phone",
  "email",
  "password",
];

const RegisterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { handleRegister, loading, error, clearError, setError } = useAuth();
  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      phone: "",
      email: "",
      password: "",
      job_type: "",
      address: "",
      income: "",
      dpi: "",
    },
  });

  const goNext = () => setStep((s) => s + 1);
  const goPrev = () => {
    clearError();
    setStep((s) => Math.max(1, s - 1));
  };

  const handleStep1Next = async () => {
    const isValid = await trigger(STEP1_FIELDS);
    if (!isValid) {
      setError("Verifica el formato de los campos.");
      return;
    }
    clearError();
    goNext();
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Se necesita permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    const name = uri.split("/").pop() || "profile.jpg";
    const match = /\.(\w+)$/.exec(name);
    const ext = match?.[1]?.toLowerCase() || "jpg";
    const type = asset.mimeType || `image/${ext === "jpg" ? "jpeg" : ext}`;

    setPreviewUri(uri);
    setProfilePic({ uri, name, type });
    clearError();
  };

  const onSubmit = async (data) => {
    const result = await handleRegister({
      ...data,
      profilePic,
    });

    if (result.success) {
      clearError();
      goNext(); 
    }
  };

  const onValidationError = (formErrors) => {
    const first = Object.values(formErrors)[0];
    setError(
      first?.message ||
      "Completa tu tipo de trabajo, dirección, ingresos y un DPI válido.",
    );
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
            paddingTop: insets.top + SPACING.lg,
            paddingBottom: insets.bottom + SPACING.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step < 3 ? (
          <>
            <View style={styles.stepHeader}>
              <Text style={styles.stepKicker}>
                {step === 1
                  ? "Paso 1: Información básica"
                  : "Paso 2: Información personal y de contacto"}
              </Text>
              <View style={styles.stepLine} />
              <View style={styles.stepDot} />
            </View>

            <Text style={styles.title}>
              Únete a la <Text style={styles.titleAccent}>expansión</Text>
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? "Inicia tu viaje intergaláctico hoy mismo."
                : "Registra tu información clasificada."}
            </Text>

            <View style={styles.progressRow}>
              <View
                style={[styles.progressBar, step >= 1 && styles.progressActive]}
              />
              <View
                style={[styles.progressBar, step >= 2 && styles.progressActive]}
              />
            </View>
          </>
        ) : null}

        {error && step < 3 ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        {step === 1 && (
          <View>
            <View style={styles.row}>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: "El campo 'Nombres' es obligatorio.",
                    maxLength: {
                      value: 25,
                      message:
                        "El campo 'Nombres' debe tener máximo 25 caracteres.",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Nombres"
                      placeholder="Nombres"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.name?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="surname"
                  rules={{
                    required: "El campo 'Apellidos' es obligatorio.",
                    maxLength: {
                      value: 25,
                      message:
                        "El campo 'Apellidos' debe tener máximo 25 caracteres.",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Apellidos"
                      placeholder="Apellidos"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.surname?.message}
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="username"
                  rules={{
                    required: "El campo 'Usuario' es obligatorio.",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Usuario"
                      placeholder="@usuario"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.username?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.half}>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: "El campo 'Teléfono' es obligatorio.",
                    minLength: {
                      value: 8,
                      message:
                        "El campo 'Teléfono' debe tener exactamente 8 dígitos.",
                    },
                    maxLength: {
                      value: 8,
                      message:
                        "El campo 'Teléfono' debe tener exactamente 8 dígitos.",
                    },
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message:
                        "El campo 'Teléfono' debe tener exactamente 8 dígitos.",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Teléfono"
                      placeholder="12345678"
                      keyboardType="number-pad"
                      maxLength={8}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="email"
              rules={{
                required: "El campo 'Correo Electrónico' es obligatorio.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message:
                    "El campo 'Correo Electrónico' tiene un formato inválido.",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Correo electrónico"
                  placeholder="explorador@cosmos.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: "El campo 'Contraseña' es obligatorio.",
                minLength: {
                  value: 8,
                  message:
                    "El campo 'Contraseña' debe tener al menos 8 caracteres.",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Contraseña"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            <Text style={styles.photoLabel}>Foto de perfil (opcional)</Text>
            <View style={styles.photoRow}>
              <View style={styles.avatar}>
                {previewUri ? (
                  <Image source={{ uri: previewUri }} style={styles.avatarImg} />
                ) : (
                  <MaterialIcons
                    name="person"
                    size={32}
                    color={COLORS.textTertiary}
                  />
                )}
              </View>
              <TouchableOpacity
                style={styles.photoBtn}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.photoBtnText}>
                  {previewUri ? "Cambiar foto" : "Elegir foto"}
                </Text>
              </TouchableOpacity>
            </View>

            <Button title="Siguiente fase" onPress={handleStep1Next} />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.fieldLabel}>Tipo de trabajo</Text>
            <Controller
              control={control}
              name="job_type"
              rules={{
                required: "El campo 'Tipo de Trabajo' es obligatorio.",
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.jobList}>
                  {JOB_OPTIONS.map((opt) => {
                    const active = value === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.jobOption, active && styles.jobActive]}
                        onPress={() => onChange(opt.value)}
                        activeOpacity={0.85}
                      >
                        <MaterialIcons
                          name={
                            active
                              ? "radio-button-checked"
                              : "radio-button-unchecked"
                          }
                          size={20}
                          color={active ? COLORS.primary : COLORS.textTertiary}
                        />
                        <Text
                          style={[
                            styles.jobLabel,
                            active && styles.jobLabelActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {errors.job_type ? (
                    <Text style={styles.fieldError}>
                      {errors.job_type.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={control}
              name="address"
              rules={{
                required: "El campo 'Dirección Intergaláctica' es obligatorio.",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Dirección intergaláctica"
                  placeholder="Sector 4, Vía Láctea..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.address?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="income"
              rules={{
                required: "El campo 'Ingresos mensuales' es obligatorio.",
                validate: (v) => {
                  const n = Number(v);
                  if (Number.isNaN(n) || n < 0) {
                    return "El campo 'Ingresos mensuales' debe ser un valor positivo.";
                  }
                  return true;
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Ingresos mensuales"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.income?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="dpi"
              rules={{
                required: "El campo 'DPI' es obligatorio.",
                minLength: {
                  value: 13,
                  message: "El campo 'DPI' debe tener exactamente 13 dígitos.",
                },
                maxLength: {
                  value: 13,
                  message: "El campo 'DPI' debe tener exactamente 13 dígitos.",
                },
                pattern: {
                  value: /^[0-9]{13}$/,
                  message: "El campo 'DPI' debe tener exactamente 13 dígitos.",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="DPI (13 dígitos)"
                  placeholder="0000000000000"
                  keyboardType="number-pad"
                  maxLength={13}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.dpi?.message}
                  style={styles.dpiInput}
                />
              )}
            />

            <View style={styles.step2Actions}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={goPrev}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              <View style={styles.flex1}>
                <Button
                  title={loading ? "Procesando..." : "Completar"}
                  onPress={handleSubmit(onSubmit, onValidationError)}
                  loading={loading}
                  style={styles.completeBtn}
                />
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.successWrap}>
            <View style={styles.successIcon}>
              <MaterialIcons
                name="check-circle-outline"
                size={56}
                color={COLORS.cyan}
              />
            </View>
            <Text style={styles.successTitle}>Solicitud enviada</Text>
            <Text style={styles.successBody}>
              Tus datos están viajando a nuestro centro de control. Por favor
              espera nuestro correo de aceptación de Astra Bank.
              {"\n\n"}
              Estaremos verificando tu identidad cuántica. Revisa también tu
              correo para verificar tu cuenta.
            </Text>
            <Button
              title="Volver al inicio"
              variant="secondary"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        )}

        {step < 3 ? (
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya eres un explorador? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Iniciar sesión →</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  flex1: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  stepKicker: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: LETTER_SPACING.wide,
    textTransform: "uppercase",
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.35,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  progressRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.inputBorder,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
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
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  half: {
    flex: 1,
  },
  photoLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderStyle: "dashed",
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoBtnText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
    letterSpacing: LETTER_SPACING.wide,
  },
  jobList: {
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  jobOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBg,
  },
  jobActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  jobLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  jobLabelActive: {
    color: COLORS.text,
    fontWeight: "600",
  },
  fieldError: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  dpiInput: {
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
  step2Actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  completeBtn: {
    backgroundColor: COLORS.cyanDeep,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  successWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  successTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  successBody: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
    maxWidth: 320,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
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
});

export default RegisterScreen;
