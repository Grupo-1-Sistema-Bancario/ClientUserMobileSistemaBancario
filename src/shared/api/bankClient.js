import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/authStore";
import { ENDPOINTS } from "../constants/endpoints";

const bankClient = axios.create({
  baseURL: ENDPOINTS.BANK,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

bankClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  failedQueue = [];
}

bankClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return bankClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${ENDPOINTS.AUTH}/refresh-token`, {
          refreshToken,
        });

        const newAccess = data.accessToken ?? data.token;
        useAuthStore.getState().setAccessToken(newAccess);

        if (data.refreshToken) {
          await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        }

        processQueue(null, newAccess);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return bankClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        try {
          await SecureStore.deleteItemAsync("refreshToken");
        } catch {
          /* ignore */
        }
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default bankClient;