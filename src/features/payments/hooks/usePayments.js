import { useCallback, useState } from "react";
import { fetchMyProducts, payProduct } from "../api/paymentsService";
import { useAccountStore } from "../../../shared/store/accountStore";
import { calculatePointsEarned } from "../../../shared/constants/loyalty";
import { showSuccess, showError } from "../../../shared/utils/toastTrigger";

const mapProduct = (raw) => ({
  id: raw._id || raw.id,
  name: raw.name,
  description: raw.description,
  type: raw.type,
  price: Number(raw.price) || 0,
  pointsToEarn: calculatePointsEarned(raw.price),
});

export const usePayments = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMyProducts();
      const data = response.data?.data || [];
      setPendingProducts(data.map(mapProduct));
      setLoyaltyPoints(response.data?.loyaltyPoints || 0);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al cargar los pagos pendientes";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePay = useCallback(
    async (productId, usePoints = false) => {
      setPayingId(productId);
      try {
        const response = await payProduct({ productId, usePoints });
        const { pointsEarned, discountApplied } = response.data?.data || {};
        showSuccess(
          discountApplied
            ? `Pago realizado. Descuento de Q${discountApplied} con puntos, ganaste ${pointsEarned ?? 0} pts.`
            : `Pago realizado exitosamente. Ganaste ${pointsEarned ?? 0} pts.`,
        );
        await Promise.all([refresh(), useAccountStore.getState().fetchAccount()]);
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || "Error al procesar el pago";
        showError(message);
        return { success: false, error: message };
      } finally {
        setPayingId(null);
      }
    },
    [refresh],
  );

  return {
    pendingProducts,
    loyaltyPoints,
    loading,
    payingId,
    error,
    refresh,
    handlePay,
  };
};
