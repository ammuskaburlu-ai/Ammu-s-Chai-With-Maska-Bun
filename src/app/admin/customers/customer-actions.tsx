"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Ban, CheckCircle } from "lucide-react";

interface CustomerActionsProps {
  customerId: string;
  isBlocked: boolean;
}

export function CustomerActions({ customerId, isBlocked }: CustomerActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleBlock = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: !isBlocked })
      .eq("id", customerId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isBlocked ? "Customer unblocked" : "Customer blocked");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleBlock}
      disabled={loading}
      title={isBlocked ? "Unblock" : "Block"}
    >
      {isBlocked ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <Ban className="h-4 w-4 text-destructive" />
      )}
    </Button>
  );
}
