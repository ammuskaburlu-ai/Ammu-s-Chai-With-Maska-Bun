import { getSettings } from "@/lib/settings";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <CheckoutClient
      settings={{
        isStoreOpen: settings.isStoreOpen,
        deliveryFee: settings.deliveryFee,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
        minOrderValue: settings.minOrderValue,
        businessName: settings.businessName,
      }}
    />
  );
}
