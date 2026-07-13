import Toast from "react-native-toast-message";
import { usePaymentStore } from "../store/usePaymentStore";

export const usePayments = () => {
  const { myProducts, loyaltyPoints, loading, fetchMyProducts, payProduct } =
    usePaymentStore();

  const loadMyProducts = async () => {
    await fetchMyProducts();
  };

  const handlePay = async (productId, usePoints = false) => {
    const result = await payProduct({
      type: "PAYMENT",
      product: productId,
      usePoints,
    });

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Pago realizado exitosamente",
      });
      await fetchMyProducts();
    } else {
      Toast.show({ type: "error", text1: "Error", text2: result.error });
    }
  };

  return { myProducts, loyaltyPoints, loading, loadMyProducts, handlePay };
};
