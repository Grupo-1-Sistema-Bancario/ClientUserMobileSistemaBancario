import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      login: async (accessToken, user, refreshToken) => {
        set({
          token: accessToken,
          user,
          isAuthenticated: true,
        });
        if (refreshToken) {
          await SecureStore.setItemAsync("refreshToken", refreshToken);
        }
      },

      setAccessToken: (token) => set({ token }),

      updateUser: (user) =>
        set((state) => ({
          user: typeof user === "function" ? user(state.user) : { ...state.user, ...user },
        })),

      logout: async () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        try {
          await SecureStore.deleteItemAsync("refreshToken");
        } catch {
          /* ignore missing key */
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
