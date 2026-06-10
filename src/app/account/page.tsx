import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, Heart, Star } from "lucide-react";
import { LogoutButton } from "./logout-button";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const links = [
    { href: "/account/orders", icon: Package, label: "My Orders", desc: "View order history" },
    { href: "/account/addresses", icon: MapPin, label: "Addresses", desc: "Manage delivery addresses" },
    { href: "/account/favorites", icon: Heart, label: "Favorites", desc: "Saved items" },
    { href: "/account/profile", icon: Star, label: "Profile", desc: "Edit your details" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">
            {profile?.full_name || profile?.email}
          </p>
        </div>
        {profile && profile.loyalty_points > 0 && (
          <div className="rounded-xl bg-brand/10 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-brand">{profile.loyalty_points}</p>
            <p className="text-xs text-muted-foreground">Loyalty Points</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-brand transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                  <link.icon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <CardTitle className="text-base">{link.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
