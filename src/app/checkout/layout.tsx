import { Suspense } from "react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading checkout...</div>}>{children}</Suspense>;
}
