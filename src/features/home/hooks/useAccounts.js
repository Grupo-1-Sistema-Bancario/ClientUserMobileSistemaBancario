import { useState, useCallback, useEffect, useRef } from "react";
import bankClient from "../../../shared/api/bankClient";
import { BANK_ROUTES } from "../../../shared/constants/endpoints";
import { useAccountStore } from "../../../shared/store/accountStore";

const mapMovement = (tx, myAccountId) => {
  const fromId =
    tx.accountFrom?._id || tx.accountFrom?.id || tx.accountFrom || null;
  const toId = tx.accountTo?._id || tx.accountTo?.id || tx.accountTo || null;
  const isIncoming =
    tx.type === "DEPOSIT" ||
    (tx.type === "TRANSFER" &&
      myAccountId &&
      String(toId) === String(myAccountId) &&
      String(fromId) !== String(myAccountId));

  return {
    id: tx._id || tx.id,
    type: tx.type,
    amount: Number(tx.amount) || 0,
    description: tx.description || tx.product?.name || "Movimiento",
    status: tx.status || "COMPLETED",
    createdAt: tx.createdAt,
    accountFrom: tx.accountFrom,
    accountTo: tx.accountTo,
    product: tx.product,
    isIncoming,
    raw: tx,
  };
};

export const useAccounts = () => {
  const account = useAccountStore((s) => s.account);
  const accountLoading = useAccountStore((s) => s.loading);
  const accountError = useAccountStore((s) => s.error);
  const fetchAccountFromStore = useAccountStore((s) => s.fetchAccount);

  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const myAccountIdRef = useRef(null);

  useEffect(() => {
    myAccountIdRef.current = account?.id || null;
  }, [account]);

  const accounts = account ? [account] : [];

  const fetchAccounts = useCallback(async () => {
    const result = await fetchAccountFromStore();
    return result.success && result.data ? [result.data] : [];
  }, [fetchAccountFromStore]);

  const fetchAccount = useCallback(
    async (id) => {
      let list = accounts;
      if (!list.length) {
        list = await fetchAccounts();
      }
      return list.find((a) => String(a.id) === String(id)) || list[0] || null;
    },
    [accounts, fetchAccounts],
  );

  const fetchMovements = useCallback(async (filters = {}) => {
    try {
      setError(null);
      const response = await bankClient.get(BANK_ROUTES.TRANSACTIONS_HISTORY);
      const data = response.data?.data || response.data || [];
      const list = Array.isArray(data) ? data : [];
      const myId = myAccountIdRef.current;

      let mapped = list.map((tx) => mapMovement(tx, myId));

      if (filters.type) {
        mapped = mapped.filter((m) => m.type === filters.type);
      }
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        mapped = mapped.filter((m) => new Date(m.createdAt) >= start);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        mapped = mapped.filter((m) => new Date(m.createdAt) <= end);
      }

      const page = filters.page || 1;
      const pageSize = filters.pageSize || 20;
      const startIdx = (page - 1) * pageSize;
      const paged = mapped.slice(startIdx, startIdx + pageSize);

      setMovements(paged);
      return { items: paged, total: mapped.length };
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al cargar movimientos";
      setError(message);
      setMovements([]);
      return { items: [], total: 0 };
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await fetchAccounts();
      if (list[0]?.id) {
        await fetchMovements({ page: 1, pageSize: 50 });
      } else {
        setMovements([]);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts, fetchMovements]);

  useEffect(() => {
    refresh();
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  return {
    accounts,
    account,
    movements,
    loading: loading || accountLoading,
    error: error || accountError,
    totalBalance,
    fetchAccounts,
    fetchAccount,
    fetchMovements,
    refresh,
  };
};
