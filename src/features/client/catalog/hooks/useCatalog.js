import Toast from "react-native-toast-message";
import { useCatalogStore } from "../store/useCatalogStore";

export const useCatalog = () => {
  const { products, loading, fetchCatalog, acquireProduct } = useCatalogStore();

  const loadCatalog = async () => {
    await fetchCatalog();
  };

  const handleBuy = async (productId) => {
    const result = await acquireProduct(productId);
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Producto adquirido correctamente",
      });
    } else {
      Toast.show({ type: "error", text1: "Error", text2: result.error });
    }
    return result;
  };

  return { products, loading, loadCatalog, handleBuy };
};
