import { useFavoriteStore } from "../store/useFavoriteStore";
import Toast from "react-native-toast-message";

const showSuccess = (title, message) => {
  Toast.show({ type: "success", text1: title, text2: message });
};

const showError = (title, message) => {
  Toast.show({ type: "error", text1: title, text2: message });
};

export const useFavorites = () => {
  const {
    favorites,
    loading,
    isCreateModalOpen,
    isTransferModalOpen,
    transferTarget,
    editingFavorite,
    deletingFavorite,
    openCreateModal,
    closeCreateModal,
    openTransferModal,
    closeTransferModal,
    openEditModal,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    fetchFavorites,
    addFavorite,
    updateFavoriteAlias,
    removeFavorite,
    transferToFavorite,
  } = useFavoriteStore();

  const loadFavorites = async () => {
    const result = await fetchFavorites();
    if (!result.success) {
      showError("Error", result.error);
    }
  };

  const handleAddFavorite = async (favoriteData, onSuccess) => {
    const result = await addFavorite(favoriteData);
    if (result.success) {
      showSuccess("Éxito", "Favorito agregado correctamente");
      if (onSuccess) onSuccess();
    } else {
      showError("Error", result.error);
    }
  };

  const handleUpdateAlias = async (favoriteId, alias, onSuccess) => {
    const result = await updateFavoriteAlias(favoriteId, alias);
    if (result.success) {
      showSuccess("Éxito", "Alias actualizado");
      if (onSuccess) onSuccess();
    } else {
      showError("Error", result.error);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    const result = await removeFavorite(favoriteId);
    if (result.success) {
      showSuccess("Éxito", "Favorito eliminado");
    } else {
      showError("Error", result.error);
    }
  };

  const handleTransferToFavorite = async (favorite, transferData, onSuccess) => {
    const result = await transferToFavorite({
      accountNumberTo: favorite.favoriteAccountNumber,
      amount: Number(transferData.amount),
      description: transferData.description || `Transferencia a ${favorite.alias || "favorito"}`,
    });

    if (result.success) {
      showSuccess("Éxito", "Transferencia realizada exitosamente");
      if (onSuccess) onSuccess();
    } else {
      showError("Error", result.error);
    }
  };

  return {
    favorites,
    loading,
    isCreateModalOpen,
    isTransferModalOpen,
    transferTarget,
    editingFavorite,
    deletingFavorite,
    openCreateModal,
    closeCreateModal,
    openTransferModal,
    closeTransferModal,
    openEditModal,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    loadFavorites,
    handleAddFavorite,
    handleUpdateAlias,
    handleRemoveFavorite,
    handleTransferToFavorite,
  };
};