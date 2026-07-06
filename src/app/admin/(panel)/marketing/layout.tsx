import { MarketingSubnav } from "@/components/admin/marketing/marketing-subnav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MarketingSubnav />
      {children}
    </div>
  );
}
