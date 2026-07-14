import bankClient from "../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../shared/constants/endpoints";

export const fetchActiveProducts = () =>
  bankClient.get(`${BANK_ROUTES.PRODUCTS}?isActive=true`);

export const fetchMyProducts = () => bankClient.get(BANK_ROUTES.PRODUCTS_MY);

export const acquireProduct = (productId) =>
  bankClient.post(BANK_ROUTES.PRODUCTS_ACQUIRE, { productId });
