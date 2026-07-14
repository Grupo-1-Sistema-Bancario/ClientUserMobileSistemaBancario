export const POINTS_EARN_RATE = 10;
export const POINT_VALUE = 1;
export const MAX_PAYMENT_AMOUNT = 2000;

// Replica la regla del backend: 1 punto de lealtad por cada Q10 efectivamente pagados.
export const calculatePointsEarned = (paidAmount) =>
  Math.floor((Number(paidAmount) || 0) / POINTS_EARN_RATE);

export const calculateDiscount = (price, availablePoints) =>
  Math.min(Number(price) || 0, (Number(availablePoints) || 0) * POINT_VALUE);

export const isPayable = (price) => (Number(price) || 0) <= MAX_PAYMENT_AMOUNT;
