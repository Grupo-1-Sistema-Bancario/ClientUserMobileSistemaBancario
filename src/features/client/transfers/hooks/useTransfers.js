import Toast from "react-native-toast-message";
import { useTransferStore } from "../store/useTransferStore";

export const useTransfers = () => {
  const { loading, lookupLoading, makeTransfer, checkAccountNumber } =
    useTransferStore();

  const handleTransfer = async (formData, onSuccess) => {
    const result = await makeTransfer({
      accountNumberTo: formData.accountNumberTo,
      type: "TRANSFER",
      amount: Number(formData.amount),
      description:
        formData.description?.trim() || "Transferencia entre cuentas",
    });

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Transferencia realizada exitosamente",
      });
      onSuccess?.();
    } else {
      Toast.show({ type: "error", text1: "Error", text2: result.error });
    }
  };

  const handleCheckAccountNumber = async (accountNumber, onSuccess) => {
    const result = await checkAccountNumber(accountNumber);
    if (result.success) {
      onSuccess?.(result.account);
    } else {
      Toast.show({ type: "error", text1: "Error", text2: result.error });
    }
    return result;
  };

  return { loading, lookupLoading, handleTransfer, handleCheckAccountNumber };
};
