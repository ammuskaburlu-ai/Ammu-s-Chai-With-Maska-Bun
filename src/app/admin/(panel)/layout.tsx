import Link from "next/link";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  ShoppingBag,
  Users,
  Ticket,
  Settings,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: UtensilsCrossed, label: "Products" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/coupons", icon: Ticket, label: "Coupons" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden lg:flex w-64 flex-col border-r bg-muted/30">
        <div className="p-6 border-b">
          <Link href="/admin" className="text-xl font-bold text-brand">Admin Panel</Link>
          <p className="text-sm text-muted-foreground mt-1">{profile.full_name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link href="/" className="text-sm text-muted-foreground hover:text-brand">
            ← Back to Store
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="lg:hidden flex overflow-x-auto border-b p-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap hover:bg-accent"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
