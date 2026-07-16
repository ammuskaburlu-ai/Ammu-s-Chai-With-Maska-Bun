import { getSettings } from "@/lib/settings";
import { CartClient } from "./cart-client";

export default async function CartPage() {
  const settings = await getSettings();

  return (
    <CartClient
      settings={{
        deliveryFee: settings.deliveryFee,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
        minOrderValue: settings.minOrderValue,
      }}
    />
  );
}
