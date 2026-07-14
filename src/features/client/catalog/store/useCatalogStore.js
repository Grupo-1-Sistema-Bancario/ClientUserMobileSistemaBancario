import { create } from "zustand";
import bankClient from "../../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../../shared/constants/endpoints";

export const useCatalogStore = create((set) => ({
  products: [],
  loading: false,

  fetchCatalog: async () => {
    try {
      set({ loading: true });
      const response = await bankClient.get(BANK_ROUTES.PRODUCTS, {
        params: { isActive: true },
      });
      set({ products: response.data?.data || [], loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Error al cargar el catálogo",
      };
    }
  },

  acquireProduct: async (productId) => {
    try {
      set({ loading: true });
      await bankClient.post(BANK_ROUTES.PRODUCTS_ACQUIRE, { productId });
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Error al comprar",
      };
    }
  },
}));
