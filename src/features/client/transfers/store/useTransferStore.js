import { create } from "zustand";
import bankClient from "../../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../../shared/constants/endpoints";

export const useTransferStore = create((set) => ({
  loading: false,
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
}));
