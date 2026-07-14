import { create } from "zustand";
import bankClient from "../api/bankClient";
import { BANK_ROUTES } from "../constants/endpoints";

const mapAccount = (raw) => {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    alias: raw.alias || "Cuenta principal",
    type: raw.type || "MONETARIA",
    accountNumber: raw.accountNumber,
    balance: Number(raw.balance) || 0,
    currency: raw.currency || "GTQ",
    isActive: raw.isActive !== false,
    loyaltyPoints: raw.loyaltyPoints ?? 0,
    phone: raw.phone || null,
    address: raw.address || null,
    jobName: raw.jobName || null,
    monthlyIncome:
      raw.monthlyIncome != null ? Number(raw.monthlyIncome) : null,
    dpi: raw.dpi || null,
    raw,
  };
};

export const useAccountStore = create((set) => ({
  account: null,
  loading: false,
  error: null,

  fetchAccount: async () => {
    try {
      set({ loading: true, error: null });
      const response = await bankClient.get(BANK_ROUTES.MY_ACCOUNT);
      const data = response.data?.data || response.data;
      const mapped = mapAccount(data);
      set({ account: mapped, loading: false });
      return { success: true, data: mapped };
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al cargar la cuenta";
      set({ account: null, error: message, loading: false });
      return { success: false, error: message };
    }
  },

  reset: () => set({ account: null, loading: false, error: null }),
}));

export const selectBalance = (state) => state.account?.balance || 0;
export const selectLoyaltyPoints = (state) => state.account?.loyaltyPoints || 0;
