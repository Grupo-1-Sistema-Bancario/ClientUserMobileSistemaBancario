import { create } from "zustand";
import bankClient from "../../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../../shared/constants/endpoints";

export const usePaymentStore = create((set) => ({
  myProducts: [],
  loyaltyPoints: 0,
  loading: false,

  fetchMyProducts: async () => {
    try {
      set({ loading: true });
      const response = await bankClient.get(BANK_ROUTES.PRODUCTS_MY);
      set({
        myProducts: response.data?.data || [],
        loyaltyPoints: response.data?.loyaltyPoints || 0,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al cargar tus productos";
      set({ loading: false });
      return { success: false, error: msg };
    }
  },

  payProduct: async (paymentData) => {
    try {
      set({ loading: true });
      await bankClient.post(BANK_ROUTES.TRANSACTIONS_PAYMENT, paymentData);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Error al procesar el pago",
      };
    }
  },
}));
