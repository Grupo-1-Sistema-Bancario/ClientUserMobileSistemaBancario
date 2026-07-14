import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import PageHeader from "../../../../shared/components/layout/PageHeader";
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  GRADIENTS,
} from "../../../../shared/constants/theme";
import { useFavorites } from "../hooks/useFavorites";
import FavoriteCard from "../components/FavoriteCard";
import FavoriteFormModal from "../components/FavoriteFormModal";
import TransferModal from "../components/TransferModal";
import Button from "../../../../shared/components/common/Button";
import ConfirmModal from "../../../../shared/components/common/ConfirmModal";

const FavoritesScreen = () => {
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
    loadFavorites,
    handleAddFavorite,
    handleUpdateAlias,
    handleRemoveFavorite,
    handleTransferToFavorite,
  } = useFavorites();

  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Solo al montar. NO poner loadFavorites en deps: es una función nueva en
    // cada render y provocaría un bucle infinito de fetch/render (congelamiento).
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardPress = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const submitFormModal = async (data) => {
    if (editingFavorite) {
      await handleUpdateAlias(editingFavorite._id, data.alias, () => {
        closeCreateModal();
      });
      return;
    }
    await handleAddFavorite(data, closeCreateModal);
  };

  const submitTransfer = async (data) => {
    if (!transferTarget) return;
    await handleTransferToFavorite(transferTarget, data, closeTransferModal);
  };

  const confirmDelete = async () => {
    if (!deletingFavorite) return;
    await handleRemoveFavorite(deletingFavorite._id);
    closeDeleteConfirmation();
  };

  const isFormOpen = isCreateModalOpen || !!editingFavorite;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCard}>
        <MaterialIcons name="star-outline" size={64} color={COLORS.textTertiary} />
        <Text style={styles.emptyTitle}>Sin favoritos guardados</Text>
        <Text style={styles.emptyText}>
          Agrega cuentas frecuentes para transferir rápidamente
        </Text>
        <Button
          title="Agregar primer favorito"
          onPress={openCreateModal}
          style={styles.emptyButton}
        />
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <FavoriteCard
      favorite={item}
      isExpanded={expandedId === item._id}
      onExpand={() => handleCardPress(item._id)}
      onTransfer={openTransferModal}
      onEdit={openEditModal}
      onDelete={openDeleteConfirmation}
    />
  );

  return (
    <View style={styles.container}>
      <PageHeader
        title="Mis Favoritos"
        subtitle="Cuentas frecuentes"
        style={{ paddingTop: insets.top + SPACING.md }}
        right={
          <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
            <MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        }
      />

      {loading && favorites.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          ref={flatListRef}
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadFavorites}
              colors={[GRADIENTS.button[0]]}
            />
          }
        />
      )}

      <FavoriteFormModal
        visible={isFormOpen}
        mode={editingFavorite ? "edit" : "create"}
        loading={loading}
        initialAlias={editingFavorite?.alias || ""}
        initialAccountNumber={editingFavorite?.favoriteAccountNumber || ""}
        onClose={closeCreateModal}
        onSubmit={submitFormModal}
      />

      <TransferModal
        visible={isTransferModalOpen}
        loading={loading}
        favorite={transferTarget}
        onClose={closeTransferModal}
        onSubmit={submitTransfer}
      />

      <ConfirmModal
        visible={!!deletingFavorite}
        title="¿Eliminar Favorito?"
        message={`¿Estás seguro que deseas eliminar a ${deletingFavorite?.alias || deletingFavorite?.favoriteAccountNumber} de tus favoritos? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={closeDeleteConfirmation}
        destructive={true}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: GRADIENTS.button[0],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: GRADIENTS.button[0],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  emptyButton: {
    minWidth: 200,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
});

export default FavoritesScreen;