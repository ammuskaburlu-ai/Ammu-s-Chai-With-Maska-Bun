import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
      {children}
    </Suspense>
  );
}
