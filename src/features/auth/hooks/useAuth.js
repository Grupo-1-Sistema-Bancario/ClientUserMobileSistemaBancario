import { useState, useCallback } from "react";
import authClient from "../../../shared/api/authClient.js";
import bankClient from "../../../shared/api/bankClient.js";
import { BANK_ROUTES } from "../../../shared/constants/endpoints.js";
import { useAuthStore } from "../../../shared/store/authStore.js";
import { useAccountStore } from "../../../shared/store/accountStore.js";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = useAuthStore((state) => state.login);
  const authLogout = useAuthStore((state) => state.logout);

  const logout = useCallback(async () => {
    await authLogout();
    useAccountStore.getState().reset();
  }, [authLogout]);

  const clearError = useCallback(() => setError(null), []);

  const handleLogin = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authClient.post("/login", {
          emailOrUsername: formData.emailOrUsername,
          password: formData.password,
        });

        const payload = response.data?.data || response.data;
        const accessToken = payload.accessToken ?? payload.token;
        const refreshToken = payload.refreshToken;
        const userDetails = payload.userDetails ?? payload.user;

        if (!accessToken) {
          throw new Error("Respuesta de login inválida");
        }

        await login(accessToken, userDetails, refreshToken);

        if (userDetails?.role === "USER_ROLE") {
          try {
            const accountRes = await bankClient.get(BANK_ROUTES.MY_ACCOUNT);
            const account = accountRes.data?.data || accountRes.data;
            if (account?.isActive === false) {
              await logout();
              const msg = "Tu cuenta bancaria no está activa";
              setError(msg);
              return { success: false, error: msg };
            }
          } catch {
            await logout();
            const msg =
              "No se encontró un perfil bancario activo para este usuario";
            setError(msg);
            return { success: false, error: msg };
          }
        }

        return { success: true, data: payload };
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Error al iniciar sesión";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [login, logout],
  );

  const handleRegister = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("Name", data.name?.trim() || "");
      formData.append("Surname", data.surname?.trim() || "");
      formData.append("Username", data.username?.trim() || "");
      formData.append("Email", data.email?.trim() || "");
      formData.append("Phone", data.phone?.trim() || "");
      formData.append("Password", data.password || "");
      formData.append("JobType", data.job_type || "");
      formData.append("Address", data.address?.trim() || "");
      formData.append("Income", String(data.income ?? ""));
      formData.append("DPI", data.dpi?.trim() || "");

      if (data.profilePic?.uri) {
        formData.append("ProfilePicture", {
          uri: data.profilePic.uri,
          name: data.profilePic.name || "profile.jpg",
          type: data.profilePic.type || "image/jpeg",
        });
      }

      const response = await authClient.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = response.data?.data || response.data;
      const authAccountId =
        payload?.user?.id ||
        payload?.userDetails?.id ||
        payload?.id ||
        payload?.userId;

      if (authAccountId) {
        try {
          await bankClient.post(BANK_ROUTES.PENDING_ACCOUNT_REQUEST, {
            authAccountId,
            dpi: data.dpi,
            address: data.address,
            email: data.email,
            phone: data.phone,
            jobType: data.job_type,
            monthlyIncome: Number(data.income) || 0,
          });
        } catch (pendingErr) {
          /* Auth ya creó el usuario; la solicitud bancaria se reintenta en admin */
          console.warn(
            "Pendiente bancaria no creada:",
            pendingErr.response?.data?.message || pendingErr.message,
          );
        }
      }

      return {
        success: true,
        emailVerificationRequired: payload?.emailVerificationRequired,
        data: payload,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Error al registrarse";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleForgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authClient.post("/forgot-password", { email });
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al solicitar restablecimiento";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResendVerification = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      const body = email ? { email } : {};
      const response = await authClient.post("/resend-verification", body);
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al reenviar verificación";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleResendVerification,
    loading,
    error,
    clearError,
    setError,
    logout,
  };
};
