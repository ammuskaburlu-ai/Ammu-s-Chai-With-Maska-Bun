"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/lib/utils";
import { toast } from "sonner";
import type { OrderStatus } from "@/types/database";

const statuses: OrderStatus[] = [
  "order_received", "payment_confirmed", "accepted", "preparing",
  "ready", "out_for_delivery", "delivered", "cancelled",
];

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update");
        return;
      }
      toast.success("Order status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border p-6">
      <h2 className="font-semibold mb-4">Update Status</h2>
      <div className="flex gap-4">
        <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="brand" onClick={updateStatus} disabled={loading || status === currentStatus}>
          {loading ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </div>
  );
}
