import { useCallback, useState } from "react";
import {
  fetchActiveProducts,
  fetchMyProducts,
  acquireProduct,
} from "../api/catalogService";
import { calculatePointsEarned } from "../../../shared/constants/loyalty";
import { showSuccess, showError } from "../../../shared/utils/toastTrigger";

const mapProduct = (raw) => ({
  id: raw._id || raw.id,
  name: raw.name,
  description: raw.description,
  type: raw.type,
  price: Number(raw.price) || 0,
  isActive: raw.isActive !== false,
  pointsToEarn: calculatePointsEarned(raw.price),
});

export const useCatalog = () => {
  const [products, setProducts] = useState([]);
  const [acquiredIds, setAcquiredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [acquiringId, setAcquiringId] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [catalogRes, myProductsRes] = await Promise.all([
        fetchActiveProducts(),
        fetchMyProducts(),
      ]);

      const catalogData = catalogRes.data?.data || [];
      const myProductsData = myProductsRes.data?.data || [];

      setProducts(catalogData.map(mapProduct));
      setAcquiredIds(
        new Set(myProductsData.map((p) => p._id || p.id)),
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al cargar el catálogo";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAcquire = useCallback(
    async (productId) => {
      setAcquiringId(productId);
      try {
        await acquireProduct(productId);
        showSuccess("Producto adquirido con éxito. Ve a Pagos para administrarlo.");
        await refresh();
        return { success: true };
      } catch (err) {
        const message =
          err.response?.data?.message || "Error al adquirir el producto";
        showError(message);
        return { success: false, error: message };
      } finally {
        setAcquiringId(null);
      }
    },
    [refresh],
  );

  return {
    products,
    acquiredIds,
    loading,
    acquiringId,
    error,
    refresh,
    handleAcquire,
  };
};
