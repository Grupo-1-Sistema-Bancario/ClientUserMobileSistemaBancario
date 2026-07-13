import { create } from "zustand";

const emptyDestination = null;

export const useTransferStore = create((set, get) => ({
  originAccountId: null,
  destination: emptyDestination,
  amount: null,
  concept: "",

  setOrigin: (accountId) => {
    const current = get().originAccountId;
    if (current && current !== accountId) {
      set({
        originAccountId: accountId,
        destination: emptyDestination,
        amount: null,
        concept: "",
      });
      return;
    }
    set({ originAccountId: accountId });
  },

  setDestination: (destination) => {
    set({ destination });
  },

  setAmount: (amount) => {
    set({ amount });
  },

  setConcept: (concept) => {
    set({ concept });
  },

  clearDraft: () => {
    set({
      originAccountId: null,
      destination: emptyDestination,
      amount: null,
      concept: "",
    });
  },

  isComplete: () => {
    const { originAccountId, destination, amount } = get();
    if (!originAccountId || !destination || amount == null) return false;
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) return false;
    if (!destination.type) return false;
    return true;
  },
}));
