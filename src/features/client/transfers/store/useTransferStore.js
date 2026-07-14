import { create } from "zustand";
import bankClient from "../../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../../shared/constants/endpoints";

export const useTransferStore = create((set) => ({
  loading: false,
  lookupLoading: false,
  error: null,

  makeTransfer: async (transferData) => {
    try {
      set({ loading: true, error: null });
      await bankClient.post(BANK_ROUTES.TRANSACTIONS_TRANSFER, transferData);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al realizar la transferencia";
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  checkAccountNumber: async (accountNumber) => {
    try {
      set({ lookupLoading: true, error: null });

      const [lookupResult, favoriteResult] = await Promise.allSettled([
        bankClient.get(`${BANK_ROUTES.ACCOUNTS_LOOKUP}/${accountNumber}`),
        bankClient.get(`${BANK_ROUTES.FAVORITES_CHECK}/${accountNumber}`),
      ]);

      if (lookupResult.status === "rejected") {
        const msg =
          lookupResult.reason?.response?.data?.message ||
          "No se pudo verificar la cuenta";
        set({ lookupLoading: false, error: msg });
        return { success: false, error: msg };
      }

      const ownerName = lookupResult.value.data?.data?.ownerName || null;
      const favorite =
        favoriteResult.status === "fulfilled"
          ? favoriteResult.value.data?.data || null
          : null;

      set({ lookupLoading: false });
      return {
        success: true,
        account: {
          accountNumber,
          ownerName,
          alias: favorite?.alias || null,
          isFavorite: !!favorite,
        },
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || "No se pudo verificar la cuenta";
      set({ lookupLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },
}));
