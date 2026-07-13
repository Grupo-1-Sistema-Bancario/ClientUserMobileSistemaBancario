import { create } from "zustand";
import bankClient from "../../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../../shared/constants/endpoints";

export const useHistoryStore = create((set) => ({
  transactions: [],
  loading: false,

  fetchMyTransactions: async () => {
    try {
      set({ loading: true });
      const response = await bankClient.get(BANK_ROUTES.TRANSACTIONS_HISTORY);
      set({ transactions: response.data?.data || [], loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Error al cargar el historial",
      };
    }
  },
}));
