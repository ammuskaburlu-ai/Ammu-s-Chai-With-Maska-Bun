export interface OrderTotals {
  deliveryFee: number;
  total: number;
}

export function calculateOrderTotals({
  subtotal,
  discountAmount = 0,
  settings,
}: {
  subtotal: number;
  discountAmount?: number;
  settings: { deliveryFee: number; freeDeliveryThreshold: number; minOrderValue: number };
}): OrderTotals {
  const deliveryFee =
    settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold
      ? 0
      : settings.deliveryFee;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  return {
    deliveryFee,
    total,
  };
}
