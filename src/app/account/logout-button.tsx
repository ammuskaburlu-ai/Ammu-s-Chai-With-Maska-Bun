"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Log Out
    </Button>
  );
}
