"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Coupon } from "@/types/database";

const couponSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().min(1),
  min_order_value: z.coerce.number().min(0),
  max_discount: z.coerce.number().optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean(),
});

type CouponForm = z.infer<typeof couponSchema>;

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
    defaultValues: { discount_type: "percentage", is_active: true, min_order_value: 0 },
  });

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons((data as Coupon[]) || []);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: CouponForm) => {
    const supabase = createClient();
    const { error } = await supabase.from("coupons").insert({
      ...data,
      code: data.code.toUpperCase(),
      max_discount: data.max_discount || null,
      expires_at: data.expires_at || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Coupon created");
    reset();
    load();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const supabase = createClient();
    await supabase.from("coupons").delete().eq("id", id);
    toast.success("Coupon deleted");
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Coupons</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border p-6 mb-8 space-y-4 max-w-lg">
        <h2 className="font-semibold">Create Coupon</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Code</Label>
            <Input {...register("code")} placeholder="SAVE10" />
          </div>
          <div>
            <Label>Discount Type</Label>
            <Select value={watch("discount_type")} onValueChange={(v) => setValue("discount_type", v as "percentage" | "fixed")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Input {...register("description")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Discount Value</Label>
            <Input type="number" {...register("discount_value")} />
          </div>
          <div>
            <Label>Min Order Value</Label>
            <Input type="number" {...register("min_order_value")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Max Discount</Label>
            <Input type="number" {...register("max_discount")} />
          </div>
          <div>
            <Label>Expires At</Label>
            <Input type="datetime-local" {...register("expires_at")} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} />
          <Label>Active</Label>
        </div>
        <Button type="submit" variant="brand" disabled={isSubmitting}>Create Coupon</Button>
      </form>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4">Discount</th>
              <th className="text-left p-4 hidden sm:table-cell">Used</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-t">
                <td className="p-4">
                  <p className="font-medium">{coupon.code}</p>
                  <p className="text-xs text-muted-foreground">{coupon.description}</p>
                </td>
                <td className="p-4">
                  {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                </td>
                <td className="p-4 hidden sm:table-cell">{coupon.used_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : ""}</td>
                <td className="p-4">
                  <Badge variant={coupon.is_active ? "success" : "destructive"}>
                    {coupon.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => deleteCoupon(coupon.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
