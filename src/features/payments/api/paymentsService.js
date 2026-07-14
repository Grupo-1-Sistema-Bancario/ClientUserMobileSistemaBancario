import bankClient from "../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../shared/constants/endpoints";

export const fetchMyProducts = () => bankClient.get(BANK_ROUTES.PRODUCTS_MY);

export const payProduct = ({ productId, usePoints }) =>
  bankClient.post(BANK_ROUTES.TRANSACTIONS_PAYMENT, {
    type: "PAYMENT",
    product: productId,
    usePoints,
  });
