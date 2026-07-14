export const ENDPOINTS = {
  AUTH:
    process.env.EXPO_PUBLIC_AUTH_URL ||
    "http://localhost:5023/api/v1/auth",

  BANK:
    process.env.EXPO_PUBLIC_BANK_URL ||
    "http://localhost:3007/api/v1/bank",
};

export const BANK_ROUTES = {
  ACCOUNTS: "/accounts",
  MY_ACCOUNT: "/accounts/my-account",
  MY_ACCOUNT_CURRENCIES: "/accounts/my-account/currencies",

  TRANSACTIONS_HISTORY: "/transactions/history",
  TRANSACTIONS_TRANSFER: "/transactions/transfer",
  TRANSACTIONS_DEPOSIT: "/transactions/deposit",
  TRANSACTIONS_PAYMENT: "/transactions/payment",
  TRANSACTIONS_ALL: "/transactions/all",
  TRANSACTIONS_DEPOSITS: "/transactions/deposits",

  FAVORITES: "/favorites",
  FAVORITES_TRANSFER: "/favorites/transfer",
  FAVORITES_CHECK: "/favorites/check",

  PRODUCTS: "/products/get",
  PRODUCTS_CURRENCIES: "/products/get/currencies",
  PRODUCTS_MY: "/products/my-products",
  PRODUCTS_ACQUIRE: "/products/acquire",

  PENDING_ACCOUNT_REQUEST: "/pendingAccounts/account-request",
};


