import { create } from "zustand";
import bankClient from "../../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../../shared/constants/endpoints";

export const useFavoriteStore = create((set) => ({
  favorites: [],
  loading: false,
  error: null,
  isCreateModalOpen: false,
  isTransferModalOpen: false,
  transferTarget: null,
  editingFavorite: null,
  deletingFavorite: null,

  openCreateModal: () => set({ isCreateModalOpen: true, editingFavorite: null }),
  closeCreateModal: () => set({ isCreateModalOpen: false, editingFavorite: null }),

  openTransferModal: (favorite) => set({ isTransferModalOpen: true, transferTarget: favorite }),
  closeTransferModal: () => set({ isTransferModalOpen: false, transferTarget: null }),

  openEditModal: (favorite) => set({ isCreateModalOpen: true, editingFavorite: favorite }),

  openDeleteConfirmation: (favorite) => set({ deletingFavorite: favorite }),

  closeDeleteConfirmation: () => set({ deletingFavorite: null }),

  fetchFavorites: async () => {
    try {
      set({ loading: true, error: null });
      const response = await bankClient.get(BANK_ROUTES.FAVORITES);
      set({ favorites: response.data?.data || [], loading: false });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al cargar favoritos";
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  addFavorite: async (favoriteData) => {
    try {
      set({ loading: true, error: null });
      const response = await bankClient.post(BANK_ROUTES.FAVORITES, favoriteData);
      const newFavorite = response.data?.data;

      set((state) => ({
        favorites: newFavorite ? [newFavorite, ...state.favorites] : state.favorites,
        loading: false,
        isCreateModalOpen: false,
      }));

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al agregar favorito";
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  updateFavoriteAlias: async (favoriteId, alias) => {
    try {
      set({ loading: true, error: null });
      const response = await bankClient.put(`${BANK_ROUTES.FAVORITES}/${favoriteId}`, { alias });
      const updated = response.data?.data;

      set((state) => ({
        favorites: state.favorites.map((fav) =>
          fav._id === favoriteId ? { ...fav, alias: updated?.alias ?? alias } : fav
        ),
        loading: false,
        isCreateModalOpen: false,
        editingFavorite: null,
      }));

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al actualizar alias";
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  removeFavorite: async (favoriteId) => {
    try {
      set({ loading: true, error: null });
      await bankClient.delete(`${BANK_ROUTES.FAVORITES}/${favoriteId}`);

      set((state) => ({
        favorites: state.favorites.filter((fav) => fav._id !== favoriteId),
        loading: false,
        deletingFavorite: null,
      }));

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al eliminar favorito";
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  transferToFavorite: async ({ accountNumberTo, amount, description }) => {
    try {
      set({ loading: true, error: null });
      await bankClient.post(BANK_ROUTES.FAVORITES_TRANSFER, {
        accountNumberTo,
        amount,
        description,
      });
      set({ loading: false, isTransferModalOpen: false, transferTarget: null });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al transferir al favorito";
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },
}));