import { cn } from "@/lib/utils";
import { ORDER_STATUS_STEPS, ORDER_STATUS_LABELS } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";
import { Check } from "lucide-react";

interface OrderTrackerProps {
  status: OrderStatus;
}

export function OrderTracker({ status }: OrderTrackerProps) {
  if (status === "cancelled") {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
        Order Cancelled
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.indexOf(status as typeof ORDER_STATUS_STEPS[number]);

  return (
    <div className="space-y-0">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm",
                  isCompleted
                    ? "border-brand bg-brand text-white"
                    : "border-muted-foreground/30 bg-muted"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < ORDER_STATUS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8",
                    isCompleted && index < currentIndex ? "bg-brand" : "bg-muted"
                  )}
                />
              )}
            </div>
            <div className={cn("pb-8", index === ORDER_STATUS_STEPS.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "font-medium text-sm",
                  isCurrent ? "text-brand" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
