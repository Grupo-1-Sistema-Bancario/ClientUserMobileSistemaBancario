import { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Card,
  CurrencyText,
  LoadingSpinner,
  EmptyState,
} from "../../../shared/components/common/Common";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { useAccountStore, selectBalance } from "../../../shared/store/accountStore";
import { useCatalog } from "../hooks/useCatalog";
import ProductCard from "../components/ProductCard";
import CatalogFilters from "../components/CatalogFilters";

const CatalogScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const balance = useAccountStore(selectBalance);
  const {
    products,
    acquiredIds,
    loading,
    acquiringId,
    error,
    refresh,
    handleAcquire,
  } = useCatalog();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesType = typeFilter === "ALL" || p.type === typeFilter;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [products, typeFilter, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const confirmAcquire = async () => {
    const productId = selectedProduct?.id;
    setSelectedProduct(null);
    if (productId) await handleAcquire(productId);
  };

  if (loading && !refreshing && products.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: SPACING.md,
          paddingBottom: insets.bottom + SPACING.xl,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Catálogo bancario</Text>
            <Card style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Saldo disponible</Text>
              <CurrencyText
                amount={balance}
                style={styles.balanceValue}
                positive={balance > 0}
              />
            </Card>
            <CatalogFilters
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </>
        }
        ListEmptyComponent={
          <EmptyState message="No hay productos disponibles con estos filtros" />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isAcquired={acquiredIds.has(item.id)}
            acquiring={acquiringId === item.id}
            onAcquire={() => setSelectedProduct(item)}
            onGoToPayments={() => navigation.getParent()?.navigate("Pagos")}
          />
        )}
      />

      <ConfirmModal
        visible={!!selectedProduct}
        title="Adquirir producto"
        message={
          selectedProduct
            ? `¿Deseas adquirir "${selectedProduct.name}"? No se cobrará nada ahora, podrás pagarlo desde el tab Pagos.`
            : ""
        }
        confirmText="Adquirir"
        icon="storefront"
        onConfirm={confirmAcquire}
        onCancel={() => setSelectedProduct(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },
  balanceCard: {
    marginBottom: SPACING.md,
  },
  balanceLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  balanceValue: {
    fontSize: FONT_SIZE.xxl,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
});

export default CatalogScreen;
